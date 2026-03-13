/**
 * 이음 AI 파이프라인 — 5단계 순차 처리
 * Stage 1: GPT-4o mini (엔티티 추출)
 * Stage 2: SNOMED CT Browser API (정규화)
 * Stage 3: WHO ICD-11 API (후보 질환 검색)
 * Stage 4: MedGemma on Modal (임상 랭킹) → GPT-4o 폴백
 * Stage 5: GPT-4o (브리핑 생성)
 */

import OpenAI from 'openai';
import path from 'path';
import { readFileSync } from 'fs';
import { getSupabaseClient } from './supabase';

// 정적 JSON 폴백 — 환경 변수 미설정 또는 전체 실패 시 사용
import fallbackBriefing from '../../../projects/eum/_references/data/doctor/04_ai_briefing.json';
import fallbackSuggestions from '../../../projects/eum/_references/data/doctor/05_ai_suggestions.json';

export { fallbackBriefing, fallbackSuggestions };

// ── 환자 데이터 로드 (Supabase + 정적 JSON 혼합) ─────────────
// Supabase: patients, symptom_records (동적)
// 정적 JSON 유지: health_history, medical_records, vitals_wearable (읽기전용)
const DATA_DIR = path.join(
  process.cwd(),
  'src/app/projects/eum/_references/data/patient'
);

export async function loadPatientData(patientId = 'pat_yoon_001') {
  // 정적 JSON은 기존 fs 방식 유지
  const staticFiles = ['02_health_history.json', '04_medical_records.json', '07_vitals_wearable.json'];
  const staticData = Object.fromEntries(
    staticFiles.map((f) => [
      f.replace('.json', ''),
      JSON.parse(readFileSync(path.join(DATA_DIR, f), 'utf8')),
    ])
  );

  // Supabase에서 동적 데이터 조회
  try {
    const supabase = getSupabaseClient();

    const [patientRes, symptomsRes] = await Promise.all([
      supabase.from('patients').select('*').eq('id', patientId).single(),
      supabase.from('symptom_records').select('*').eq('patient_id', patientId).order('occurred_at', { ascending: false }),
    ]);

    if (patientRes.error) throw patientRes.error;
    if (symptomsRes.error) throw symptomsRes.error;

    const patient = patientRes.data;

    return {
      ...staticData,
      // 파이프라인 기존 참조 형식 유지
      '01_patient_profile': {
        patient_id: patient.id,
        profile: { name: patient.name },
        basic_health: {
          birth_date: patient.birth_date,
          gender: patient.gender,
          height_cm: patient.height_cm,
          weight_kg: patient.weight_kg,
          chronic_conditions: patient.chronic_conditions,
          medications: patient.medications,
          allergies: patient.allergies,
        },
      },
      '03_symptom_records': {
        patient_id: patient.id,
        symptom_records: symptomsRes.data,
      },
    };
  } catch (err) {
    // Supabase 미연결 시 정적 JSON 폴백
    console.warn('[loadPatientData] Supabase 조회 실패, 정적 JSON 사용:', err.message);
    const patientProfile = JSON.parse(readFileSync(path.join(DATA_DIR, '01_patient_profile.json'), 'utf8'));
    const symptomRecords = JSON.parse(readFileSync(path.join(DATA_DIR, '03_symptom_records.json'), 'utf8'));
    return {
      ...staticData,
      '01_patient_profile': patientProfile,
      '03_symptom_records': symptomRecords,
    };
  }
}

// ── OpenAI 싱글톤 ─────────────────────────────────────────────
let _openai = null;
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured');
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const MODEL_FAST = 'gpt-4o-mini'; // Stage 1 (엔티티 추출)
const MODEL_PRO  = 'gpt-4o';      // Stage 4 폴백, Stage 5 (브리핑)

// ── ICD-11 토큰 캐싱 (모듈 레벨, 1시간 유효) ─────────────────
let _icd11Token = null;
let _icd11TokenExpiry = 0;

async function getIcd11Token() {
  if (_icd11Token && Date.now() < _icd11TokenExpiry) return _icd11Token;

  const response = await fetch('https://icdaccessmanagement.who.int/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.ICD11_CLIENT_ID,
      client_secret: process.env.ICD11_CLIENT_SECRET,
      scope: 'icdapi_access',
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`ICD-11 token error: ${response.status}`);

  const data = await response.json();
  _icd11Token = data.access_token;
  // 만료 60초 전 갱신
  _icd11TokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return _icd11Token;
}

