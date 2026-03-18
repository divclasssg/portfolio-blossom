import rawSessions from '../../../_references/data/patient/05_consultation_sessions.json';
import rawResults from '../../../_references/data/patient/06_consultation_results.json';
import { shiftDates } from '../../../_lib/dateShift';
import styles from './page.module.scss';
import AppBar from '../../_components/AppBar/AppBar';
import SummaryListItem from '../../_components/SummaryListItem/SummaryListItem';
import TabBar from '../../_components/TabBar/TabBar';

export const metadata = {
    title: '진료 요약 — Eum',
};

// 날짜 시프트 적용
const sessions = shiftDates(rawSessions);
const staticResults = shiftDates(rawResults);

// session_id → hospital_name 매핑
const staticSessionMap = Object.fromEntries(
    sessions.sessions.map((s) => [s.session_id, s.hospital_name])
);

// DB에서 전송된 진료 결과 조회
async function fetchDbResults() {
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
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

export default async function SummaryListPage({ params }) {
    const { patientId } = await params;
    const dbResults = await fetchDbResults();

    // DB 결과 → items 변환
    const dbItems = dbResults.map((row) => ({
        session_id: row.session_id,
        visit_date: row.transmitted_at?.slice(0, 10) ?? '',
        doctor_name: row.doctor_name,
        diagnosis_name: row.diagnosis_name,
        hospital_name: row.hospital_name ?? staticSessionMap[row.session_id] ?? '—',
    }));

    // DB에 이미 있는 session_id 집합
    const dbSessionIds = new Set(dbItems.map((item) => item.session_id));

    // 정적 JSON 과거 기록 → DB에 없는 것만 추가
    const staticItems = staticResults.consultation_results
        .filter((r) => !dbSessionIds.has(r.session_id))
        .map((r) => ({
            session_id: r.session_id,
            visit_date: r.visit_date,
            doctor_name: r.doctor_name,
            diagnosis_name: r.diagnosis_name,
            hospital_name: staticSessionMap[r.session_id] ?? '—',
        }));

    // 병합 후 최신순 정렬
    const items = [...dbItems, ...staticItems];
    items.sort((a, b) => b.visit_date.localeCompare(a.visit_date));

    return (
        <>
            <AppBar backHref={`/projects/eum/patient/${patientId}`} />
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
                                patientId={patientId}
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
            <TabBar activePath="summary" patientId={patientId} />
        </>
    );
}
