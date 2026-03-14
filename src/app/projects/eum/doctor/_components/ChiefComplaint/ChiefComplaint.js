'use client';

import { useState } from 'react';
import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';
import ActionButton from '../ActionButton/ActionButton';
import styles from './ChiefComplaint.module.scss';

// "2020-03-10" → "2020.03"
function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
}

export default function ChiefComplaint({ complaint, medications }) {
    const [activeTab, setActiveTab] = useState('complaint');
    const { open: openModal } = usePatientDataModal();

    return (
        <section className={`section ${styles.section}`}>
            <div className={`section-content ${styles['section-content']}`}>
                {/* 탭 바 */}
                <div className={styles['tab-bar']} role="tablist">
                    <button
                        role="tab"
                        className={`${styles.tab} ${activeTab === 'complaint' ? styles['tab--active'] : ''}`}
                        aria-selected={activeTab === 'complaint'}
                        onClick={() => setActiveTab('complaint')}
                    >
                        Chief Complaint
                    </button>
                    <button
                        role="tab"
                        className={`${styles.tab} ${activeTab === 'medications' ? styles['tab--active'] : ''}`}
                        aria-selected={activeTab === 'medications'}
                        onClick={() => setActiveTab('medications')}
                    >
                        복용약
                    </button>
                </div>

                {/* 탭 패널: Chief Complaint */}
                {activeTab === 'complaint' && (
                    <div role="tabpanel">
                        <p className={styles.meta}>
                            {complaint.symptom_count} Episodes ({complaint.symptom_period})
                        </p>
                        <blockquote className={styles['patient-text']}>
                            {complaint.patient_text}
                        </blockquote>
                    </div>
                )}

                {/* 탭 패널: 복용약 */}
                {activeTab === 'medications' && (
                    <div role="tabpanel">
                        <ul className={styles['med-list']}>
                            {medications.map((med, i) => (
                                <li key={i}>
                                    <span className={styles['med-name']}>
                                        {med.drug_name} {med.dosage} ({med.frequency})
                                    </span>
                                    <span className={styles['med-meta']}>
                                        {med.prescribing_hospital}
                                        {med.days != null && ` · ${med.days}일분`}
                                        {' · '}{formatDate(med.start_date)}~
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <ActionButton
                            className={styles['visit-history-btn']}
                            onClick={() => openModal('visit-history')}
                        >
                            진료이력 확인하기
                        </ActionButton>
                    </div>
                )}
            </div>
        </section>
    );
}
