import rawSessions from '../../_references/data/patient/05_consultation_sessions.json';
import { shiftDates } from '../../_lib/dateShift';
import styles from './page.module.scss';
import AppBar from '../_components/AppBar/AppBar';
import SummaryListItem from '../_components/SummaryListItem/SummaryListItem';
import TabBar from '../_components/TabBar/TabBar';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: '진료 요약 — Eum',
};

// session_id → hospital_name 매핑 (날짜 시프트 적용)
const sessions = shiftDates(rawSessions);
const staticSessionMap = Object.fromEntries(
    sessions.sessions.map((s) => [s.session_id, s.hospital_name])
);

// DB에서 전송된 진료 결과 조회
async function fetchDbResults() {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('consultation_results')
            .select('session_id, doctor_name, hospital_name, diagnosis_name, transmitted_at')
            .order('transmitted_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch {
        return [];
    }
}

function formatVisitDate(dateStr) {
    return dateStr.replace(/-/g, '.');
}

export default async function SummaryListPage() {
    const dbResults = await fetchDbResults();

    // DB 결과만 사용 (의사가 전송한 결과만 환자에게 표시)
    const items = dbResults.map((row) => ({
        session_id: row.session_id,
        visit_date: row.transmitted_at?.slice(0, 10) ?? '',
        doctor_name: row.doctor_name,
        diagnosis_name: row.diagnosis_name,
        hospital_name: row.hospital_name ?? staticSessionMap[row.session_id] ?? '—',
    }));

    // 최신순 정렬
    items.sort((a, b) => b.visit_date.localeCompare(a.visit_date));

    return (
        <>
            <AppBar backHref="/projects/eum/patient" />
            <main className={styles['content']}>
                <h1 className={styles['title']}>진료 요약</h1>
                <ul className={styles['list']}>
                    {items.length === 0 && (
                        <li className={styles['empty-message']}>
                            아직 전달받은 진료 결과가 없습니다.
                        </li>
                    )}
                    {items.map((item) => (
                        <li key={item.session_id}>
                            <SummaryListItem
                                sessionId={item.session_id}
                                visitDate={formatVisitDate(item.visit_date)}
                                hospitalName={item.hospital_name}
                                doctorName={item.doctor_name}
                                diagnosisName={item.diagnosis_name}
                            />
                        </li>
                    ))}
                </ul>
            </main>
            <TabBar activePath="summary" />
        </>
    );
}
