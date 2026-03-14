import styles from './ChiefComplaint.module.scss';

export default function ChiefComplaint({ complaint }) {
    const { patient_text, symptom_count, symptom_period } = complaint;

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <h2 className={styles['section-title']}>Chief Complaint</h2>
                <p className={styles.meta}>
                    {symptom_count} Episodes ({symptom_period})
                </p>
                <blockquote className={styles['patient-text']}>{patient_text}</blockquote>
            </div>
        </section>
    );
}
