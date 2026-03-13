import homeDashboard from '../../_references/data/patient/08_home_dashboard.json';
import symptomRecords from '../../_references/data/patient/03_symptom_records.json';
import { getPatientId } from '../../_lib/getPatientId';
import SymptomsContent from '../_components/SymptomsContent/SymptomsContent';

export const metadata = {
  title: 'P-019 증상 기록 — 이음',
};

// DB 데이터가 업데이트될 때마다 반영
export const dynamic = 'force-dynamic';

// Supabase에서 환자 이름 조회 (실패 시 null → 정적 폴백)
async function fetchPatientName(patientId) {
  try {
    const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('patients')
      .select('name')
      .eq('id', patientId)
      .single();
    if (error) throw error;
    return data?.name ?? null;
  } catch {
    return null;
  }
}

// Supabase에서 증상 기록 조회 (실패 시 null → 정적 JSON 폴백)
async function fetchSymptomRecords(patientId) {
  try {
    const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('symptom_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('occurred_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export default async function SymptomsPage() {
  const patientId = await getPatientId();
  const vitals = homeDashboard.vitals_today;
  const [dbRecords, patientName] = await Promise.all([
    fetchSymptomRecords(patientId),
    fetchPatientName(patientId),
  ]);

  return (
    <SymptomsContent
      vitals={vitals}
      records={dbRecords ?? symptomRecords.symptom_records}
      patientId={patientId}
      patientName={patientName}
    />
  );
}
