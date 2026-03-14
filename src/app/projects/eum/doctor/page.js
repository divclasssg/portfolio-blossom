import { redirect } from 'next/navigation';
import dashboardState from '../_references/data/doctor/03_dashboard_state.json';
import transmissionPkg from '../_references/data/doctor/02_transmission_package.json';
import doctorProfiles from '../_references/data/doctor/01_doctor_profile.json';
// AI 데이터 — AiDataProvider의 폴백으로 사용 (API 실패 시 정적 JSON 유지)
import aiBriefing from '../_references/data/doctor/04_ai_briefing.json';
import aiSuggestions from '../_references/data/doctor/05_ai_suggestions.json';
import aiWarnings from '../_references/data/doctor/08_ai_warnings.json';
import timelineChartData from '../_references/data/doctor/06_timeline_chart_data.json';

import { getPatientId } from '../_lib/getPatientId';
import DoctorPanel from './_components/DoctorPanel/DoctorPanel';
import PatientProfile from './_components/PatientProfile/PatientProfile';
import PatientOverview from './_components/PatientOverview/PatientOverview';
import ChiefComplaint from './_components/ChiefComplaint/ChiefComplaint';
import Timeline from './_components/Timeline/Timeline';
import FooterCta from './_components/FooterCta/FooterCta';
import { PatientDataModalProvider } from './_components/PatientDataModal/PatientDataModalContext';
import PatientDataModal from './_components/PatientDataModal/PatientDataModal';
import AiDataProvider from './_components/AiDataProvider/AiDataProvider';

export const metadata = {
    title: 'D-000 의사 대시보드 — 이음',
};

// 의사가 대시보드를 열 때마다 Supabase에서 최신 데이터 조회
export const dynamic = 'force-dynamic';

// birth_date → 만 나이 계산
function calcAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

// 증상 기록 → 타임라인 아이템 변환
function symptomToTimelineItem(record) {
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

// Supabase에서 환자 데이터 + AI 결과 조회 (실패 시 null 반환 → 정적 JSON 폴백)
async function fetchLiveData(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();

        // 최신 세션 ID 동적 조회
        const { getLatestSessionId } = await import('../../../api/eum/_lib/getLatestSession');
        const latestSessionId = await getLatestSessionId(supabase, patientId);

        const [symptomsRes, aiRes, patientRes, sessionRes] = await Promise.all([
            supabase
                .from('symptom_records')
                .select('*')
                .eq('patient_id', patientId)
                .order('occurred_at', { ascending: false }),
            latestSessionId
                ? supabase
                      .from('ai_results')
                      .select('*')
                      .eq('session_id', latestSessionId)
                      .order('created_at', { ascending: false })
                : { data: [], error: null },
            supabase
                .from('patients')
                .select(
                    'name, birth_date, gender, height_cm, weight_kg, blood_type, wearable_device, chronic_conditions, allergies'
                )
                .eq('id', patientId)
                .single(),
            latestSessionId
                ? supabase
                      .from('sessions')
                      .select('chief_complaint')
                      .eq('id', latestSessionId)
                      .single()
                : { data: null, error: null },
        ]);

        if (symptomsRes.error)
            console.warn('[doctor/page] symptom_records 조회 실패:', symptomsRes.error.message);
        if (sessionRes.error)
            console.warn('[doctor/page] sessions 조회 실패:', sessionRes.error.message);
        if (patientRes.error)
            console.warn('[doctor/page] patients 조회 실패:', patientRes.error.message);

        const symptoms = symptomsRes.error ? [] : (symptomsRes.data ?? []);
        const aiData = aiRes.data ?? [];
        const patient = patientRes.error ? null : patientRes.data;
        const chiefComplaint = sessionRes.error ? null : (sessionRes.data?.chief_complaint ?? null);

        console.log('[doctor/page] patientId:', patientId);
        console.log(
            '[doctor/page] patient:',
            patient
                ? JSON.stringify({
                      name: patient.name,
                      chronic_conditions: patient.chronic_conditions,
                      allergies: patient.allergies,
                  })
                : 'null (정적 폴백)'
        );
        console.log(
            '[doctor/page] chief_complaint:',
            chiefComplaint ? '동적 데이터 사용' : '정적 JSON 폴백'
        );
        console.log(
            '[doctor/page] symptoms:',
            symptoms.length > 0 ? `동적 데이터 ${symptoms.length}건` : '정적 JSON 폴백'
        );

        // 최신 브리핑/서제스천 각 1개
        const dbBriefing = aiData.find((r) => r.result_type === 'briefing')?.content ?? null;
        const dbSuggestions = aiData.find((r) => r.result_type === 'suggestions')?.content ?? null;

        // 타임라인 변환: 최신 3개 → compact, 나머지 → expanded
        const timelineItems = symptoms.map(symptomToTimelineItem);
        const compactItems = timelineItems.slice(0, 3);
        const expandedItems = timelineItems.slice(3);

        return {
            symptoms,
            compactItems,
            expandedItems,
            dbBriefing,
            dbSuggestions,
            patient,
            chiefComplaint,
            latestSessionId,
        };
    } catch (err) {
        console.warn('[doctor/page] Supabase 조회 실패, 정적 JSON 사용:', err.message);
        return null;
    }
}

