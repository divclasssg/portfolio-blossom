/**
 * 환자의 최신 세션 ID 조회
 */
export async function getLatestSessionId(supabase, patientId) {
    const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    if (error) {
        console.error('[getLatestSessionId] 세션 조회 실패:', error.message);
        return null;
    }
    return data?.id ?? null;
}
