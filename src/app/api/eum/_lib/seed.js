/**
 * 이음 DB 시드 스크립트
 * 기존 JSON 참조 데이터를 Supabase 테이블에 삽입
 *
 * 실행: node src/app/api/eum/_lib/seed.js
 * 필요 환경 변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env.local 수동 로드 (dotenv 의존성 없이)
function loadEnv() {
    const envPath = path.join(__dirname, '../../../../..', '.env.local');
    try {
        const content = readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx < 0) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) process.env[key] = value;
        }
    } catch {
        // .env.local 없으면 환경 변수 직접 사용
    }
}
loadEnv();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

const DATA_PATIENT = path.join(__dirname, '../../../projects/eum/_references/data/patient');
const DATA_DOCTOR = path.join(__dirname, '../../../projects/eum/_references/data/doctor');

function readJson(dir, filename) {
    return JSON.parse(readFileSync(path.join(dir, filename), 'utf8'));
}

// ── patients 테이블 시드 ────────────────────────────────────────
async function seedPatients() {
    const profile = readJson(DATA_PATIENT, '01_patient_profile.json');

    const row = {
        id: profile.patient_id,
        name: profile.profile.name,
        birth_date: profile.basic_health.birth_date,
        gender: profile.basic_health.gender,
        height_cm: profile.basic_health.height_cm,
        weight_kg: profile.basic_health.weight_kg,
        // JSON 문자열 배열 → 구조화된 JSONB (간단 변환)
        chronic_conditions: profile.basic_health.chronic_conditions.map((c) => ({ name: c })),
        medications: profile.basic_health.medications.map((m) => ({ name: m })),
        allergies: profile.basic_health.allergies.map((a) => {
            const [allergen, reaction] = a.split(' (');
            return { allergen, reaction: reaction?.replace(')', '') || '' };
        }),
    };

    const { error } = await supabase.from('patients').upsert(row);
    if (error) throw error;
    console.log('✓ patients — 1개 삽입');
}

// ── sessions 테이블 시드 ────────────────────────────────────────
async function seedSessions() {
    const data = readJson(DATA_PATIENT, '05_consultation_sessions.json');

    const rows = data.sessions.map((s) => ({
        id: s.session_id,
        patient_id: data.patient_id,
        // doctor_id는 doctor_name 기반 간이 ID (JSON에 따로 없음)
        doctor_id: s.doctor_name === '박지영' ? 'doc_park_001' : 'doc_kim_001',
        referral_from: s.referral_from || null,
        status: s.status,
        created_at: s.created_at,
    }));

    const { error } = await supabase.from('sessions').upsert(rows);
    if (error) throw error;
    console.log(`✓ sessions — ${rows.length}개 삽입`);
}

// ── symptom_records 테이블 시드 ────────────────────────────────
async function seedSymptomRecords() {
    const data = readJson(DATA_PATIENT, '03_symptom_records.json');

    // 세션-증상 매핑 (05_consultation_sessions.json 기준)
    const sessions = readJson(DATA_PATIENT, '05_consultation_sessions.json');
    const symptomToSession = {};
    sessions.sessions.forEach((s) => {
        (s.symptom_ids || []).forEach((sid) => {
            symptomToSession[sid] = s.session_id;
        });
    });

    const rows = data.symptom_records.map((r) => ({
        symptom_id: r.symptom_id,
        patient_id: data.patient_id,
        session_id: symptomToSession[r.symptom_id] || null,
        description: r.description,
        voice_transcript: r.voice_transcript,
        occurred_at: r.occurred_at,
        severity: r.severity,
        category_code: r.category_code,
        location_type: r.location_type,
    }));

    const { error } = await supabase
        .from('symptom_records')
        .upsert(rows, { onConflict: 'symptom_id' });
    if (error) throw error;
    console.log(`✓ symptom_records — ${rows.length}개 삽입`);
}

// ── ai_results 테이블 시드 ─────────────────────────────────────
async function seedAiResults() {
    const briefing = readJson(DATA_DOCTOR, '04_ai_briefing.json');
    const suggestions = readJson(DATA_DOCTOR, '05_ai_suggestions.json');

    const rows = [
        {
            session_id: briefing.session_id,
            result_type: 'briefing',
            model_version: briefing.model_version,
            content: briefing,
            generation_time_ms: briefing.generation_time_ms,
            created_at: briefing.generated_at,
        },
        {
            session_id: suggestions.session_id,
            result_type: 'suggestions',
            model_version: suggestions.model_version,
            content: suggestions,
            generation_time_ms: suggestions.generation_time_ms,
            created_at: suggestions.generated_at,
        },
    ];

    const { error } = await supabase.from('ai_results').insert(rows);
    if (error) throw error;
    console.log(`✓ ai_results — ${rows.length}개 삽입`);
}

// ── 메인 ───────────────────────────────────────────────────────
async function main() {
    console.log('이음 DB 시드 시작...\n');

    try {
        await seedPatients();
        await seedSessions();
        await seedSymptomRecords();
        await seedAiResults();
        console.log('\n✅ 시드 완료');
    } catch (err) {
        console.error('\n❌ 시드 실패:', err.message);
        process.exit(1);
    }
}

main();
