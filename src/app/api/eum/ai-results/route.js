import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';

// GET /api/eum/ai-results?sessionId=ses_007
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') || 'ses_007';

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('ai_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // result_type별 최신 결과 반환
    const briefing = data.find((r) => r.result_type === 'briefing')?.content || null;
    const suggestions = data.find((r) => r.result_type === 'suggestions')?.content || null;

    return NextResponse.json({ briefing, suggestions });
  } catch (err) {
    console.error('[GET /api/eum/ai-results]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/eum/ai-results — 파이프라인 결과 저장
export async function POST(request) {
  try {
    const { sessionId, resultType, modelVersion, content, generationTimeMs } = await request.json();

    if (!sessionId || !resultType || !content) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('ai_results')
      .insert({
        session_id: sessionId,
        result_type: resultType,
        model_version: modelVersion,
        content,
        generation_time_ms: generationTimeMs,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ai_result: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/eum/ai-results]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