export default async function DoctorDashboard() {
    // ses_007 담당의: 박지영 / 분당신경과의원 (dashboardState.doctor_id = doc_park_001)
    const doctor =
        doctorProfiles.doctors.find((d) => d.doctor_id === dashboardState.doctor_id) ??
        doctorProfiles.doctors[0];

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

    // 쿠키 없으면 온보딩으로 리디렉트
    const patientId = await getPatientId();
    if (!patientId) redirect('/projects/eum/patient/onboarding/welcome');
    const liveData = await fetchLiveData(patientId);

    // 타임라인 데이터: Supabase에 데이터가 있을 때만 우선, 없으면 정적 JSON 폴백
    const hasLiveSymptoms = (liveData?.symptoms?.length ?? 0) > 0;
    console.log('[doctor/page] timeline:', hasLiveSymptoms ? '동적' : '정적 폴백');

    const compactTimeline = hasLiveSymptoms
        ? {
              ...sections.symptom_timeline_compact,
              items: liveData.compactItems,
              remaining_count: Math.max(0, liveData.symptoms.length - 3),
          }
        : sections.symptom_timeline_compact;

    const expandedTimeline = hasLiveSymptoms
        ? { items: liveData.expandedItems }
        : sections.symptom_timeline_expanded;

    // 환자 프로필: Supabase 우선, 폴백 → 빈 프로필 (윤서진 노출 방지)
    const patient = liveData?.patient ?? null;

    const patientSummary = patient
        ? {
              name: patient.name,
              age: calcAge(patient.birth_date),
              gender: patient.gender,
              patient_id: patientId,
          }
        : { name: '정보 없음', age: null, gender: null, patient_id: patientId };

    // chronic_conditions: DB는 [{name: "..."}] 또는 ["..."] 형태 모두 허용
    const conditionNames = (patient?.chronic_conditions ?? []).map((c) =>
        typeof c === 'string' ? c : c.name
    );

    // basicInfo: DB(신체 측정·기저질환) + 정적 JSON(검진·예방접종·의뢰서) 병합
    const basicInfo = patient
        ? {
              ...sections.basic_info.data,
              chronic_conditions: conditionNames,
              height: `${patient.height_cm}cm`,
              weight: `${patient.weight_kg}kg`,
              blood_type: patient.blood_type ?? null,
              wearable_device: patient.wearable_device ?? null,
          }
        : { ...sections.basic_info.data, chronic_conditions: [] };

    // allergies: DB 데이터만 사용 (빈 배열이면 알레르기 경고 미표시)
    const allergies = patient?.allergies ?? [];

    // chief complaint: sessions.chief_complaint 우선, 폴백 → 정적 JSON
    const chiefComplaint = liveData?.chiefComplaint ?? sections.chief_complaint;

    return (
        <PatientDataModalProvider>
            {/* 이음 플로팅 패널 — DoctorPanel이 position:fixed 및 인터랙션 담당 */}
            <DoctorPanel
                footer={<FooterCta />}
                doctorName={doctor.name}
                hospitalName={doctor.hospital.hospital_name}
            >
                {/* 섹션 2: 환자 프로필 + 기저질환 + 알레르기 */}
                <PatientProfile
                    patientSummary={patientSummary}
                    referralBadge={dashboardState.header.referral_badge}
                    chronicConditions={basicInfo.chronic_conditions}
                    allergies={allergies}
                />

                {/* 섹션 3: 환자 개요 */}
                <PatientOverview
                    basicInfo={basicInfo}
                    medications={transmissionPkg.basic_health.medications}
                />

                {/* 섹션 4: 주호소 */}
                <ChiefComplaint complaint={chiefComplaint} />

                {/*
          섹션 5-6-8: AI 데이터 섹션
          - initialBriefing/Suggestions: Supabase DB에 캐시된 결과 (있으면 파이프라인 스킵)
          - 없으면: /api/eum/pipeline 호출 (프로그레시브 로딩)
          - 실패: 정적 JSON 폴백
        */}
                <AiDataProvider
                    fallbackBriefing={aiBriefing}
                    fallbackSuggestions={aiSuggestions}
                    briefingWarnings={briefingWarnings}
                    suggestionWarnings={suggestionWarnings}
                    initialBriefing={liveData?.dbBriefing ?? null}
                    initialSuggestions={liveData?.dbSuggestions ?? null}
                    patientId={patientId}
                />

                {/* 섹션 7: 증상 타임라인 — Supabase에서 최신 데이터 */}
                <Timeline
                    timeline={compactTimeline}
                    expandedTimeline={expandedTimeline}
                    healthPlatform={transmissionPkg.health_platform}
                />
            </DoctorPanel>

            {/* D-F12 증상 타임라인 모달 — DoctorPanel 형제, position:fixed로 전체 뷰포트 커버 */}
            <PatientDataModal
                patient={dashboardState.patient_summary}
                chartData={timelineChartData}
                liveSymptoms={liveData?.symptoms}
            />
        </PatientDataModalProvider>
    );
}
