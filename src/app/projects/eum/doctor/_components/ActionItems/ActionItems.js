import styles from './ActionItems.module.scss';

// D-001: 행동 항목 — 비약물 권고 + 권장 시기
export default function ActionItems({ items }) {
    if (!items?.length) return null;

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <h2 className={styles['section-title']}>Action Items</h2>
                <div className={styles.card}>
                    <ul className={styles.list}>
                        {items.map((item) => (
                            <li key={item.task} className={styles.item}>
                                <span className={styles.task}>{item.task}</span>
                                <span className={styles.timing}>{item.recommended_timing}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
