import Link from 'next/link';
import styles from './TabBar.module.scss';
import { ChartIcon, DocumentIcon, HomeIcon, PersonIcon } from '../../../_components/icons';

function getTabs(patientId) {
    const base = `/projects/eum/patient/${patientId}`;
    return [
        {
            key: 'home',
            label: '홈',
            href: base,
            icon: <HomeIcon size={24} />,
            iconActive: <HomeIcon size={24} />,
        },
        {
            key: 'symptoms',
            label: '증상 기록',
            href: `${base}/symptoms`,
            icon: <DocumentIcon variant="addnote" size={24} />,
            iconActive: <DocumentIcon variant="addnote" size={24} />,
        },
        {
            key: 'summary',
            label: '진료요약',
            href: `${base}/summary`,
            icon: <ChartIcon size={24} />,
            iconActive: <ChartIcon size={24} />,
        },
        {
            key: 'mypage',
            label: '마이페이지',
            href: `${base}/mypage`,
            icon: <PersonIcon size={24} />,
            iconActive: <PersonIcon size={24} />,
        },
    ];
}

export default function TabBar({ activePath, patientId }) {
    return (
        <nav className={styles['tab-bar']} aria-label="주요 메뉴">
            <div className={styles['tab-list']}>
                {getTabs(patientId).map((tab) => {
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
