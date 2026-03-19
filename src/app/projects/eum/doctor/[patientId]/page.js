import dashboardState from '../../_references/data/doctor/03_dashboard_state.json';
import transmissionPkg from '../../_references/data/doctor/02_transmission_package.json';
import doctorProfiles from '../../_references/data/doctor/01_doctor_profile.json';
import healthHistory from '../../_references/data/patient/02_health_history.json';
// AI 데이터 — AiDataProvider의 폴백으로 사용 (API 실패 시 정적 JSON 유지)
import aiBriefing from '../../_references/data/doctor/04_ai_briefing.json';
import aiSuggestions from '../../_references/data/doctor/05_ai_suggestions.json';
import aiWarnings from '../../_references/data/doctor/08_ai_warnings.json';
import rawTimelineChartData from '../../_references/data/doctor/06_timeline_chart_data.json';
import { shiftDates } from '../../_lib/dateShift';

import DoctorPanel from '../_components/DoctorPanel/DoctorPanel';
import PatientProfile from '../_components/PatientProfile/PatientProfile';
import ChiefComplaint from '../_components/ChiefComplaint/ChiefComplaint';
import Timeline from '../_components/Timeline/Timeline';
import Medications from '../_components/Medications/Medications';
import ChiefMedTabs from '../_components/ChiefMedTabs/ChiefMedTabs';
import FooterCta from '../_components/FooterCta/FooterCta';
import { PatientDataModalProvider } from '../_components/PatientDataModal/PatientDataModalContext';
import PatientDataModal from '../_components/PatientDataModal/PatientDataModal';
import AiDataProvider from '../_components/AiDataProvider/AiDataProvider';

export const metadata = {
    title: 'D-000 의사 대시보드 — Eum',
};

// 매 요청마다 서버 렌더링 강제 — Supabase 실시간 데이터 조회 보장
export const dynamic = 'force-dynamic';

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

// 증상 기록 → 타임라인 아이템 변환
function symptomToTimelineItem(record) {
    if (!record.occurred_at) return null;
    const date = new Date(record.occurred_at);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const rawText = record.description || record.voice_transcript || '';
    const preview = rawText.length > 18 ? rawText.slice(0, 18) + '...' : rawText;

    return {
        date: `${mm}-${dd}`,
        severity: record.severity,
        preview,
        category: record.category_code,
    };
}

// Supabase에서 환자 프로필 조회 (체크인 무관, 항상 DB 우선)
async function fetchPatientProfile(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('patients')
            .select(
                'name, birth_date, gender, height_cm, weight_kg, blood_type, wearable_device, chronic_conditions, allergies'
            )
            .eq('id', patientId)
            .single();
        if (error) return null;
        return data;
    } catch {
        return null;
    }
}

// Supabase에서 세션 데이터 조회 (active 세션 필요 — 체크인 후에만 반환)
async function fetchSessionData(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();

        // active 세션 없으면 → null (정적 JSON 폴백)
        const { getActiveSessionId } = await import('../../../../api/eum/_lib/getLatestSession');
        const activeSessionId = await getActiveSessionId(supabase, patientId);
        if (!activeSessionId) return null;

        // DB 일일 데이터 백필 — 차트 도메인 안에 최신 데이터 보장
        const { backfillDailyData } = await import('../../../../api/eum/_lib/backfillDailyData');
        await backfillDailyData(patientId).catch(() => {});

        const [symptomsRes, aiRes, sessionRes, vitalsRes] = await Promise.all([
            supabase
                .from('symptom_records')
                .select('*')
                .eq('patient_id', patientId)
                .order('occurred_at', { ascending: false }),
            supabase
                .from('ai_results')
                .select('*')
                .eq('session_id', activeSessionId)
                .order('created_at', { ascending: false }),
            supabase
                .from('sessions')
                .select('chief_complaint')
                .eq('id', activeSessionId)
                .single(),
            supabase
                .from('vitals_records')
                .select('recorded_at, heart_rate_bpm, bp_systolic, bp_diastolic, sleep_hours')
                .eq('patient_id', patientId)
                .order('recorded_at', { ascending: true }),
        ]);

        if (symptomsRes.error)
            console.warn('[doctor/page] symptom_records 조회 실패:', symptomsRes.error.message);
        if (sessionRes.error)
            console.warn('[doctor/page] sessions 조회 실패:', sessionRes.error.message);

        const symptoms = symptomsRes.error ? [] : (symptomsRes.data ?? []);
        const aiData = aiRes.data ?? [];
        const chiefComplaint = sessionRes.error ? null : (sessionRes.data?.chief_complaint ?? null);

        const rawBriefing = aiData.find((r) => r.result_type === 'briefing')?.content ?? null;
        const dbBriefing = rawBriefing?.summary_bullets?.length > 0 ? rawBriefing : null;
        const rawSuggestions = aiData.find((r) => r.result_type === 'suggestions')?.content ?? null;
        const dbSuggestions = rawSuggestions?.suggestions?.length > 0 ? rawSuggestions : null;

        const timelineItems = symptoms.map(symptomToTimelineItem).filter(Boolean);
        const compactItems = timelineItems.slice(0, 3);
        const expandedItems = timelineItems.slice(3);

        const vitals = vitalsRes.error ? [] : (vitalsRes.data ?? []);

        return {
            symptoms,
            compactItems,
            expandedItems,
            dbBriefing,
            dbSuggestions,
            chiefComplaint,
            activeSessionId,
            vitals,
        };
    } catch (err) {
        console.warn('[doctor/page] 세션 데이터 조회 실패:', err.message);
        return null;
    }
}

