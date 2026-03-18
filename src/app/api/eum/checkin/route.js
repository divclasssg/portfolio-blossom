// POST /api/eum/checkin — 환자 체크인(접수) → active 세션 생성
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';
import { getActiveSessionId, getLatestSessionId } from '../_lib/getLatestSession';
import { isValidPatientId } from '../_lib/validate';
import { revalidateDoctor } from '../_lib/revalidate';

export async function POST(request) {
    let patientId;
    try {
        const body = await request.json();
        patientId = body.patientId;
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!patientId || !isValidPatientId(patientId)) {
        return NextResponse.json({ error: 'Invalid patientId' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // 멱등성: 이미 active 세션이 있으면 기존 반환
    const existingActiveId = await getActiveSessionId(supabase, patientId);
    if (existingActiveId) {
        return NextResponse.json({ sessionId: existingActiveId, created: false });
    }

    // 이전 세션의 chief_complaint 복사 (있으면)
    const latestId = await getLatestSessionId(supabase, patientId);
    let chiefComplaint = null;
    if (latestId) {
        const { data } = await supabase
            .from('sessions')
            .select('chief_complaint')
            .eq('id', latestId)
            .single();
        chiefComplaint = data?.chief_complaint ?? null;
    }

    // 새 active 세션 생성
    const { data: newSession, error } = await supabase
        .from('sessions')
        .insert({
            patient_id: patientId,
            doctor_id: 'doc_kim_001',
            status: 'active',
            chief_complaint: chiefComplaint,
        })
        .select('id')
        .single();

    if (error) {
        console.error('[checkin] 세션 생성 실패:', error.message);
        return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
    }

    // 의사 대시보드 캐시 무효화
    revalidateDoctor(patientId);

    return NextResponse.json({ sessionId: newSession.id, created: true });
}
