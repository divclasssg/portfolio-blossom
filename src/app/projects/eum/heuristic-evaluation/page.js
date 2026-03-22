import Link from 'next/link';
import styles from './page.module.scss';

export const metadata = {
    title: '휴리스틱 평가 바로가기 — 이음',
};

const PATIENT_ID = 'pat_admin_001';

const SHORTCUTS = [
    {
        href: '/projects/eum/patient/onboarding/welcome',
        icon: '📋',
        iconClass: 'card-icon-onboarding',
        title: '온보딩',
        desc: '환자 회원가입 플로우 (면책고지~가입완료)',
    },
    {
        href: `/projects/eum/patient/${PATIENT_ID}`,
        icon: '📱',
        iconClass: 'card-icon-patient',
        title: '환자앱 둘러보기',
        desc: '홈 · 증상 기록 · 진료 결과 확인',
    },
    {
        href: `/projects/eum/doctor/${PATIENT_ID}`,
        icon: '🩺',
        iconClass: 'card-icon-doctor',
        title: '의사 대시보드',
        desc: 'AI 분석 확인 · 결과 전송 화면',
    },
    {
        href: '/projects/eum/heuristic-evaluation/prepare-result',
        icon: '🔔',
        iconClass: 'card-icon-result',
        title: '결과 알림 확인',
        desc: '진료 결과 토스트 알림 체험',
    },
];

export default function HeuristicEvaluationPage() {
    return (
        <main className={styles['page']}>
            <header className={styles['header']}>
                <h1 className={styles['title']}>휴리스틱 평가</h1>
                <p className={styles['subtitle']}>평가할 화면을 선택하세요</p>
            </header>

            <nav className={styles['card-list']} aria-label="평가 바로가기">
                {SHORTCUTS.map((item) => (
                    <Link key={item.href} href={item.href} target="_blank" className={styles['card']}>
                        <span
                            className={`${styles['card-icon']} ${styles[item.iconClass]}`}
                            aria-hidden="true"
                        >
                            {item.icon}
                        </span>
                        <div className={styles['card-body']}>
                            <p className={styles['card-title']}>{item.title}</p>
                            <p className={styles['card-desc']}>{item.desc}</p>
                        </div>
                        <span className={styles['card-arrow']} aria-hidden="true">
                            ›
                        </span>
                    </Link>
                ))}
            </nav>
        </main>
    );
}
