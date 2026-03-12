import dashboardState from '../_references/data/doctor/03_dashboard_state.json';
import transmissionPkg from '../_references/data/doctor/02_transmission_package.json';
import aiBriefing from '../_references/data/doctor/04_ai_briefing.json';
import aiSuggestions from '../_references/data/doctor/05_ai_suggestions.json';
import aiWarnings from '../_references/data/doctor/08_ai_warnings.json';
import timelineChartData from '../_references/data/doctor/06_timeline_chart_data.json';

import DoctorPanel from './_components/DoctorPanel/DoctorPanel';
import PatientProfile from './_components/PatientProfile/PatientProfile';
import PatientOverview from './_components/PatientOverview/PatientOverview';
import ChiefComplaint from './_components/ChiefComplaint/ChiefComplaint';
import AiRiskFlags from './_components/AiRiskFlags/AiRiskFlags';
import AiBriefing from './_components/AiBriefing/AiBriefing';
import Timeline from './_components/Timeline/Timeline';
import AiSuggestions from './_components/AiSuggestions/AiSuggestions';
import FooterCta from './_components/FooterCta/FooterCta';
import { PatientDataModalProvider } from './_components/PatientDataModal/PatientDataModalContext';
import PatientDataModal from './_components/PatientDataModal/PatientDataModal';

export const metadata = {
  title: 'D-000 의사 대시보드 — 이음',
};

export default function DoctorDashboard() {
  // AI 경고: 모델 경고는 섹션별로 다른 텍스트 사용
  const baseWarnings = aiWarnings.warnings.filter((w) => w.id !== 'warn_model');
  const modelWarning = aiWarnings.warnings.find((w) => w.id === 'warn_model');

  const briefingWarnings = [
    ...baseWarnings,
    { ...modelWarning, text: modelWarning.current_values.F11_briefing },
  ];
  const suggestionWarnings = [
    ...baseWarnings,
    { ...modelWarning, text: modelWarning.current_values.F13_suggestions },
  ];

  const { sections } = dashboardState;

  return (
    <PatientDataModalProvider>
      {/* 이음 플로팅 패널 — DoctorPanel이 position:fixed 및 인터랙션 담당 */}
      <DoctorPanel footer={<FooterCta />}>
        {/* 섹션 2: 환자 프로필 + 알레르기 */}
        <PatientProfile
          patientSummary={dashboardState.patient_summary}
          referralBadge={dashboardState.header.referral_badge}
          allergies={sections.allergies.items}
        />

        {/* 섹션 3: 환자 개요 */}
        <PatientOverview
          basicInfo={sections.basic_info.data}
          medications={transmissionPkg.basic_health.medications}
        />

        {/* 섹션 4: 주호소 */}
        <ChiefComplaint complaint={sections.chief_complaint} />

        {/* 섹션 5: AI 위험 신호 */}
        <AiRiskFlags highlights={aiBriefing.highlights} />

        {/* 섹션 6: AI 분석 요약 */}
        <AiBriefing briefing={aiBriefing} warnings={briefingWarnings} />

        {/* 섹션 7: 증상 타임라인 */}
        <Timeline
          timeline={sections.symptom_timeline_compact}
          expandedTimeline={sections.symptom_timeline_expanded}
          healthPlatform={transmissionPkg.health_platform}
        />

        {/* 섹션 8: AI 참고 키워드 */}
        <AiSuggestions
          suggestions={aiSuggestions.suggestions}
          modelVersion={aiSuggestions.model_version}
          warnings={suggestionWarnings}
        />
      </DoctorPanel>

      {/* D-F12 증상 타임라인 모달 — DoctorPanel 형제, position:fixed로 전체 뷰포트 커버 */}
      <PatientDataModal
        patient={dashboardState.patient_summary}
        chartData={timelineChartData}
      />
    </PatientDataModalProvider>
  );
}
