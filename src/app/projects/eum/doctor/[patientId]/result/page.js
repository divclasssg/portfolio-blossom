import resultPackage from '../../../_references/data/doctor/07_result_package.json';
import aiWarnings from '../../../_references/data/doctor/08_ai_warnings.json';
import dashboardState from '../../../_references/data/doctor/03_dashboard_state.json';
import timelineChartData from '../../../_references/data/doctor/06_timeline_chart_data.json';
import { PatientDataModalProvider } from '../../_components/PatientDataModal/PatientDataModalContext';
import { ResultEditProvider } from '../../_components/ResultEditContext/ResultEditContext';
import DoctorPanel from '../../_components/DoctorPanel/DoctorPanel';
import PatientProfile from '../../_components/PatientProfile/PatientProfile';
import ClinicalNotes from '../../_components/ClinicalNotes/ClinicalNotes';
import AiPatientSummary from '../../_components/AiPatientSummary/AiPatientSummary';
import TreatmentPlan from '../../_components/TreatmentPlan/TreatmentPlan';
import ActionItems from '../../_components/ActionItems/ActionItems';
import Prescription from '../../_components/Prescription/Prescription';
import Referral from '../../_components/Referral/Referral';
import NextVisit from '../../_components/NextVisit/NextVisit';
import AiWarningBanner from '../../_components/AiWarningBanner/AiWarningBanner';
import PatientDataModal from '../../_components/PatientDataModal/PatientDataModal';
import ResultFooterCta from '../../_components/ResultFooterCta/ResultFooterCta';

export const metadata = {
    title: 'D-001 결과 확인 및 전송 — Eum',
};

// Supabase에서 환자 정보 + 해당 의사의 전송 가능 세션 ID 조회
async function fetchPatientAndSession(patientId, doctorId) {
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();

        // 해당 의사의 최신 세션
        const sessionQuery = supabase
            .from('sessions')
            .select('id')
            .eq('patient_id', patientId)
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const [patientRes, sessionRes] = await Promise.all([
            supabase
                .from('patients')
                .select('name, birth_date, gender, chronic_conditions, allergies')
                .eq('id', patientId)
                .single(),
            sessionQuery,
        ]);
        if (patientRes.error) throw patientRes.error;

        const sessionId = sessionRes.data?.id ?? null;

        // 이미 전송된 세션인지 확인
        let alreadyTransmitted = false;
        if (sessionId) {
            const { data: existing } = await supabase
                .from('consultation_results')
                .select('id')
                .eq('session_id', sessionId)
                .maybeSingle();
            alreadyTransmitted = !!existing;
        }

        return { patient: patientRes.data, sessionId, alreadyTransmitted };
    } catch {
        return { patient: null, sessionId: null };
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

export default async function ResultPage({ params }) {
    const { patientId } = await params;
    const { sections } = dashboardState;
    const { patient, sessionId: dbSessionId, alreadyTransmitted } = await fetchPatientAndSession(patientId, resultPackage.doctor_id);
    // DB 세션 ID 우선, 폴백 → 정적 JSON (ses_004)
    const activeSessionId = dbSessionId || resultPackage.session_id;

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
              age: calcAge(patient.birth_date) ?? dashboardState.patient_summary.age,
              gender: patient.gender,
              patient_id: patientId,
          }
        : dashboardState.patient_summary;

    // 기저질환: DB 우선, 폴백 → 정적 JSON
    const conditionNames = (patient?.chronic_conditions ?? []).map((c) => {
        if (typeof c === 'string') return c;
        const name = c.condition_name || c.name || '';
        const code = c.icd_code;
        return code ? `${name} (${code})` : name;
    });
    const chronicConditions = conditionNames.length > 0
        ? conditionNames
        : sections.basic_info.data.chronic_conditions;

    // 알레르기: DB 우선, 폴백 → 정적 JSON
    const allergies = patient?.allergies ?? sections.allergies.items;

    return (
        <>
        <h1 className="sr-only">결과 작성</h1>
        <PatientDataModalProvider>
        <ResultEditProvider>
        <DoctorPanel
            backHref={`/projects/eum/doctor/${patientId}`}
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
                    patientId={patientId}
                    sessionId={activeSessionId}
                    doctorId={resultPackage.doctor_id}
                    doctorName={resultPackage.doctor_name}
                    hospitalName={resultPackage.hospital_name}
                    diagnosisName={resultPackage.diagnosis_name}
                    resultData={resultPackage}
                    alreadyTransmitted={alreadyTransmitted}
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

            {/* 섹션 8: 다음 방문 — 오늘 + 7일 */}
            <NextVisit date={new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)} />


        </DoctorPanel>
        </ResultEditProvider>

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
