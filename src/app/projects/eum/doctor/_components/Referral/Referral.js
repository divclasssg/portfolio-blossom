import { formatDate } from '../../../_lib/formatDate';
import styles from './Referral.module.scss';

// D-001 섹션 6: 타과의뢰 결과 회신
export default function Referral({ referral }) {
  if (!referral) return null;

  return (
    <section className={styles.section}>
      <div className={styles['section-content']}>
        <h2 className={styles['section-title']}>Referral Response</h2>
        <div className={styles.card}>
        <dl className={styles.list}>
          <div className={styles.row}>
            <dt className={styles.label}>회신 대상</dt>
            <dd className={styles.value}>{referral.to_hospital} · {referral.to_doctor} 선생님</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>결과 요약</dt>
            <dd className={styles.value}>{referral.response_summary}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>회신일</dt>
            <dd className={styles.value}>{formatDate(referral.response_date)}</dd>
          </div>
        </dl>
        </div>
      </div>
    </section>
  );
}
