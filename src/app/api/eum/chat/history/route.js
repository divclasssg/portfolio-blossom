import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';

// GET /api/eum/chat/history?sessionId=ses_007
// 페이지 재방문 시 이전 대화 히스토리 로드
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || 'ses_007';

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
