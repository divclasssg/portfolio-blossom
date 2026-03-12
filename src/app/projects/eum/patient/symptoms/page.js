import homeDashboard from '../../_references/data/patient/08_home_dashboard.json';
import styles from './page.module.scss';
import AppBar from '../_components/AppBar/AppBar';
import VitalsBanner from '../_components/VitalsBanner/VitalsBanner';
import ChatArea from '../_components/ChatArea/ChatArea';
import ChatInputBar from '../_components/ChatInputBar/ChatInputBar';
import TabBar from '../_components/TabBar/TabBar';

export const metadata = {
  title: 'P-019 증상 기록 — 이음',
};

export default function SymptomsPage() {
  const vitals = homeDashboard.vitals_today;

  return (
    <>
      <AppBar backHref="/projects/eum/patient" />
      <VitalsBanner vitals={vitals} />
      <main className={styles['content']}>
        <ChatArea />
      </main>
      <ChatInputBar />
      <TabBar activePath="symptoms" />
    </>
  );
}
