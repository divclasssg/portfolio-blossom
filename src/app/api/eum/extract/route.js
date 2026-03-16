// Stage 1: GPT-4o mini 엔티티 추출
// POST /api/eum/extract — 독립 테스트용
import { NextResponse } from 'next/server';
import { loadPatientData, stage1Extract } from '../_lib/pipeline';
import { createRateLimiter, getClientIp, rateLimitResponse } from '../_lib/rateLimit';
import { requireEnv } from '../_lib/envCheck';

const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

export async function POST(request) {
    const envError = requireEnv('OPENAI_API_KEY');
    if (envError) return envError;

    const { allowed } = limiter.check(getClientIp(request));
    if (!allowed) return rateLimitResponse();

    try {
        const patientData = await loadPatientData();
        const result = await stage1Extract(patientData);
        return NextResponse.json(result);
    } catch (e) {
        console.error('[extract] error:', e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
