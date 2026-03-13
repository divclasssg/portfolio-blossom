import homeDashboard from '../_references/data/patient/08_home_dashboard.json';
import consentNotifications from '../_references/data/patient/09_consent_notifications.json';
import styles from './page.module.scss';
import AppBar from './_components/AppBar/AppBar';
import GreetingSection from './_components/GreetingSection/GreetingSection';
import RecentSymptoms from './_components/RecentSymptoms/RecentSymptoms';
import VitalsToday from './_components/VitalsToday/VitalsToday';
import MedicationReminder from './_components/MedicationReminder/MedicationReminder';
import LastVisitResult from './_components/LastVisitResult/LastVisitResult';
import TabBar from './_components/TabBar/TabBar';

export const metadata = {
  title: 'P-018 홈 대시보드 — 이음',
};

// 환자 데이터가 업데이트될 때마다 반영
export const dynamic = 'force-dynamic';

// Supabase에서 환자 이름 조회 (실패 시 null 반환 → 정적 JSON 폴백)
async function fetchPatientName() {
  try {
    const { getSupabaseClient } = await import('../../../api/eum/_lib/supabase');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('patients')
      .select('name')
      .eq('id', 'pat_yoon_001')
      .single();
    if (error) throw error;
    return data?.name ?? null;
  } catch {
    return null;
  }
}

export default async function PatientHome() {
  const unreadCount = consentNotifications.notifications.filter((n) => !n.read).length;

  const name = await fetchPatientName();
  // DB에서 이름을 읽으면 동적 인사말, 실패 시 정적 JSON 폴백
  const greeting = name
    ? `${name}님, 오늘도 건강한 하루 보내세요.`
    : homeDashboard.greeting;

  return (
    <>
      <AppBar unreadCount={unreadCount} />
      <main className={styles['content']}>
        <GreetingSection greeting={greeting} />
        <RecentSymptoms summary={homeDashboard.recent_symptoms_summary} />
        <VitalsToday vitals={homeDashboard.vitals_today} />
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
