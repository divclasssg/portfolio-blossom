/**
 * 환자의 최신 세션 ID 조회 (상태 무관)
 * — 환자 앱에서 증상 기록 연결용
 */
export async function getLatestSessionId(supabase, patientId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.error('[getLatestSessionId] 세션 조회 실패:', error.message);
        return null;
    }
    return data?.id ?? null;
}

/**
 * 환자의 active 세션 ID 조회
 * — 체크인(접수) 완료된 세션만 반환. 의사 대시보드·파이프라인에서 사용.
 */
export async function getActiveSessionId(supabase, patientId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('patient_id', patientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.error('[getActiveSessionId] active 세션 조회 실패:', error.message);
        return null;
    }
    return data?.id ?? null;
}
