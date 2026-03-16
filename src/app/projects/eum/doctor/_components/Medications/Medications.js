'use client';

import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';
import ActionButton from '../ActionButton/ActionButton';
import styles from './Medications.module.scss';

// "2020-03-10" → "2020.03"
function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${year}.${month}`;
}

export default function Medications({ medications }) {
    const { open: openModal } = usePatientDataModal();

    return (
        <section className={`section ${styles.section}`} data-grid-area="medications">
            <div className="section-content">
                <h2 className="section-title">복용약</h2>

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
        </section>
    );
}
