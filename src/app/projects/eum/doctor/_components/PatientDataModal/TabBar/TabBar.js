import styles from './TabBar.module.scss';

const TABS = [
    { id: 'symptoms', label: '증상' },
    { id: 'visit-history', label: '진료이력' },
];

export default function TabBar({ activeTab, onTabChange }) {
    return (
        <nav className={styles['tab-bar']} aria-label="환자 데이터 탭">
            <ul className={styles['tab-list']} role="tablist">
                {TABS.map((tab) => (
                    <li key={tab.id} role="presentation">
                        <button
                            className={`${styles.tab} ${activeTab === tab.id ? styles['tab--active'] : ''}`}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
