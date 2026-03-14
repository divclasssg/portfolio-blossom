import styles from './Prescription.module.scss';

// D-001 섹션 5: 처방 — 약물명/기간/쉬운말
export default function Prescription({ prescriptions, contextNote }) {
    if (!prescriptions?.length) {
        return (
            <section className="section">
                <div className="section-content">
                    <h2 className="section-title">Prescription</h2>
                    <div className="card">
                        <p className={styles.empty}>처방 없음</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section">
            <div className="section-content">
                <h2 className="section-title">Prescription</h2>
                <div className="card">
                    {contextNote && <p className={styles['context-note']}>{contextNote}</p>}
                    <ul className={styles.list}>
                        {prescriptions.map((item) => (
                            <li key={item.name} className={styles.item}>
                                <p className={styles['drug-line']}>
                                    <span className={styles['drug-name']}>{item.name}</span>
                                    <span className={styles.separator}> — </span>
                                    <span className={styles.duration}>{item.duration}</span>
                                </p>
                                <p className={styles['plain-line']}>→ {item.plain_language}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
