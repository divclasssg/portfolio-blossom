import Link from 'next/link';
import styles from './TabBar.module.scss';
import { ChartIcon, DocumentIcon, HomeIcon, PersonIcon } from '../../../_components/icons';

const TABS = [
    {
        key: 'home',
        label: '홈',
        href: '/projects/eum/patient',
        icon: (
            // 홈 아이콘
            <HomeIcon size={24} />
        ),
        iconActive: (
            <HomeIcon size={24} />
        ),
    },
    {
        key: 'symptoms',
        label: '증상 기록',
        href: '/projects/eum/patient/symptoms',
        icon: (
            // 기록 아이콘 (클립보드)
            <DocumentIcon variant="addnote" size={24} />
        ),
        iconActive: (
            <DocumentIcon variant="addnote" size={24} />
        ),
    },
    {
        key: 'summary',
        label: '진료요약',
        href: '/projects/eum/patient/summary',
        icon: (
            // 서류 아이콘
            <ChartIcon size={24} />
        ),
        iconActive: (
            <ChartIcon size={24} />
        ),
    },
    {
        key: 'mypage',
        label: '마이페이지',
        href: '/projects/eum/patient/mypage',
        icon: (
            // 인물 아이콘
            <PersonIcon size={24} />
        ),
        iconActive: (
            <PersonIcon size={24} />
        ),
    },
];

export default function TabBar({ activePath }) {
    return (
        <nav className={styles['tab-bar']} aria-label="주요 메뉴">
            <div className={styles['tab-list']}>
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
            </div>            
        </nav>
    );
}
