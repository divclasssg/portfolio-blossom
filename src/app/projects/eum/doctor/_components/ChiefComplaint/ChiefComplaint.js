import styles from './ChiefComplaint.module.scss';

export default function ChiefComplaint({ complaint }) {
    return (
        <section className={`section ${styles.section}`}>
            <div className="section-content">
                <h2 className="sr-only">Chief Complaint</h2>

                <p className={styles.meta}>
                    {complaint.symptom_count} Episodes ({complaint.symptom_period})
                </p>
                <blockquote className={styles['patient-text']}>
                    {complaint.patient_text}
                </blockquote>
            </div>
        </section>
    );
}
