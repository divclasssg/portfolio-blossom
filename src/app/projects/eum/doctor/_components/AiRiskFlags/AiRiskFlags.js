import styles from './AiRiskFlags.module.scss';
import { AiIcon } from '../../../_components/icons';

const TYPE_CONFIG = {
    recurring: { icon: '↻', label: 'Recurrent' },
    abnormal: { icon: '⚡', label: 'Abnormal' },
    worsening: { icon: '↑', label: 'Worsening' },
};

// AI 위험 신호 — [근거 보기] 목적지 보류 (결정사항 문서 §6-1)
export default function AiRiskFlags({ highlights }) {
    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <div className={styles['section-header']}>
                    <AiIcon size={24} />
                    <h2 className={styles['section-title']}>AI Risk Flags</h2>
                </div>

                <div className={styles.cards}>
                    {highlights.map((item) => {
                        const config = TYPE_CONFIG[item.type] ?? { icon: '!', label: item.type };
                        return (
                            <article key={item.title} className={styles.card}>
                                <div className={styles['card-header']}>
                                    <span
                                        className={styles.badge}
                                        style={{ background: item.badge_color }}
                                        aria-label={`신호 유형: ${config.label}`}
                                    >
                                        {config.label}
                                    </span>
                                    <h3 className={styles['card-title']}>{item.title}</h3>
                                    <button
                                        className={styles['evidence-btn']}
                                        aria-label={`${item.title} 근거 보기 (준비 중)`}
                                        disabled
                                    >
                                        근거 보기
                                    </button>
                                </div>
                                <div className={styles['card-body']}>
                                    <p className={styles.description}>{item.description}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
