// Stage 3: ICD-11 후보 질환 검색
// POST /api/eum/candidates — body: { mappings: [...], entities: [...] }
import { NextResponse } from 'next/server';
import { stage3Candidates } from '../_lib/pipeline';
import { createRateLimiter, getClientIp, rateLimitResponse } from '../_lib/rateLimit';
import { requireEnv } from '../_lib/envCheck';

const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export async function POST(request) {
    const envError = requireEnv('ICD11_CLIENT_ID');
    if (envError) return envError;

    const { allowed } = limiter.check(getClientIp(request));
    if (!allowed) return rateLimitResponse();

    try {
        const { mappings = [], entities = [] } = await request.json();
        const result = await stage3Candidates(mappings, entities);
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
