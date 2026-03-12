import styles from './AiBriefing.module.scss';
import AiWarningBanner from '../AiWarningBanner/AiWarningBanner';
import { AiIcon } from '../../../_components/icons';

const BADGE_LABEL = {
  recurring: 'Recurrent',
  abnormal:  'HR elevation',
  worsening: 'Notable',
};

// AI Pre-Consultation Brief (와이어프레임 섹션명)
export default function AiBriefing({ briefing, warnings }) {
  const { summary_text, highlights, model_version } = briefing;

  return (
    <section className={styles.section}>
      <div className={styles['section-content']}>
        <div className={styles['section-header']}>
          <AiIcon size={24} />
          <h2 className={styles['section-title']}>AI Pre-Consultation Brief</h2>
          <span className={styles['model-tag']}>{model_version}</span>
        </div>

        <p className={styles['summary-text']}>{summary_text}</p>

        {/* 인라인 하이라이트 뱃지 (와이어프레임 스타일) */}
        <div className={styles.highlights}>
          {highlights.map((item) => (
            <div key={item.title} className={styles['highlight-row']}>
              <span
                className={styles['highlight-badge']}
                style={{ background: item.badge_color }}
                aria-label={`하이라이트: ${BADGE_LABEL[item.type] ?? item.type}`}
              >
                {BADGE_LABEL[item.type] ?? item.type}
              </span>
              <p className={styles['highlight-desc']}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* AI 경고 — 닫기 불가, 영구 노출 */}
        <div className={styles['warnings-area']}>
          <AiWarningBanner warnings={warnings} />
        </div>
      </div>
    </section>
  );
}
