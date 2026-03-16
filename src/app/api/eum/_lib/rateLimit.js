import { NextResponse } from 'next/server';

// 인메모리 sliding window Rate Limiter
// Vercel Serverless에서 콜드 스타트 시 초기화되지만,
// 같은 인스턴스 내 연속 호출은 차단됨
export function createRateLimiter({ windowMs = 60_000, max = 10 } = {}) {
    const hits = new Map(); // key(IP) → [timestamp, ...]

    // 5분마다 만료된 엔트리 정리 (메모리 누수 방지)
    let lastCleanup = Date.now();
    function cleanup() {
        const now = Date.now();
        if (now - lastCleanup < 300_000) return;
        lastCleanup = now;
        const cutoff = now - windowMs;
        for (const [key, timestamps] of hits) {
            const valid = timestamps.filter((t) => t > cutoff);
            if (valid.length === 0) hits.delete(key);
            else hits.set(key, valid);
        }
    }

    return {
        check(key) {
            cleanup();
            const now = Date.now();
            const cutoff = now - windowMs;
            const timestamps = (hits.get(key) || []).filter((t) => t > cutoff);
            if (timestamps.length >= max) {
                return { allowed: false, remaining: 0 };
            }
            timestamps.push(now);
            hits.set(key, timestamps);
            return { allowed: true, remaining: max - timestamps.length };
        },
    };
}

// 요청에서 IP 추출
export function getClientIp(request) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

// Rate Limit 초과 시 429 응답
export function rateLimitResponse() {
    return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429, headers: { 'Retry-After': '60' } }
    );
}
