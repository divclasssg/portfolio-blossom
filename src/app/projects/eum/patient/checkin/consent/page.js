import sessions from '../../../_references/data/patient/05_consultation_sessions.json';
import styles from './page.module.scss';
import AppBar from '../../_components/AppBar/AppBar';
import CheckinHospitalCard from '../../_components/CheckinHospitalCard/CheckinHospitalCard';
import CheckinScopeList from '../../_components/CheckinScopeList/CheckinScopeList';
import CheckinActions from '../../_components/CheckinActions/CheckinActions';

export const metadata = {
    title: 'P-017 진료 체크인 — 이음',
};

// ses_004: 서현내과의원 / 김도현 / 2026-02-17
const session = sessions.sessions.find((s) => s.session_id === 'ses_004');

function formatDate(isoString) {
    const d = new Date(isoString);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function CheckinConsentPage() {
    return (
        <>
            <AppBar />
            <main className={styles['content']}>
                {/* 동심원 아이콘 + 타이틀 */}
                <div className={styles['title-section']}>
                    <svg
                        className={styles['concentric-icon']}
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle cx="24" cy="24" r="22" stroke="#007AFF" strokeWidth="2" />
                        <circle
                            cx="24"
                            cy="24"
                            r="14"
                            stroke="#007AFF"
                            strokeWidth="2"
                            opacity="0.5"
                        />
                        <circle cx="24" cy="24" r="6" fill="#007AFF" />
                    </svg>
                    <h1 className={styles['title']}>진료 체크인</h1>
                </div>

                <CheckinHospitalCard
                    hospitalName={session.hospital_name}
                    doctorName={session.doctor_name}
                    date={formatDate(session.created_at)}
                />

                {/* 전송 데이터 안내 */}
                <div className={styles['scope-section']}>
                    <p className={styles['scope-notice']}>체크인 시 다음 데이터를 전송합니다.</p>
                    <CheckinScopeList />
                    <p className={styles['security-notice']}>
                        🛡 안전한 환경에서 데이터가 전송됩니다.
                    </p>
                </div>

                <CheckinActions />
            </main>
        </>
    );
}
