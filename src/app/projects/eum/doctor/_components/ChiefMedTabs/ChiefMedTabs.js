'use client';

import { useState } from 'react';
import styles from './ChiefMedTabs.module.scss';

const TABS = [
    { id: 'chief', label: 'Chief Complaint' },
    { id: 'medications', label: '복용약' },
];

// 640px 미만: 탭 전환으로 ChiefComplaint / Medications 표시
// 640px 이상: display:contents → 래퍼 해제, 자식이 그리드에 직접 참여
export default function ChiefMedTabs({ children }) {
    const [activeTab, setActiveTab] = useState('chief');
    const childArray = Array.isArray(children) ? children : [children];

    return (
        <div className={styles.wrapper} data-grid-area="chief-med">
            {/* 탭 바 — 640px 미만에서만 표시 */}
            <nav className={styles['tab-bar']} aria-label="주호소·복용약 탭">
                <ul className={styles['tab-list']} role="tablist">
                    {TABS.map((tab) => (
                        <li key={tab.id} role="presentation">
                            <button
                                className={`${styles.tab} ${activeTab === tab.id ? styles['tab--active'] : ''}`}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`tabpanel-${tab.id}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div
                id="tabpanel-chief"
                role="tabpanel"
                className={`${styles['tab-panel']} ${activeTab !== 'chief' ? styles['tab-panel--hidden'] : ''}`}
                data-grid-area="chief"
            >
                {childArray[0]}
            </div>
            <div
                id="tabpanel-medications"
                role="tabpanel"
                className={`${styles['tab-panel']} ${activeTab !== 'medications' ? styles['tab-panel--hidden'] : ''}`}
                data-grid-area="medications"
            >
                {childArray[1]}
            </div>
        </div>
    );
}
