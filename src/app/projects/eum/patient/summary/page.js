import consultationResults from '../../_references/data/patient/06_consultation_results.json';
import sessions from '../../_references/data/patient/05_consultation_sessions.json';
import styles from './page.module.scss';
import AppBar from '../_components/AppBar/AppBar';
import SummaryListItem from '../_components/SummaryListItem/SummaryListItem';
import TabBar from '../_components/TabBar/TabBar';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: '진료 요약 — Eum',
};

// session_id → hospital_name 매핑 (정적 JSON)
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

    // 정적 JSON 기반 목록 (기존)
    const staticItems = consultationResults.consultation_results.map((r) => ({
        session_id: r.session_id,
        visit_date: r.visit_date,
        doctor_name: r.doctor_name,
        diagnosis_name: r.diagnosis_name,
        hospital_name: staticSessionMap[r.session_id] ?? '—',
    }));

    // DB 결과 → 목록 아이템 변환
    const dbItems = dbResults.map((row) => ({
        session_id: row.session_id,
        visit_date: row.transmitted_at?.slice(0, 10) ?? '',
        doctor_name: row.doctor_name,
        diagnosis_name: row.diagnosis_name,
        hospital_name: row.hospital_name ?? '—',
    }));

    // 병합: DB 우선 (session_id 기준 중복 제거)
    const seen = new Set();
    const merged = [];
    for (const item of [...dbItems, ...staticItems]) {
        if (!seen.has(item.session_id)) {
            seen.add(item.session_id);
            merged.push(item);
        }
    }

    // 최신순 정렬
    merged.sort((a, b) => b.visit_date.localeCompare(a.visit_date));

    return (
        <>
            <AppBar />
            <main className={styles['content']}>
                <h1 className={styles['title']}>진료 요약</h1>
                <ul className={styles['list']}>
                    {merged.map((item) => (
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
