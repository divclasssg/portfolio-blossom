import styles from './SymptomTimeline.module.scss';

const SEVERITY_MAP = {
    1: { label: '약함', color: '#E8F5E9' },
    2: { label: '보통', color: '#FFF9C4' },
    3: { label: '심함', color: '#FFE0B2' },
    4: { label: '극심', color: '#FFEBEE' },
};

const LOCATION_MAP = {
    HOME: '집',
    WORK: '직장',
    OUTSIDE: '외출',
};

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
});

export default function SymptomTimeline({ records }) {
    // 최신순 정렬
    const sorted = [...records].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at));

    return (
        <ul className={styles['timeline-list']} aria-label="증상 기록 목록">
            {sorted.map((record) => {
                const severity = SEVERITY_MAP[record.severity] || SEVERITY_MAP[2];
                const text = record.description || record.voice_transcript;
                const location = LOCATION_MAP[record.location_type];

                return (
                    <li key={record.symptom_id}>
                        <article className={styles['timeline-card']}>
                            <div className={styles['card-header']}>
                                <time className={styles['card-date']} dateTime={record.occurred_at}>
                                    {dateFormatter.format(new Date(record.occurred_at))}
                                </time>
                                <span className={styles['severity-badge']}>
                                    <span
                                        className={styles['severity-dot']}
                                        style={{ backgroundColor: severity.color }}
                                        aria-hidden="true"
                                    />
                                    {severity.label}
                                </span>
                            </div>
                            {text && <p className={styles['card-text']}>{text}</p>}
                            {location && (
                                <span className={styles['card-location']}>
                                    <span aria-hidden="true">📍</span> {location}
                                </span>
                            )}
                        </article>
                    </li>
                );
            })}
        </ul>
    );
}
