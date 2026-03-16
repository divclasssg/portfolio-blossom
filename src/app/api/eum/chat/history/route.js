import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { createRateLimiter, getClientIp, rateLimitResponse } from '../../_lib/rateLimit';
import { isValidSessionId } from '../../_lib/validate';

const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

// GET /api/eum/chat/history?sessionId=ses_007
// 페이지 재방문 시 이전 대화 히스토리 로드
export async function GET(request) {
    const { allowed } = limiter.check(getClientIp(request));
    if (!allowed) return rateLimitResponse();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId || !isValidSessionId(sessionId)) {
        return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('chat_messages')
            .select('role, content, metadata, created_at')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return NextResponse.json({ messages: data });
    } catch (err) {
        console.error('[GET /api/eum/chat/history]', err.message);
        return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
    }
}
