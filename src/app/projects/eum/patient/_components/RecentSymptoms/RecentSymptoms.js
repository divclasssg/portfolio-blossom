import { calcLinePoints, toLinePath } from '../../_lib/sparkline';
import styles from './RecentSymptoms.module.scss';

// ISO/UTC → KST Date 객체
function toKst(isoStr) {
    const d = new Date(isoStr);
    return new Date(d.getTime() + 9 * 60 * 60 * 1000);
}

// ISO 시간 문자열 → KST 기준 포맷: "YYYY. MM. DD 오전/오후 H:MM"
function formatDateTime(isoStr) {
    const kst = toKst(isoStr);
    const year = kst.getUTCFullYear();
    const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
    const day = String(kst.getUTCDate()).padStart(2, '0');
    const hour = kst.getUTCHours();
    const minute = String(kst.getUTCMinutes()).padStart(2, '0');
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${year}. ${month}. ${day} ${ampm} ${displayHour}:${minute}`;
}

const TREND_KO = {
    stable: '안정적',
    improving: '개선 중',
    worsening: '악화 중',
};

// SVG 꺾은선 차트 상수
const CHART_W = 200;
const CHART_H = 32;
const CHART_DIMS = { width: CHART_W, height: CHART_H, padX: 8, padY: 4, min: 0, max: 4 };
const LINE_COLOR = '#007AFF';

// KST 기준 YYYY-MM-DD
function toKstDateKey(isoStr) {
    const kst = toKst(isoStr);
    return kst.toISOString().slice(0, 10);
}

// KST 기준 오늘로부터 역산 7일, 날짜별 최대 severity 매핑
function buildBarData(symptomRecords) {
    const now = toKst(new Date().toISOString());
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setUTCDate(now.getUTCDate() - i);
        const key = d.toISOString().slice(0, 10);
        const m = d.getUTCMonth() + 1;
        const dd = d.getUTCDate();
        days.push({ key, label: `${m}/${dd}` });
    }

    // 날짜별 최대 severity (KST 기준)
    const severityMap = {};
    for (const record of symptomRecords) {
        const key = toKstDateKey(record.occurred_at);
        severityMap[key] = Math.max(severityMap[key] ?? 0, record.severity);
    }

    return days.map((day) => ({
        ...day,
        severity: severityMap[day.key] ?? 0,
    }));
}

export default function RecentSymptoms({ summary, symptomRecords }) {
    const { last_7_days_count, avg_severity, trend, most_recent } = summary;
    const bars = buildBarData(symptomRecords);

    return (
        <section className="home-section" aria-labelledby="recent-symptoms-title">
            <h2 id="recent-symptoms-title" className="home-section-title">
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
                </div>

                {/* 7일 꺾은선 차트 */}
                <div className={styles['sparkline-wrapper']}>
                    <svg
                        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                        className={styles['sparkline']}
                        role="img"
                        aria-label={`최근 7일 증상 추세: ${last_7_days_count}건`}
                    >
                        {(() => {
                            const severities = bars.map((b) => b.severity);
                            const points = calcLinePoints(severities, CHART_DIMS);
                            const linePath = toLinePath(points);
                            const areaPath = `${linePath} L${points[points.length - 1].x},${CHART_H - CHART_DIMS.padY} L${points[0].x},${CHART_H - CHART_DIMS.padY} Z`;

                            return (
                                <>
                                    <path d={areaPath} fill={LINE_COLOR} fillOpacity="0.12" />
                                    <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
                                    {bars.map((bar, i) =>
                                        bar.severity > 0 ? (
                                            <circle
                                                key={bar.key}
                                                cx={points[i].x}
                                                cy={points[i].y}
                                                r={2.5}
                                                fill={LINE_COLOR}
                                            />
                                        ) : null
                                    )}
                                </>
                            );
                        })()}
                    </svg>
                    <div className={styles['sparkline-labels']} aria-hidden="true">
                        {bars.map((bar) => (
                            <span key={bar.key} className={styles['sparkline-label']}>
                                {bar.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 최근 증상 */}
                {most_recent && (
                    <div className={styles['recent-item']}>
                        <time className={styles['recent-date']} dateTime={most_recent.occurred_at}>
                            {formatDateTime(most_recent.occurred_at)}
                        </time>
                        <p className={styles['recent-preview']}>
                            &ldquo;{most_recent.description_preview}&rdquo;
                        </p>
                    </div>
                )}

                {/* 추세 */}
                <div className={styles['trend-row']}>
                    <span className={styles['trend-label']}>추세</span>
                    <span className={styles['trend-value']}>{TREND_KO[trend] ?? trend}</span>
                </div>
            </div>
        </section>
    );
}
