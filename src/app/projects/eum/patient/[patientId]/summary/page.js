import rawResults from '../../../_references/data/patient/06_consultation_results.json';
import rawSessions from '../../../_references/data/patient/05_consultation_sessions.json';
import { shiftDates } from '../../../_lib/dateShift';
import styles from './page.module.scss';
import AppBar from '../../_components/AppBar/AppBar';
import SummaryListItem from '../../_components/SummaryListItem/SummaryListItem';
import TabBar from '../../_components/TabBar/TabBar';

export const metadata = {
    title: '진료 요약 — Eum',
};

// 정적 JSON 폴백용
const staticResults = shiftDates(rawResults);
const staticSessionMap = Object.fromEntries(
    shiftDates(rawSessions).sessions.map((s) => [s.session_id, s.hospital_name])
);

// DB에서 해당 환자의 진료 결과만 조회 (sessions 조인으로 patient_id 필터링)
async function fetchDbResults(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('consultation_results')
            .select('session_id, doctor_name, hospital_name, diagnosis_name, transmitted_at, sessions!inner(patient_id)')
            .eq('sessions.patient_id', patientId)
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
    const dbResults = await fetchDbResults(patientId);

    // DB에 해당 환자 결과가 있으면 DB만 사용, 없으면 정적 JSON 폴백
    // (DB 세션 ID는 리매핑되어 정적 JSON과 다르므로 혼합 불가)
    let items;

    if (dbResults.length > 0) {
        items = dbResults.map((row) => ({
            session_id: row.session_id,
            visit_date: row.transmitted_at?.slice(0, 10) ?? '',
            doctor_name: row.doctor_name,
            diagnosis_name: row.diagnosis_name,
            hospital_name: row.hospital_name ?? '—',
        }));
    } else {
        items = staticResults.consultation_results.map((r) => ({
            session_id: r.session_id,
            visit_date: r.visit_date,
            doctor_name: r.doctor_name,
            diagnosis_name: r.diagnosis_name,
            hospital_name: staticSessionMap[r.session_id] ?? '—',
        }));
    }

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
