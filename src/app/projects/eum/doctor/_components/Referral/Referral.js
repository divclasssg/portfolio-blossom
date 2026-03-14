import styles from './Referral.module.scss';

// D-001 섹션 7: 타과의뢰
export default function Referral({ referral }) {
    if (!referral) return null;

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <h2 className={styles['section-title']}>Referral</h2>
                <div className={styles.card}>
                    <dl className={styles.list}>
                        <div className={styles.row}>
                            <dt className={styles.label}>의뢰 대상</dt>
                            <dd className={styles.value}>
                                {referral.to_hospital} · {referral.to_doctor} 선생님
                            </dd>
                        </div>
                        <div className={styles.row}>
                            <dt className={styles.label}>의뢰 사유</dt>
                            <dd className={styles.value}>{referral.referral_reason}</dd>
                        </div>
                        <div className={styles.row}>
                            <dt className={styles.label}>의뢰 요청 검사</dt>
                            <dd className={styles.value}>
                                {referral.requested_tests?.join(', ')}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
}
