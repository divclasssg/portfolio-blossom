import Link from 'next/link';
import styles from './RecentSymptoms.module.scss';

// ISO 시간 문자열 → 와이어프레임 포맷: "YYYY. MM. DD 오전/오후 H:MM"
function formatDateTime(isoStr) {
    // ISO 파싱 (로컬 타임존 의존 없이 직접 분리)
    const [datePart, timePart] = isoStr.split('T');
    const [year, month, day] = datePart.split('-');
    const [hourStr, minuteStr] = timePart.replace(/\+.*|Z$/, '').split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${year}. ${month}. ${day} ${ampm} ${displayHour}:${minuteStr}`;
}

const TREND_KO = {
    stable: '안정적',
    improving: '개선 중',
    worsening: '악화 중',
};

export default function RecentSymptoms({ summary }) {
    const { last_7_days_count, avg_severity, trend, most_recent } = summary;

    return (
        <section className={styles['section']} aria-labelledby="recent-symptoms-title">
            <h2 id="recent-symptoms-title" className={styles['section-title']}>
                최근 증상
            </h2>
            <div className="home-card">
                {/* 상단 요약 행 */}
                <div className={styles['summary-row']}>
                    <span className={styles['summary-text']}>
                        최근 7일 <strong>{last_7_days_count}건</strong>
                        <span className={styles['dot']}>·</span>
                        평균 강도 <strong>{avg_severity}</strong>
                    </span>
                    <Link
                        href="/projects/eum/patient/symptoms"
                        className={styles['link']}
                        aria-label="증상 기록 보기"
                    >
                        증상 기록 &gt;
                    </Link>
                </div>

                {/* 구분선 */}
                <hr className={styles['divider']} />

                {/* 최근 증상 */}
                <div className={styles['recent-item']}>
                    <time className={styles['recent-date']} dateTime={most_recent.occurred_at}>
                        {formatDateTime(most_recent.occurred_at)}
                    </time>
                    <p className={styles['recent-preview']}>
                        &ldquo;{most_recent.description_preview}&rdquo;
                    </p>
                </div>

                {/* 구분선 */}
                <hr className={styles['divider']} />

                {/* 추세 */}
                <div className={styles['trend-row']}>
                    <span className={styles['trend-label']}>추세</span>
                    <span className={styles['trend-value']}>{TREND_KO[trend] ?? trend}</span>
                </div>
            </div>
        </section>
    );
}
