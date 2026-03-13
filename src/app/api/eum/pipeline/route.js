// 오케스트레이터 — 5단계 순차 호출, 최종 { briefing, suggestions } 반환
// POST /api/eum/pipeline
import { NextResponse } from 'next/server';
import { runFullPipeline } from '../_lib/pipeline';
import { getSupabaseClient } from '../_lib/supabase';

// 전체 파이프라인 타임아웃: 90초 (Next.js default route timeout 초과 방지)
export const maxDuration = 90;

// ── 인메모리 캐시 ────────────────────────────────────────────────
// 포트폴리오 데모에서 매 요청마다 파이프라인을 재실행하지 않도록 캐싱
// 새 증상 추가 시(invalidateCache 호출 시) 캐시 무효화 → 재분석
const CACHE_TTL_MS = 60 * 60 * 1000;   // 1시간
const ERROR_CACHE_TTL_MS = 5 * 60 * 1000; // 에러 시 5분간 재시도 방지

let _cache = null;   // { result, expiresAt }
let _running = null; // 진행 중인 파이프라인 Promise (중복 실행 방지)

// 새 증상 추가 시 호출 → 캐시 무효화
export function invalidatePipelineCache() {
  _cache = null;
}

// 파이프라인 결과를 Supabase ai_results에 저장
async function saveToDb(result, sessionId = 'ses_007') {
  if (result.is_fallback) return; // 폴백 결과는 저장하지 않음

  try {
    const supabase = getSupabaseClient();
    const rows = [];

    if (result.briefing) {
      rows.push({
        session_id: sessionId,
        result_type: 'briefing',
        model_version: result.briefing.model_version,
        content: result.briefing,
        generation_time_ms: result.briefing.generation_time_ms,
      });
    }
    if (result.suggestions) {
      rows.push({
        session_id: sessionId,
        result_type: 'suggestions',
        model_version: result.suggestions.model_version,
        content: result.suggestions,
        generation_time_ms: result.suggestions.generation_time_ms,
      });
    }

    if (rows.length > 0) {
      await supabase.from('ai_results').insert(rows);
    }
  } catch (err) {
    // DB 저장 실패는 파이프라인 결과 반환에 영향 없음
    console.warn('[pipeline/route] ai_results 저장 실패:', err.message);
  }
}

export async function POST() {
  // 캐시 히트
  if (_cache && Date.now() < _cache.expiresAt) {
    return NextResponse.json({ ..._cache.result, cached: true });
  }

  // 이미 파이프라인이 실행 중이면 완료까지 대기 (중복 API 호출 방지)
  if (_running) {
    try {
      const result = await _running;
      return NextResponse.json(result);
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // 신규 파이프라인 실행
  _running = runFullPipeline().then(async (result) => {
    _cache = { result, expiresAt: Date.now() + CACHE_TTL_MS };
    _running = null;
    // DB 저장 (비동기, 응답 차단 안 함)
    saveToDb(result);
    return result;
  }).catch((e) => {
    _cache = {
      result: { error: e.message, is_fallback: true },
      expiresAt: Date.now() + ERROR_CACHE_TTL_MS,
    };
    _running = null;
    throw e;
  });

  try {
    const result = await _running;
    return NextResponse.json(result);
  } catch (e) {
    console.error('[pipeline/route] Unhandled error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
