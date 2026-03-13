import resultPackage from '../../_references/data/doctor/07_result_package.json';
import aiWarnings from '../../_references/data/doctor/08_ai_warnings.json';
import dashboardState from '../../_references/data/doctor/03_dashboard_state.json';
import { getPatientId } from '../../_lib/getPatientId';

import DoctorPanel from '../_components/DoctorPanel/DoctorPanel';
import PatientProfile from '../_components/PatientProfile/PatientProfile';
import ClinicalNotes from '../_components/ClinicalNotes/ClinicalNotes';
import AiPatientSummary from '../_components/AiPatientSummary/AiPatientSummary';
import TreatmentPlan from '../_components/TreatmentPlan/TreatmentPlan';
import ActionItems from '../_components/ActionItems/ActionItems';
import Prescription from '../_components/Prescription/Prescription';
import Referral from '../_components/Referral/Referral';
import NextVisit from '../_components/NextVisit/NextVisit';
import AiWarningBanner from '../_components/AiWarningBanner/AiWarningBanner';
import ResultFooterCta from '../_components/ResultFooterCta/ResultFooterCta';

export const metadata = {
  title: 'D-001 결과 확인 및 전송 — 이음',
};

// Supabase에서 환자 정보 조회 (실패 시 null → 정적 JSON 폴백)
async function fetchPatient(patientId) {
  try {
    const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('patients')
      .select('name, birth_date, gender')
      .eq('id', patientId)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

// birth_date → 만 나이 계산
function calcAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const dynamic = 'force-dynamic';

export default async function ResultPage() {
  const { sections } = dashboardState;
  const patientId = await getPatientId();
  const patient = await fetchPatient(patientId);

  // F16 경고: baseWarnings + 쉬운말 변환 모델 버전
  const baseWarnings = aiWarnings.warnings.filter((w) => w.id !== 'warn_model');
  const modelWarning = aiWarnings.warnings.find((w) => w.id === 'warn_model');
  const resultWarnings = [
    ...baseWarnings,
    { ...modelWarning, text: modelWarning.current_values.F16_plain_language },
  ];

  const patientSummary = patient
    ? { name: patient.name, age: calcAge(patient.birth_date), gender: patient.gender, patient_id: patientId }
    : dashboardState.patient_summary;

  return (
    <DoctorPanel
      backHref="/projects/eum/doctor"
      singleColumn
      footer={
        <ResultFooterCta
          patientName={patientSummary.name}
        />
      }
    >
      {/* 섹션 1: 환자 프로필 + 알레르기 */}
      <PatientProfile
        patientSummary={patientSummary}
        referralBadge={dashboardState.header.referral_badge}
        allergies={sections.allergies.items}
      />

      {/* 섹션 2: 의사 소견 */}
      <ClinicalNotes findings={resultPackage.findings} />

      {/* 섹션 3: AI 쉬운말 요약 */}
      <AiPatientSummary
        plainText={resultPackage.doctor_note_plain}
        modelVersion={resultPackage.plain_text_generation.model_version}
      />

      {/* 섹션 4: 치료 계획 */}
      <TreatmentPlan
        treatmentPlan={resultPackage.treatment_plan}
        nextSteps={resultPackage.next_steps}
      />

      {/* 섹션 5: 행동 항목 */}
      <ActionItems items={resultPackage.action_items} />

      {/* 섹션 6: 처방 */}
      <Prescription
        prescriptions={resultPackage.prescriptions}
        contextNote="기존 처방 유지 (서현내과의원)"
      />

      {/* 섹션 7: 타과의뢰 회신 */}
      <Referral referral={resultPackage.referral_response} />

      {/* 섹션 8: 다음 방문 */}
      <NextVisit date={resultPackage.next_visit_date} />

      {/* 섹션 9: AI 경고 — 닫기 불가, 영구 노출 */}
      <AiWarningBanner warnings={resultWarnings} />
    </DoctorPanel>
  );
}