// ── Stage 1: 엔티티 추출 ───────────────────────────────────────
// GPT-4o mini로 증상 기록에서 의학 엔티티 추출
// english_term 포함 → Stage 2 SNOMED 매핑 정확도 향상
export async function stage1Extract(patientData) {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create(
    {
      model: MODEL_FAST,
      messages: [
        {
          role: 'system',
          content:
            '의료 문서에서 임상 엔티티를 추출하는 AI입니다. 증상, 진단명, 약물, 검사결과, 시술명을 추출하세요. ' +
            '각 엔티티에 대해 한국어 원문(term), 영어 번역(english_term), 유형(type), ' +
            '연관 증상 ID(source_symptom_id, 없으면 빈 문자열), 맥락(context)을 반환하세요. ' +
            'JSON으로만 응답하세요.',
        },
        {
          role: 'user',
          // null, 2 인덴트 제거 → 토큰 절감 (~40%)
          content: `다음 환자 데이터에서 임상 엔티티를 추출하세요:\n\n${JSON.stringify(patientData)}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'entity_extraction',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              entities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    term: { type: 'string' },
                    english_term: { type: 'string' },
                    type: {
                      type: 'string',
                      enum: ['symptom', 'diagnosis', 'medication', 'lab_result', 'procedure'],
                    },
                    source_symptom_id: { type: 'string' },
                    context: { type: 'string' },
                  },
                  required: ['term', 'english_term', 'type', 'source_symptom_id', 'context'],
                  additionalProperties: false,
                },
              },
            },
            required: ['entities'],
            additionalProperties: false,
          },
        },
      },
    },
    { signal: AbortSignal.timeout(60000) }
  );

  return JSON.parse(completion.choices[0].message.content);
}

// ── Stage 2: SNOMED CT 정규화 ──────────────────────────────────
// 공개 SNOMED CT Browser API (키 불필요)
// symptom/diagnosis 엔티티만 대상, 영어 용어로 검색
export async function stage2Normalize(entities) {
  const targets = entities.filter(
    (e) => e.type === 'symptom' || e.type === 'diagnosis'
  );

  const mappings = (
    await Promise.all(
      targets.map(async (entity) => {
        try {
          const searchTerm = entity.english_term || entity.term;
          const encoded = encodeURIComponent(searchTerm);
          const res = await fetch(
            `https://browser.ihtsdotools.org/api/snomed/en-edition/v20231001/concepts?term=${encoded}&activeFilter=true&limit=1`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (!res.ok) return null;
          const data = await res.json();
          const match = data.items?.[0];
          if (!match) return null;
          return {
            original_term: entity.term,
            snomed_code: match.conceptId,
            snomed_term: match.pt?.term || match.fsn?.term,
          };
        } catch {
          return null;
        }
      })
    )
  ).filter(Boolean);

  return { mappings };
}

