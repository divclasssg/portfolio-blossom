// 오케스트레이터 — 5단계 순차 호출, 최종 { briefing, suggestions } 반환
// POST /api/eum/pipeline
import { NextResponse } from 'next/server';
import {
    runFullPipeline,
    getCachedResult,
    setCachedResult,
    getRunningPipeline,
    setRunningPipeline,
    clearRunningPipeline,
} from '../_lib/pipeline';
import { getSupabaseClient } from '../_lib/supabase';
import { getLatestSessionId } from '../_lib/getLatestSession';

// 전체 파이프라인 타임아웃: 90초 (Next.js default route timeout 초과 방지)
export const maxDuration = 90;

// 파이프라인 결과를 Supabase ai_results에 저장
async function saveToDb(result, sessionId) {
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

export async function POST(request) {
    // patientId 수신 → 동적 sessionId 조회
    let patientId = null;
    let sessionId = null;
    try {
        const body = await request.json();
        patientId = body.patientId || null;
    } catch {
        // body 없으면 무시
    }

    if (patientId) {
        try {
            const supabase = getSupabaseClient();
            sessionId = await getLatestSessionId(supabase, patientId);
        } catch {
            // sessionId 조회 실패 → null (저장 스킵)
        }
    }

    // 캐시 히트
    const cached = getCachedResult();
    if (cached) {
        return NextResponse.json({ ...cached, cached: true });
    }

    // 이미 파이프라인이 실행 중이면 완료까지 대기 (중복 API 호출 방지)
    const running = getRunningPipeline();
    if (running) {
        try {
            const result = await running;
            return NextResponse.json(result);
        } catch (e) {
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }

    // 신규 파이프라인 실행
    const pipeline = runFullPipeline(patientId, sessionId)
        .then(async (result) => {
            setCachedResult(result);
            clearRunningPipeline();
            // DB 저장 (비동기, 응답 차단 안 함)
            if (sessionId) saveToDb(result, sessionId);
            return result;
        })
        .catch((e) => {
            setCachedResult({ error: e.message, is_fallback: true }, true);
            clearRunningPipeline();
            throw e;
        });
    setRunningPipeline(pipeline);

    try {
        const result = await pipeline;
        return NextResponse.json(result);
    } catch (e) {
        console.error('[pipeline/route] Unhandled error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
