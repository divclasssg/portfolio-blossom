import styles from './ClinicalNotes.module.scss';
import Badge from '../Badge/Badge';

// D-001 섹션 3: 의사 소견 (의료 텍스트 원문)
export default function ClinicalNotes({ findings }) {
    return (
        <section className="section">
            <div className="section-content">
                <h2 className={`section-title ${styles['title-row']}`}>
                    Clinical Notes
                    <Badge className={styles['readonly-badge']}>읽기전용</Badge>
                </h2>
                <div className="card">
                    <p className={styles.findings}>{findings}</p>
                </div>
            </div>
        </section>
    );
}