// ── Stage 3: ICD-11 후보 질환 검색 ────────────────────────────
// WHO ICD-11 API (OAuth2 토큰 캐싱)
export async function stage3Candidates(mappings, entities) {
  if (!process.env.ICD11_CLIENT_ID || !process.env.ICD11_CLIENT_SECRET) {
    throw new Error('ICD-11 credentials not configured');
  }

  const token = await getIcd11Token();

  // 검색어: SNOMED 매핑된 용어 우선, 없으면 영어 엔티티 용어
  const searchTerms = mappings.length > 0
    ? mappings.map((m) => m.snomed_term)
    : entities
        .filter((e) => e.type === 'symptom' || e.type === 'diagnosis')
        .map((e) => e.english_term || e.term);

  const uniqueTerms = [...new Set(searchTerms)].slice(0, 5);

  const candidateArrays = await Promise.all(
    uniqueTerms.map(async (term) => {
      try {
        const encoded = encodeURIComponent(term);
        const res = await fetch(
          `https://id.who.int/icd/entity/search?q=${encoded}&subtreeFilterUsage=undefined&includeKeywordResult=true&releaseId=2024-01&linearizationname=mms&flatResults=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept-Language': 'en',
              'API-Version': 'v2',
            },
            signal: AbortSignal.timeout(10000),
          }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.destinationEntities || []).slice(0, 3).map((e) => {
          // theCode가 null인 경우 id URI 마지막 세그먼트 사용
          const code = e.theCode || e.id?.split('/').pop() || null;
          // title에서 HTML <em> 태그 제거
          const name = e.title?.replace(/<[^>]+>/g, '') || '';
          return {
            icd_code: code,
            disease_name: name,
            relevance_score: e.score || 0,
          };
        });
      } catch {
        return [];
      }
    })
  );

  // 중복 제거 (icd_code 기준)
  const seen = new Set();
  const candidates = candidateArrays
    .flat()
    // icd_code가 null인 항목 + disease_name이 없는 항목 제외, 중복 제거
    .filter((c) => c.icd_code && c.disease_name && !seen.has(c.icd_code) && seen.add(c.icd_code))
    .slice(0, 15);

  return { candidates };
}

// ── Stage 4: MedGemma 랭킹 (Modal) ────────────────────────────
// MODAL_ENDPOINT_URL 미설정 시 즉시 에러 → stage4RankGptFallback으로 전환
export async function stage4Rank(candidates, patientData) {
  const modalUrl = process.env.MODAL_ENDPOINT_URL;
  if (!modalUrl) throw new Error('Modal endpoint not configured');

  const res = await fetch(modalUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidates, patient_data: patientData }),
    signal: AbortSignal.timeout(60000), // 콜드 스타트 60초
  });

  if (!res.ok) throw new Error(`Modal API error: ${res.status}`);

  return res.json(); // { suggestions: [...] }
}

// ── Stage 4 폴백: GPT-4o 랭커 ─────────────────────────────────
// Modal 타임아웃/에러 시 GPT-4o로 동일한 랭킹 작업 수행
export async function stage4RankGptFallback(candidates, patientData) {
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create(
    {
      model: MODEL_PRO,
      messages: [
        {
          role: 'system',
          content:
            '의료 AI 감별진단 도우미입니다. 환자 데이터와 ICD-11 후보 질환을 분석해 ' +
            '임상 근거에 따라 5개 이하로 순위를 매기세요. JSON으로만 응답하세요.',
        },
        {
          role: 'user',
          content:
            `환자 데이터:\n${JSON.stringify(patientData, null, 2)}\n\n` +
            `ICD-11 후보 질환:\n${JSON.stringify(candidates, null, 2)}\n\n` +
            '위 데이터를 바탕으로 임상 근거가 가장 강한 순으로 5개 이하 질환을 랭킹하세요.',
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ranked_suggestions',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              suggestions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    rank: { type: 'number' },
                    disease_name: { type: 'string' },
                    icd_code: { type: 'string' },
                    evidence_symptoms: { type: 'array', items: { type: 'string' } },
                    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
                    clinical_note: { type: 'string' },
                  },
                  required: [
                    'rank', 'disease_name', 'icd_code',
                    'evidence_symptoms', 'confidence', 'clinical_note',
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ['suggestions'],
            additionalProperties: false,
          },
        },
      },
    },
    { signal: AbortSignal.timeout(60000) }
  );

  return JSON.parse(completion.choices[0].message.content);
}

// ── Stage 5: GPT-4o 브리핑 생성 ────────────────────────────────
// 랭킹 결과 + 환자 데이터 → 의사용 브리핑 (04_ai_briefing.json 스키마)
export async function stage5Report(rankedResult, patientData) {
  const openai = getOpenAI();
  const now = new Date().toISOString();
  const startMs = Date.now();

  const completion = await openai.chat.completions.create(
    {
      model: MODEL_PRO,
      messages: [
        {
          role: 'system',
          content:
            '의료 AI 브리핑 작성 도우미입니다. 환자 데이터와 감별진단 결과를 바탕으로 ' +
            '의사가 진료 전 15~30초 안에 파악할 수 있는 임상 요약을 작성하세요. ' +
            '언어: 한국어. JSON으로만 응답하세요.',
        },
        {
          role: 'user',
          content:
            `환자 데이터:\n${JSON.stringify(patientData)}\n\n` +
            `감별진단 랭킹:\n${JSON.stringify(rankedResult.suggestions)}\n\n` +
            `session_id: ses_007, generated_at: ${now}\n\n` +
            '브리핑(summary_text, 2-3개 highlights, referral_context)을 작성하세요.\n' +
            '주의: highlights의 type은 "recurring"|"abnormal"|"worsening" 중 하나, ' +
            'badge_color는 hex 색상(예: "#E69F00" 경고, "#CC0000" 위험, "#2166AC" 정보).',
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'briefing_content',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              summary_text: { type: 'string' },
              period_label: { type: 'string' },
              period_from: { type: 'string' },
              period_to: { type: 'string' },
              period_range_label: { type: 'string' },
              highlights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['recurring', 'abnormal', 'worsening'] },
                    badge_color: { type: 'string' },
                    icon: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    evidence: { type: 'array', items: { type: 'string' } },
                  },
                  required: ['type', 'badge_color', 'icon', 'title', 'description', 'evidence'],
                  additionalProperties: false,
                },
              },
              referring_doctor_summary: { type: 'string' },
              requested_tests: { type: 'array', items: { type: 'string' } },
            },
            required: [
              'summary_text', 'period_label', 'period_from', 'period_to',
              'period_range_label', 'highlights', 'referring_doctor_summary', 'requested_tests',
            ],
            additionalProperties: false,
          },
        },
      },
    },
    { signal: AbortSignal.timeout(60000) }
  );

  const content = JSON.parse(completion.choices[0].message.content);
  const now2 = new Date().toISOString();

  // 04_ai_briefing.json 스키마에 맞게 조립
  const briefing = {
    session_id: 'ses_007',
    screen_feature: 'F11',
    model_version: 'GPT-4o',
    generated_at: now2,
    generation_time_ms: Date.now() - startMs,
    period_label: content.period_label,
    period_range: {
      from: content.period_from,
      to: content.period_to,
      label: content.period_range_label,
    },
    summary_text: content.summary_text,
    highlights: content.highlights,
    referral_context: {
      referring_doctor_summary: content.referring_doctor_summary,
      requested_tests: content.requested_tests,
    },
  };

  return { briefing };
}

// ── 오케스트레이터 ─────────────────────────────────────────────
// 5단계 순차 실행, 단계별 폴백
export async function runFullPipeline() {
  const pipelineStartMs = Date.now();
  const pipelineStages = {
    entity_extraction: null,
    normalization: null,
    retrieval: null,
    clinical_reasoning: null,
    report_generation: null,
  };

  // ─ Stage 1 ─
  let patientData, entities;
  try {
    patientData = await loadPatientData();
    const result = await stage1Extract(patientData);
    entities = result.entities;
    pipelineStages.entity_extraction = {
      model: 'GPT-4o mini',
      extracted_count: entities.length,
    };
  } catch (e) {
    console.error('[pipeline] Stage 1 failed:', e.message);
    return {
      briefing: fallbackBriefing,
      suggestions: fallbackSuggestions,
      is_fallback: true,
    };
  }

  // ─ Stage 2 ─
  let mappings = [];
  try {
    const result = await stage2Normalize(entities);
    mappings = result.mappings;
    pipelineStages.normalization = {
      service: 'SNOMED CT Terminology Service',
      mapped_count: mappings.length,
    };
  } catch (e) {
    console.error('[pipeline] Stage 2 failed, skipping:', e.message);
    pipelineStages.normalization = { service: 'skipped', mapped_count: 0 };
  }

  // ─ Stage 3 ─
  let candidates = [];
  try {
    const result = await stage3Candidates(mappings, entities);
    candidates = result.candidates;
    pipelineStages.retrieval = {
      source: 'ICD-11 Candidate DB',
      candidates_filtered: candidates.length,
    };
  } catch (e) {
    console.error('[pipeline] Stage 3 failed, using entity fallback:', e.message);
    // SNOMED 코드를 후보로 대체
    candidates = mappings.map((m) => ({
      icd_code: m.snomed_code,
      disease_name: m.snomed_term,
      relevance_score: 0.5,
    }));
    pipelineStages.retrieval = { source: 'snomed_fallback', candidates_filtered: candidates.length };
  }

  // ─ Stage 4 (Modal → GPT-4o 폴백) ─
  let ranked;
  let stage4ModelUsed = 'MedGemma 4B';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      ranked = await (attempt === 0
        ? stage4Rank(candidates, patientData)
        : stage4RankGptFallback(candidates, patientData));
      stage4ModelUsed = attempt === 0 ? 'MedGemma 4B' : 'GPT-4o (fallback)';
      break;
    } catch (e) {
      console.error(`[pipeline] Stage 4 attempt ${attempt + 1} failed:`, e.message);
      if (attempt === 1) {
        ranked = { suggestions: fallbackSuggestions.suggestions };
        stage4ModelUsed = 'static_fallback';
      }
    }
  }
  pipelineStages.clinical_reasoning = {
    model: stage4ModelUsed,
    ranked_count: ranked.suggestions?.length || 0,
  };

  // ─ Stage 5 ─
  let briefing;
  try {
    const result = await stage5Report(ranked, patientData);
    briefing = result.briefing;
    pipelineStages.report_generation = {
      model: 'GPT-4o',
      outputs: ['briefing', 'suggestions'],
    };
  } catch (e) {
    console.error('[pipeline] Stage 5 failed, using fallback briefing:', e.message);
    briefing = fallbackBriefing;
    pipelineStages.report_generation = { model: 'static_fallback', outputs: ['briefing'] };
  }

  // 05_ai_suggestions.json 스키마에 맞게 suggestions 래퍼 조립
  const suggestions = {
    session_id: 'ses_007',
    screen_feature: 'F13',
    model_version: stage4ModelUsed,
    generated_at: new Date().toISOString(),
    generation_time_ms: Date.now() - pipelineStartMs,
    pipeline_stages: pipelineStages,
    suggestions: ranked.suggestions,
    doctor_edits: { added: [], deleted: [], reordered: [] },
  };

  return { briefing, suggestions, is_fallback: false };
}
