import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';
import { revalidateDoctorResult, revalidatePatientHome, revalidatePatientSummary } from '../_lib/revalidate';
import { createRateLimiter, getClientIp, rateLimitResponse } from '../_lib/rateLimit';
import { isValidSessionId } from '../_lib/validate';

const limiter = createRateLimiter({ windowMs: 60_000, max: 5 });

// POST /api/eum/transmit — 의사 진료 결과 전송 (환자앱 조회용 저장)
export async function POST(request) {
    const { allowed } = limiter.check(getClientIp(request));
    if (!allowed) return rateLimitResponse();

    try {
        const body = await request.json();
        const { sessionId, doctorId, doctorName, hospitalName, diagnosisName, content } = body;

        if (!sessionId || !doctorId || !doctorName || !content) {
            return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
        }
        if (!isValidSessionId(sessionId)) {
            return NextResponse.json({ error: '잘못된 형식의 sessionId입니다' }, { status: 400 });
        }

        const supabase = getSupabaseClient();

        // 전송 시점 기준으로 동적 날짜 설정
        const now = new Date();
        const nextVisit = new Date(now);
        nextVisit.setDate(nextVisit.getDate() + 7);
        const nextVisitDate = nextVisit.toISOString().slice(0, 10);
        const todayDate = now.toISOString().slice(0, 10);

        const adjustedContent = {
            ...content,
            next_visit_date: nextVisitDate,
        };
        // 타과의뢰가 있으면 의뢰일 추가
        if (adjustedContent.referral) {
            adjustedContent.referral = { ...adjustedContent.referral, referral_date: todayDate };
        }

        // consultation_results UPSERT (재전송 시 기존 행 덮어쓰기)
        const transmittedAt = new Date().toISOString();
        const { error: upsertError } = await supabase.from('consultation_results').upsert({
            session_id: sessionId,
            doctor_id: doctorId,
            doctor_name: doctorName,
            hospital_name: hospitalName || null,
            diagnosis_name: diagnosisName || null,
            content: adjustedContent,
            transmitted_at: transmittedAt,
        }, { onConflict: 'session_id' });

        if (upsertError) {
            console.error('[POST /api/eum/transmit] UPSERT 에러:', upsertError.message);
            throw upsertError;
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
            // 결과는 저장됐으나 세션 상태 미갱신 — 클라이언트에 경고 전달
            return NextResponse.json(
                { success: true, warning: '결과 저장 완료, 세션 상태 갱신 실패' },
                { status: 201 }
            );
        }

        // 관련 페이지 캐시 무효화 — sessions에서 patient_id 조회
        const { data: sessionData } = await supabase
            .from('sessions')
            .select('patient_id')
            .eq('id', sessionId)
            .maybeSingle();
        if (sessionData?.patient_id) {
            revalidateDoctorResult(sessionData.patient_id);
            revalidatePatientHome(sessionData.patient_id);
            revalidatePatientSummary(sessionData.patient_id);
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/eum/transmit]', err.message);
        return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
    }
}
