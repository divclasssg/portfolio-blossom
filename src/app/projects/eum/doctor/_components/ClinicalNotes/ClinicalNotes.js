import styles from './ClinicalNotes.module.scss';

// D-001 섹션 3: 의사 소견 (의료 텍스트 원문)
export default function ClinicalNotes({ findings }) {
    return (
        <section className="section">
            <div className="section-content">
                <h2 className="section-title">Clinical Notes</h2>
                <div className="card">
                    <p className={styles.findings}>{findings}</p>
                </div>
            </div>
        </section>
    );
}