export default async function DoctorDashboard({ params }) {
    // ses_004 담당의: 김도현 / 서현내과의원 (dashboardState.doctor_id = doc_kim_001)
    const doctor =
        doctorProfiles.doctors.find((d) => d.doctor_id === dashboardState.doctor_id) ??
        doctorProfiles.doctors[0];

    // AI 경고: 통합 단일 배너 — 모델 경고는 두 모델명 병합
    const baseWarnings = aiWarnings.warnings.filter((w) => w.id !== 'warn_model');
    const modelWarning = aiWarnings.warnings.find((w) => w.id === 'warn_model');

    const aiAnalysisWarnings = [
        ...baseWarnings,
        {
            ...modelWarning,
            text: `${modelWarning.current_values.F11_briefing} / ${modelWarning.current_values.F13_suggestions.replace('모델: ', '')}`,
        },
    ];

    const { sections } = dashboardState;

    const { patientId } = await params;

    // 환자 프로필(항상 DB) + 세션 데이터(체크인 후만) 병렬 조회
    const [patient, sessionData] = await Promise.all([
        fetchPatientProfile(patientId),
        fetchSessionData(patientId),
    ]);

    // 타임라인: active 세션 있을 때만 라이브, 없으면 정적 JSON 폴백
    const hasLiveSymptoms = (sessionData?.symptoms?.length ?? 0) > 0;

    const compactTimeline = hasLiveSymptoms
        ? {
              ...sections.symptom_timeline_compact,
              items: sessionData.compactItems,
              remaining_count: Math.max(0, sessionData.symptoms.length - 3),
          }
        : sections.symptom_timeline_compact;

    const expandedTimeline = hasLiveSymptoms
        ? { items: sessionData.expandedItems }
        : sections.symptom_timeline_expanded;

    // 환자 프로필: DB 우선 (체크인 무관), 폴백 → 정적 JSON
    const patientSummary = patient
        ? {
              name: patient.name,
              age: calcAge(patient.birth_date) ?? dashboardState.patient_summary.age,
              gender: patient.gender,
              patient_id: patientId,
          }
        : dashboardState.patient_summary;

    // chronic_conditions: DB는 [{condition_name, icd_code}] 또는 ["..."] 형태 모두 허용
    const conditionNames = (patient?.chronic_conditions ?? []).map((c) => {
        if (typeof c === 'string') return c;
        const name = c.condition_name || c.name || '';
        const code = c.icd_code;
        return code ? `${name} (${code})` : name;
    });

    // basicInfo: DB(신체 측정·기저질환) + 정적 JSON(검진·예방접종·의뢰서) 병합
    const basicInfo = patient
        ? {
              ...sections.basic_info.data,
              chronic_conditions: conditionNames.length > 0 ? conditionNames : sections.basic_info.data.chronic_conditions,
              height: `${patient.height_cm}cm`,
              weight: `${patient.weight_kg}kg`,
              blood_type: patient.blood_type ?? null,
              wearable_device: patient.wearable_device ?? null,
          }
        : sections.basic_info.data;

    // allergies: DB 우선, 폴백 → 정적 JSON
    const allergies = patient?.allergies ?? sections.allergies.items;

    // chief complaint: active 세션 우선, 폴백 → 정적 JSON
    const chiefComplaint = sessionData?.chiefComplaint ?? sections.chief_complaint;

    return (
        <>
        <h1 className="sr-only">Eum 의사 대시보드</h1>
        <PatientDataModalProvider>
            {/* 이음 플로팅 패널 — DoctorPanel이 position:fixed 및 인터랙션 담당 */}
            <DoctorPanel
                footer={<FooterCta patientId={patientId} />}
                profile={
                    <PatientProfile
                        patientSummary={patientSummary}
                        chronicConditions={basicInfo.chronic_conditions}
                        allergies={allergies}
                        basicInfo={basicInfo}
                    />
                }
            >
                {/* 섹션 4+복용약: 640px 미만 탭, 이상 그리드 분리 */}
                <ChiefMedTabs>
                    <ChiefComplaint complaint={chiefComplaint} />
                    <Medications medications={healthHistory.medications_current} />
                </ChiefMedTabs>

                {/* 섹션 7: 증상 타임라인 — Supabase에서 최신 데이터 */}
                <Timeline
                    timeline={compactTimeline}
                    expandedTimeline={expandedTimeline}
                    healthPlatform={transmissionPkg.health_platform}
                />

                {/*
          섹션 5-6-8: AI 데이터 섹션
          - initialBriefing/Suggestions: Supabase DB에 캐시된 결과 (있으면 파이프라인 스킵)
          - 없으면: /api/eum/pipeline 호출 (프로그레시브 로딩)
          - 실패: 정적 JSON 폴백
        */}
                <AiDataProvider
                    fallbackBriefing={aiBriefing}
                    fallbackSuggestions={aiSuggestions}
                    warnings={aiAnalysisWarnings}
                    initialBriefing={sessionData?.dbBriefing ?? null}
                    initialSuggestions={sessionData?.dbSuggestions ?? null}
                    patientId={patientId}
                />

                
            </DoctorPanel>

            {/* D-F12 증상 타임라인 모달 — DoctorPanel 형제, position:fixed로 전체 뷰포트 커버 */}
            <PatientDataModal
                patient={patientSummary}
                chronicConditions={basicInfo.chronic_conditions}
                allergies={allergies}
                chartData={shiftDates(rawTimelineChartData)}
                liveSymptoms={sessionData?.symptoms}
                liveVitals={sessionData?.vitals}
            />
        </PatientDataModalProvider>
        </>
    );
}
