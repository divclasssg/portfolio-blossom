import styles from './AiBriefing.module.scss';
import Badge from '../Badge/Badge';

// AI Pre-Consultation Brief — AiDataProvider 내 서브섹션
export default function AiBriefing({ briefing }) {
    const { summary_text, summary_bullets, model_version } = briefing;

    return (
        <div className={styles['subsection']}>
            <h3 className={styles['subsection-title']}>Pre-Consultation Brief</h3>

            <Badge className={styles['model-tag']}>{model_version}</Badge>

            {/* summary_bullets가 있으면 불릿 리스트, 없으면 기존 문단 폴백 */}
            {summary_bullets?.length > 0 ? (
                <ul className={styles['summary-bullets']}>
                    {summary_bullets.map((text, i) => (
                        <li key={i} className={styles['summary-bullet']}>{text}</li>
                    ))}
                </ul>
            ) : (
                <p className={styles['summary-text']}>{summary_text}</p>
            )}
        </div>
    );
}
