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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const TREND_KO = {
    stable: '안정적',
    improving: '개선 중',
    worsening: '악화 중',
};

// SVG 꺾은선 차트 상수 (VitalsToday 패턴)
const CHART_W = 200;
const CHART_H = 32;
const PAD_X = 8;
const PAD_Y = 4;
const MAX_SEVERITY = 4;
const LINE_COLOR = '#007AFF';

function calcLinePoints(severities) {
    const chartW = CHART_W - PAD_X * 2;
    const chartH = CHART_H - PAD_Y * 2;
    return severities.map((sev, i) => ({
        x: PAD_X + (i / (severities.length - 1)) * chartW,
        y: PAD_Y + (1 - sev / MAX_SEVERITY) * chartH,
    }));
}

function toLinePath(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

// 기준 날짜(most_recent.occurred_at)로부터 역산 7일, 날짜별 최대 severity 매핑
function buildBarData(symptomRecords, referenceDate) {
    const ref = new Date(referenceDate);
    ref.setHours(23, 59, 59, 999); // 기준일 포함

    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(ref);
        d.setDate(ref.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({ key, weekday: WEEKDAYS[d.getDay()] });
    }

    // 날짜별 최대 severity
    const severityMap = {};
    for (const record of symptomRecords) {
        const key = record.occurred_at.slice(0, 10);
        severityMap[key] = Math.max(severityMap[key] ?? 0, record.severity);
    }

    return days.map((day) => ({
        ...day,
        severity: severityMap[day.key] ?? 0,
    }));
}

export default function RecentSymptoms({ summary, symptomRecords }) {
    const { last_7_days_count, avg_severity, trend, most_recent } = summary;
    const bars = buildBarData(symptomRecords, new Date().toISOString());

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
                            const points = calcLinePoints(severities);
                            const linePath = toLinePath(points);
                            const areaPath = `${linePath} L${points[points.length - 1].x},${CHART_H - PAD_Y} L${points[0].x},${CHART_H - PAD_Y} Z`;

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
                                {bar.weekday}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 최근 증상 */}
                <div className={styles['recent-item']}>
                    <time className={styles['recent-date']} dateTime={most_recent.occurred_at}>
                        {formatDateTime(most_recent.occurred_at)}
                    </time>
                    <p className={styles['recent-preview']}>
                        &ldquo;{most_recent.description_preview}&rdquo;
                    </p>
                </div>

                {/* 추세 */}
                <div className={styles['trend-row']}>
                    <span className={styles['trend-label']}>추세</span>
                    <span className={styles['trend-value']}>{TREND_KO[trend] ?? trend}</span>
                </div>
            </div>
        </section>
    );
}
