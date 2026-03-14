'use client';

import styles from './SegmentedControl.module.scss';

// iOS HIG 스타일 세그먼트 컨트롤
// tabs: [{ key: string, label: string }]
// WAI-ARIA tabs 패턴: 화살표 키로 탭 전환
export default function SegmentedControl({ tabs, activeTab, onTabChange }) {
    function handleKeyDown(e, currentIndex) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            onTabChange(tabs[(currentIndex + 1) % tabs.length].key);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onTabChange(tabs[(currentIndex - 1 + tabs.length) % tabs.length].key);
        }
    }

    return (
        <div className={styles['segmented-control']} role="tablist">
            {tabs.map((tab, index) => {
                const isActive = tab.key === activeTab;
                return (
                    <button
                        key={tab.key}
                        id={`tab-${tab.key}`}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${tab.key}`}
                        tabIndex={isActive ? 0 : -1}
                        className={`${styles['segment']} ${isActive ? styles['segment-active'] : ''}`}
                        onClick={() => onTabChange(tab.key)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
