import resultPackage from '../../_references/data/doctor/07_result_package.json';
import aiWarnings from '../../_references/data/doctor/08_ai_warnings.json';
import dashboardState from '../../_references/data/doctor/03_dashboard_state.json';

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

export default function ResultPage() {
  const { sections } = dashboardState;

  // F16 경고: baseWarnings + 쉬운말 변환 모델 버전
  const baseWarnings = aiWarnings.warnings.filter((w) => w.id !== 'warn_model');
  const modelWarning = aiWarnings.warnings.find((w) => w.id === 'warn_model');
  const resultWarnings = [
    ...baseWarnings,
    { ...modelWarning, text: modelWarning.current_values.F16_plain_language },
  ];

  return (
    <DoctorPanel
      backHref="/projects/eum/doctor"
      singleColumn
      footer={
        <ResultFooterCta
          patientName={dashboardState.patient_summary.name}
        />
      }
    >
      {/* 섹션 1: 환자 프로필 + 알레르기 */}
      <PatientProfile
        patientSummary={dashboardState.patient_summary}
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
