import { redirect } from 'next/navigation';
import { getPatientId } from '../_lib/getPatientId';

export const dynamic = 'force-dynamic';

const SHOWCASE_PATIENT_ID = 'pat_admin_001';

// DB에서 가장 최근 온보딩된 환자 조회
async function getLatestPatientId() {
    try {
        const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data } = await supabase
            .from('patients')
            .select('id')
            .order('onboarded_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        return data?.id ?? null;
    } catch {
        return null;
    }
}

// 1순위: 고정 ID 쿠키 신뢰
// 2순위: pat_demo_* 쿠키 → DB 최신 환자 우선 (UT 재실행 시 stale 방지)
// 3순위: 쿠키 없음 → 큐레이팅된 쇼케이스 환자
export default async function DoctorRedirect() {
    const cookieId = await getPatientId();
    let patientId;

    if (cookieId && !cookieId.startsWith('pat_demo_')) {
        // pat_admin_001 등 고정 ID → 쿠키 신뢰
        patientId = cookieId;
    } else if (cookieId) {
        // pat_demo_* 쿠키 → DB 최신 환자 우선 (UT 중 stale 방지)
        patientId = (await getLatestPatientId()) || cookieId;
    } else {
        // 쿠키 없음 (포트폴리오 방문자) → 큐레이팅된 쇼케이스 환자
        patientId = SHOWCASE_PATIENT_ID;
    }

    redirect(`/projects/eum/doctor/${patientId}`);
}
