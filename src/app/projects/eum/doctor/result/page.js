import resultPackage from '../../_references/data/doctor/07_result_package.json';
import aiWarnings from '../../_references/data/doctor/08_ai_warnings.json';
import dashboardState from '../../_references/data/doctor/03_dashboard_state.json';
import timelineChartData from '../../_references/data/doctor/06_timeline_chart_data.json';
import { getPatientId } from '../../_lib/getPatientId';

import { PatientDataModalProvider } from '../_components/PatientDataModal/PatientDataModalContext';
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
import PatientDataModal from '../_components/PatientDataModal/PatientDataModal';
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
            .select('name, birth_date, gender, chronic_conditions, allergies')
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
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

export const dynamic = 'force-dynamic';

export default async function ResultPage() {
    const { sections } = dashboardState;
    // 쿠키 없으면 기본 환자(윤서진)로 폴백 — 의사 대시보드와 동일 패턴
    const patientId = (await getPatientId()) || 'pat_yoon_001';
    const patient = await fetchPatient(patientId);

    // F16 경고: baseWarnings + 쉬운말 변환 모델 버전
    const baseWarnings = aiWarnings.warnings.filter((w) => w.id !== 'warn_model');
    const modelWarning = aiWarnings.warnings.find((w) => w.id === 'warn_model');
    const resultWarnings = [
        ...baseWarnings,
        { ...modelWarning, text: modelWarning.current_values.F16_plain_language },
    ];

    // 환자 프로필: DB 우선, 폴백 → 정적 JSON (윤서진 데모 시나리오)
    const patientSummary = patient
        ? {
              name: patient.name,
              age: calcAge(patient.birth_date),
              gender: patient.gender,
              patient_id: patientId,
          }
        : dashboardState.patient_summary;

    // 기저질환: DB 우선, 폴백 → 정적 JSON
    const conditionNames = (patient?.chronic_conditions ?? []).map((c) =>
        typeof c === 'string' ? c : c.name
    );
    const chronicConditions = conditionNames.length > 0
        ? conditionNames
        : sections.basic_info.data.chronic_conditions;

    // 알레르기: DB 우선, 폴백 → 정적 JSON
    const allergies = patient?.allergies ?? sections.allergies.items;

    return (
        <>
        <h1 className="sr-only">결과 작성</h1>
        <PatientDataModalProvider>
        <DoctorPanel
            backHref="/projects/eum/doctor"
            singleColumn
            profile={
                <PatientProfile
                    patientSummary={patientSummary}
                    referralBadge={dashboardState.header.referral_badge}
                    chronicConditions={chronicConditions}
                    allergies={allergies}
                    basicInfo={sections.basic_info.data}
                />
            }
            footer={
                <ResultFooterCta
                    patientName={patientSummary.name}
                    sessionId={resultPackage.session_id}
                    doctorId={resultPackage.doctor_id}
                    doctorName={resultPackage.doctor_name}
                    hospitalName={resultPackage.hospital_name}
                    diagnosisName={resultPackage.diagnosis_name}
                    resultData={resultPackage}
                />
            }
        >
            {/* 섹션 2: 의사 소견 */}
            <ClinicalNotes findings={resultPackage.findings} />

            {/* 섹션 3: AI 쉬운말 요약 */}
            <AiPatientSummary
                plainText={resultPackage.doctor_note_plain}
                modelVersion={resultPackage.plain_text_generation.model_version}
                resultWarnings={resultWarnings}
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
                contextNote="현재 처방 유지"
            />

            {/* 섹션 7: 타과의뢰 */}
            <Referral referral={resultPackage.referral} />

            {/* 섹션 8: 다음 방문 */}
            <NextVisit date={resultPackage.next_visit_date} />


        </DoctorPanel>

        <PatientDataModal
            patient={patientSummary}
            chronicConditions={chronicConditions}
            allergies={allergies}
            chartData={timelineChartData}
        />
        </PatientDataModalProvider>
        </>
    );
}
