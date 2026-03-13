/**
 * 환자의 최신 세션 ID 조회
 */
export async function getLatestSessionId(supabase, patientId) {
  const { data } = await supabase
    .from('sessions')
    .select('id')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data?.id ?? null;
}
