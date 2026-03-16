import Link from 'next/link';
import styles from './page.module.scss';

export const metadata = {
    title: 'UT 바로가기 — 환자 앱',
};

const SHORTCUTS = [
    {
        href: '/projects/eum/patient/onboarding/welcome',
        icon: '\u{1F4CB}',
        iconClass: 'card-icon-onboarding',
        title: '온보딩 테스트',
        desc: '환자 온보딩 플로우 (회원가입~완료)',
    },
    {
        href: '/projects/eum/patient/checkin',
        icon: '\u{1F3E5}',
        iconClass: 'card-icon-checkin',
        title: '체크인 테스트',
        desc: '병원 체크인 플로우 (접수~동의)',
    },
];

export default function PatientUtPage() {
    return (
        <main className={styles['page']}>
            <header className={styles['header']}>
                <h1 className={styles['title']}>환자 앱 UT</h1>
                <p className={styles['subtitle']}>테스트할 플로우를 선택하세요</p>
            </header>

            <nav className={styles['card-list']} aria-label="테스트 바로가기">
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
