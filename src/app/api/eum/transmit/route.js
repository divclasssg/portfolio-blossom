import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';

// POST /api/eum/transmit — 의사 진료 결과 전송 (환자앱 조회용 저장)
export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionId, doctorId, doctorName, hospitalName, diagnosisName, content } = body;

        if (!sessionId || !doctorId || !doctorName || !content) {
            return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
        }

        const supabase = getSupabaseClient();

        // consultation_results INSERT
        const { error: insertError } = await supabase.from('consultation_results').insert({
            session_id: sessionId,
            doctor_id: doctorId,
            doctor_name: doctorName,
            hospital_name: hospitalName || null,
            diagnosis_name: diagnosisName || null,
            content,
        });

        if (insertError) {
            // 중복 전송 (session_id UNIQUE 위반)
            if (insertError.code === '23505') {
                return NextResponse.json(
                    { error: '이미 전송된 세션입니다' },
                    { status: 409 }
                );
            }
            console.error('[POST /api/eum/transmit] INSERT 에러:', insertError.message);
            throw insertError;
        }

        // sessions 상태 업데이트
        const { error: updateError } = await supabase
            .from('sessions')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                transmitted_at: new Date().toISOString(),
            })
            .eq('id', sessionId);

        if (updateError) {
            console.error('[POST /api/eum/transmit] UPDATE 에러:', updateError.message);
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/eum/transmit]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
