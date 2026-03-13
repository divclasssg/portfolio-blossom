import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';
import { invalidatePipelineCache } from '../_lib/pipeline';

// GET /api/eum/symptoms?patientId=pat_yoon_001
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId') || 'pat_yoon_001';

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('symptom_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('occurred_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ symptom_records: data });
  } catch (err) {
    console.error('[GET /api/eum/symptoms]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/eum/symptoms — 새 증상 기록 삽입
export async function POST(request) {
  try {
    const body = await request.json();
    const { patientId, sessionId, description, voiceTranscript, occurredAt, severity, categoryCode, locationType } = body;

    if (!patientId || !occurredAt || !severity || !categoryCode) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // 자동 symptom_id 생성: 기존 최대 번호 + 1
    const { data: existing } = await supabase
      .from('symptom_records')
      .select('symptom_id')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNum = existing?.[0]?.symptom_id
      ? parseInt(existing[0].symptom_id.replace('sym_', ''), 10)
      : 0;
    const symptomId = `sym_${String(lastNum + 1).padStart(3, '0')}`;

    const row = {
      symptom_id: symptomId,
      patient_id: patientId,
      session_id: sessionId || null,
      description: description || null,
      voice_transcript: voiceTranscript || null,
      occurred_at: occurredAt,
      severity,
      category_code: categoryCode,
      location_type: locationType || 'HOME',
    };

    const { data, error } = await supabase
      .from('symptom_records')
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error('[POST /api/eum/symptoms] DB 에러:', error.code, error.message, error.details);
      // FK 위반 구체적 메시지
      if (error.code === '23503') {
        return NextResponse.json(
          { error: '환자 또는 세션이 존재하지 않습니다', detail: error.details },
          { status: 400 }
        );
      }
      // 중복 키 위반
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '중복된 증상 ID', detail: error.details },
          { status: 409 }
        );
      }
      throw error;
    }

    // 해당 세션의 ai_results 무효화 (재분석 유도)
    if (sessionId) {
      await supabase.from('ai_results').delete().eq('session_id', sessionId);
    }

    // 인메모리 파이프라인 캐시도 무효화 → 다음 요청 시 재분석
    invalidatePipelineCache();

    return NextResponse.json({ symptom_record: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/eum/symptoms]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
