import homeDashboard from '../_references/data/patient/08_home_dashboard.json';
import consentNotifications from '../_references/data/patient/09_consent_notifications.json';
import { getPatientId } from '../_lib/getPatientId';
import styles from './page.module.scss';
import AppBar from './_components/AppBar/AppBar';
import GreetingSection from './_components/GreetingSection/GreetingSection';
import RecentSymptoms from './_components/RecentSymptoms/RecentSymptoms';
import VitalsToday from './_components/VitalsToday/VitalsToday';
import MedicationReminder from './_components/MedicationReminder/MedicationReminder';
import LastVisitResult from './_components/LastVisitResult/LastVisitResult';
import TabBar from './_components/TabBar/TabBar';
import NewResultToast from './_components/NewResultToast/NewResultToast';

export const metadata = {
    title: 'P-018 홈 대시보드 — 이음',
};

// 환자 데이터가 업데이트될 때마다 반영
export const dynamic = 'force-dynamic';

// Supabase에서 최근 증상 요약 조회 (실패 시 null → 정적 JSON 폴백)
async function fetchRecentSymptomsSummary(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('symptom_records')
            .select('*')
            .eq('patient_id', patientId)
            .order('occurred_at', { ascending: false });
        if (error) throw error;
        if (!data || data.length === 0) return null;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // 최근 7일 증상
        const recent7 = data.filter((r) => new Date(r.occurred_at) >= sevenDaysAgo);
        // 이전 7일 증상 (7~14일 전)
        const prev7 = data.filter(
            (r) =>
                new Date(r.occurred_at) >= fourteenDaysAgo && new Date(r.occurred_at) < sevenDaysAgo
        );

        const last7DaysCount = recent7.length;
        const avgSeverity =
            last7DaysCount > 0
                ? Math.round(
                      (recent7.reduce((sum, r) => sum + r.severity, 0) / last7DaysCount) * 10
                  ) / 10
                : 0;

        // 추세 계산
        let trend = 'stable';
        if (prev7.length > 0 && recent7.length > 0) {
            const prevAvg = prev7.reduce((sum, r) => sum + r.severity, 0) / prev7.length;
            const diff = avgSeverity - prevAvg;
            if (diff > 0.5) trend = 'worsening';
            else if (diff < -0.5) trend = 'improving';
        }

        // 가장 최근 증상
        const latest = data[0];
        const preview = latest.description
            ? latest.description.length > 20
                ? latest.description.slice(0, 20) + '...'
                : latest.description
            : latest.voice_transcript || '';

        return {
            last_7_days_count: last7DaysCount,
            avg_severity: avgSeverity,
            trend,
            most_recent: {
                symptom_id: latest.symptom_id,
                occurred_at: latest.occurred_at,
                severity: latest.severity,
                description_preview: preview,
            },
        };
    } catch {
        return null;
    }
}

// Supabase에서 환자 정보 조회 (실패 시 null 반환 → 정적 JSON 폴백)
async function fetchPatientInfo(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('patients')
            .select('name, wearable_device')
            .eq('id', patientId)
            .single();
        if (error) throw error;
        return data ?? null;
    } catch {
        return null;
    }
}

// 전송 완료된 진료 결과 목록 조회 (토스트 알림용)
async function fetchTransmittedResults() {
    try {
        const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('consultation_results')
            .select('session_id, doctor_name, hospital_name, transmitted_at')
            .not('transmitted_at', 'is', null)
            .order('transmitted_at', { ascending: false });
        if (error) throw error;
        return data ?? [];
    } catch {
        return [];
    }
}

export default async function PatientHome() {
    // 쿠키 없으면 기본 환자(윤서진)로 폴백 — 환자 앱 직접 진입 허용
    const patientId = (await getPatientId()) || 'pat_yoon_001';
    const unreadCount = consentNotifications.notifications.filter((n) => !n.read).length;

    const [patientInfo, dynamicSummary, transmittedResults] = await Promise.all([
        fetchPatientInfo(patientId),
        fetchRecentSymptomsSummary(patientId),
        fetchTransmittedResults(),
    ]);
    // DB에서 이름을 읽으면 동적 인사말, 실패 시 이름 없이 인사
    const greeting = patientInfo?.name
        ? `${patientInfo.name}님, 오늘도 건강한 하루 보내세요.`
        : '오늘도 건강한 하루 보내세요.';

    return (
        <>
            <AppBar unreadCount={unreadCount} />
            <NewResultToast transmittedResults={transmittedResults} />
            <main className={styles['content']}>
                <GreetingSection greeting={greeting} />
                <RecentSymptoms summary={dynamicSummary ?? homeDashboard.recent_symptoms_summary} />
                <VitalsToday vitals={homeDashboard.vitals_today} wearableDevice={patientInfo?.wearable_device ?? null} />
                <MedicationReminder
                    reminder={homeDashboard.medication_reminder}
                    activeCount={homeDashboard.active_medications_count}
                />
                <LastVisitResult result={homeDashboard.last_visit_result} />
            </main>
            <TabBar activePath="home" />
        </>
    );
}
