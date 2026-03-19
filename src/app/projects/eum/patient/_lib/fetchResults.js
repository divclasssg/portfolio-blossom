import { cache } from 'react';

// Supabase에서 환자 정보 조회 (실패 시 null 반환)
// cache()로 감싸서 같은 요청 내 layout.js + page.js 중복 호출 방지
export const fetchPatientInfo = cache(async function fetchPatientInfo(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('patients')
            .select('name, wearable_device, onboarded_at')
            .eq('id', patientId)
            .single();
        if (error) throw error;
        return data ?? null;
    } catch (err) {
        console.error('[fetchPatientInfo] 환자 정보 조회 실패:', err.message);
        return null;
    }
});

// 전송 완료된 진료 결과 목록 조회 (토스트 알림 + 최근 진료 카드용)
export const fetchTransmittedResults = cache(async function fetchTransmittedResults(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('consultation_results')
            .select(`
                session_id, doctor_name, hospital_name,
                diagnosis_name, transmitted_at,
                sessions!inner(patient_id)
            `)
            .not('transmitted_at', 'is', null)
            .eq('sessions.patient_id', patientId)
            .order('transmitted_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch (err) {
        console.error('[fetchTransmittedResults] 전송 결과 조회 실패:', err.message);
        return [];
    }
});
