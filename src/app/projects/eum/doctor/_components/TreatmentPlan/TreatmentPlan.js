import styles from './TreatmentPlan.module.scss';

// D-001: 치료 계획 + 다음 단계
export default function TreatmentPlan({ treatmentPlan, nextSteps }) {
  if (!treatmentPlan && !nextSteps) return null;

  return (
    <section className={styles.section}>
      <div className={styles['section-content']}>
        <h2 className={styles['section-title']}>Treatment Plan</h2>
        <div className={styles.card}>
        {treatmentPlan && <p className={styles.text}>{treatmentPlan}</p>}
        {nextSteps && (
          <>
            <hr className={styles.divider} />
            <p className={styles.text}>{nextSteps}</p>
          </>
        )}
        </div>
      </div>
    </section>
  );
}
