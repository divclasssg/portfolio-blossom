import { redirect } from 'next/navigation';
import { getPatientId } from '../_lib/getPatientId';

export const dynamic = 'force-dynamic';

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

// 1순위: 쿠키 → 2순위: DB 최신 환자 → 3순위: 정적 JSON 데모
export default async function DoctorRedirect() {
    const patientId = (await getPatientId()) || (await getLatestPatientId()) || 'pat_yoon_001';
    redirect(`/projects/eum/doctor/${patientId}`);
}
