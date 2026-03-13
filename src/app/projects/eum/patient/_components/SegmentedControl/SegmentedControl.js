'use client';

import styles from './SegmentedControl.module.scss';

// iOS HIG 스타일 세그먼트 컨트롤
// tabs: [{ key: string, label: string }]
export default function SegmentedControl({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles['segmented-control']} role="tablist">
      {tabs.map((tab) => {
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
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
