import consultationResults from '../../_references/data/patient/06_consultation_results.json';
import sessions from '../../_references/data/patient/05_consultation_sessions.json';
import styles from './page.module.scss';
import AppBar from '../_components/AppBar/AppBar';
import SummaryListItem from '../_components/SummaryListItem/SummaryListItem';
import TabBar from '../_components/TabBar/TabBar';

export const metadata = {
    title: '진료 요약 — 이음',
};

// session_id → hospital_name 매핑
const sessionMap = Object.fromEntries(
    sessions.sessions.map((s) => [s.session_id, s.hospital_name])
);

// 최신순 정렬
const items = [...consultationResults.consultation_results].reverse();

function formatVisitDate(dateStr) {
    return dateStr.replace(/-/g, '.');
}

export default function SummaryListPage() {
    return (
        <>
            <AppBar />
            <main className={styles['content']}>
                <h1 className={styles['title']}>진료 요약</h1>
                <ul className={styles['list']}>
                    {items.map((result) => (
                        <li key={result.session_id}>
                            <SummaryListItem
                                sessionId={result.session_id}
                                visitDate={formatVisitDate(result.visit_date)}
                                hospitalName={sessionMap[result.session_id] ?? '—'}
                                doctorName={result.doctor_name}
                                diagnosisName={result.diagnosis_name}
                            />
                        </li>
                    ))}
                </ul>
            </main>
            <TabBar activePath="summary" />
        </>
    );
}
