import Link from 'next/link';
import styles from './page.module.scss';

export const metadata = {
    title: '휴리스틱 평가 바로가기 — 이음',
};

const SHORTCUTS = [
    {
        href: '/projects/eum/patient/onboarding/welcome',
        icon: '📋',
        iconClass: 'card-icon-onboarding',
        title: '온보딩',
        desc: '환자 온보딩 플로우 (회원가입~완료)',
    },
    {
        href: '/projects/eum/patient/checkin',
        icon: '🏥',
        iconClass: 'card-icon-checkin',
        title: '체크인',
        desc: '병원 체크인 플로우 (접수~동의)',
    },
    {
        href: '/projects/eum/patient',
        icon: '📱',
        iconClass: 'card-icon-patient',
        title: '환자 앱 홈',
        desc: '환자 홈 대시보드',
    },
    {
        href: '/projects/eum/doctor',
        icon: '🩺',
        iconClass: 'card-icon-doctor',
        title: '의사 대시보드',
        desc: '의사 패널 (환자 목록·AI 분석 결과)',
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
                    <Link key={item.href} href={item.href} className={styles['card']}>
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
