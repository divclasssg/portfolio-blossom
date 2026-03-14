import './_styles/common.scss';
import styles from './layout.module.scss';

export default function DoctorLayout({ children }) {
    return (
        <div className={styles['doctor-viewport']}>
            {/* EMR 배경 목업 — 포트폴리오 데모용, 스크린리더 제외 */}
            <div className={styles['emr-background']} aria-hidden="true">
                <div className={styles['emr-titlebar']}>
                    <div className={styles['emr-window-controls']}>
                        <span />
                        <span />
                        <span />
                    </div>
                    <span className={styles['emr-title']}>
                        EMR System — 분당서울대학교병원 신경과
                    </span>
                </div>
                <div className={styles['emr-body']}>
                    <div className={styles['emr-sidebar']}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles['emr-nav-item']} />
                        ))}
                    </div>
                    <div className={styles['emr-content']}>
                        <div className={styles['emr-patient-header']} />
                        <div className={styles['emr-section']} />
                        <div className={styles['emr-section']} />
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}
