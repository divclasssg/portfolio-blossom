import { formatDate } from '../../../_lib/formatDate';
import styles from './NextVisit.module.scss';

// D-001 섹션 7: 다음 방문 날짜
export default function NextVisit({ date }) {
  if (!date) return null;

  return (
    <section className={styles.section}>
      <div className={styles['section-content']}>
        <h2 className={styles['section-title']}>Next Visit</h2>
        <div className={styles.card}>
          <p className={styles.date}>{formatDate(date)}</p>
        </div>
      </div>
    </section>
  );
}
