import styles from './ClinicalNotes.module.scss';

// D-001 섹션 3: 의사 소견 (의료 텍스트 원문)
export default function ClinicalNotes({ findings }) {
  return (
    <section className={styles.section}>
      <div className={styles['section-content']}>
        <h2 className={styles['section-title']}>Clinical Notes</h2>
        <div className={styles.card}>
          <p className={styles.findings}>{findings}</p>
        </div>
      </div>
    </section>
  );
}
