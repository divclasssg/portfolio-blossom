import homeDashboard from '../_references/data/patient/08_home_dashboard.json';
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

export default function PatientHome() {
  return (
    <>
      <AppBar />
      <main className={styles['content']}>
        <GreetingSection greeting={homeDashboard.greeting} />
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
