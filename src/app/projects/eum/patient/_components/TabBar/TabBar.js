import Link from 'next/link';
import styles from './TabBar.module.scss';

const TABS = [
    {
        key: 'home',
        label: '홈',
        href: '/projects/eum/patient',
        icon: (
            // 홈 아이콘
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9 21V12h6v9"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
        iconActive: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
                <path d="M9 21V12h6v9" fill="white" />
            </svg>
        ),
    },
    {
        key: 'symptoms',
        label: '증상 기록',
        href: '/projects/eum/patient/symptoms',
        icon: (
            // 기록 아이콘 (클립보드)
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
                <path
                    d="M9 3v2h6V3"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M9 12h6M9 16h4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        iconActive: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path
                    d="M9 3v2h6V3"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9 12h6M9 16h4"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        key: 'summary',
        label: '진료요약',
        href: '/projects/eum/patient/summary',
        icon: (
            // 서류 아이콘
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M14 2v6h6M9 13h6M9 17h4" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        iconActive: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <path
                    d="M14 2v6h6M9 13h6M9 17h4"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                />
            </svg>
        ),
    },
    {
        key: 'mypage',
        label: '마이페이지',
        href: '/projects/eum/patient/mypage',
        icon: (
            // 인물 아이콘
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        iconActive: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                />
            </svg>
        ),
    },
];

export default function TabBar({ activePath }) {
    return (
        <nav className={styles['tab-bar']} aria-label="주요 메뉴">
            {TABS.map((tab) => {
                const isActive = tab.key === activePath;
                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        className={`${styles['tab']} ${isActive ? styles['tab--active'] : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className={styles['icon']}>
                            {isActive ? tab.iconActive : tab.icon}
                        </span>
                        <span className={styles['label']}>{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
