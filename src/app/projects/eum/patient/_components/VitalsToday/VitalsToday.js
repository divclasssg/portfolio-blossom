'use client';

import { useState } from 'react';
import ArrowIcon from '../../../_components/icons/ArrowIcon';
import BpIcon from '../../../_components/icons/BpIcon';
import HeartIcon from '../../../_components/icons/HeartIcon';
import SleepIcon from '../../../_components/icons/SleepIcon';
import WalkingIcon from '../../../_components/icons/WalkingIcon';
import styles from './VitalsToday.module.scss';

// 날짜 문자열에서 'YYYY-MM-DD' 부분만 추출
function toDateKey(isoString) {
    return isoString.slice(0, 10);
}

// 최근 7일 웨어러블 데이터 추출 (날짜순)
function getLast7Days(wearableHistory) {
    if (!wearableHistory || wearableHistory.length === 0) return [];
    return wearableHistory
        .slice()
        .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
        .slice(-7);
}

// 증상 기록에서 날짜별 최대 강도 맵 생성
function buildSymptomMap(symptomRecords, dateKeys) {
    const map = {};
    if (!symptomRecords) return map;
    const dateSet = new Set(dateKeys);
    for (const record of symptomRecords) {
        const key = toDateKey(record.occurred_at);
        if (!dateSet.has(key)) continue;
        map[key] = Math.max(map[key] ?? 0, record.severity);
    }
    return map;
}

// ── 주제별 색상 (tokens.scss 대응) ────────────────────────────────────────────
const COLOR_HEART = '#ff3b30';  // $color-danger
const COLOR_SLEEP = '#5856d6';  // $color-secondary
const COLOR_BP = '#34c759';     // $color-normal
const COLOR_STEPS = '#ff9500';  // $color-warning

// ── SVG 좌표 계산 공통 ────────────────────────────────────────────────────────
const W = 120; // viewBox 너비
const H = 24;  // viewBox 높이
const PAD_X = 2;
const PAD_Y = 3;

function calcLinePoints(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const chartW = W - PAD_X * 2;
    const chartH = H - PAD_Y * 2;

    return values.map((v, i) => ({
        x: PAD_X + (i / (values.length - 1)) * chartW,
        y: PAD_Y + (1 - (v - min) / range) * chartH,
    }));
}

function toLinePath(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

// ── Area Sparkline (심박수) ────────────────────────────────────────────────────
function HeartRateSparkline({ data, symptomMap }) {
    const values = data.map((d) => d.heart_rate_bpm);
    const points = calcLinePoints(values);
    const linePath = toLinePath(points);
    const areaPath = `${linePath} L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`;
    const symptomDays = data.filter((d) => symptomMap[toDateKey(d.recorded_at)]).length;

    return (
        <Sparkline ariaLabel={`최근 7일 심박수 추세${symptomDays > 0 ? `, 증상 발생일 ${symptomDays}일` : ''}`}>
            <path d={areaPath} fill={COLOR_HEART} fillOpacity="0.12" />
            <path d={linePath} fill="none" stroke={COLOR_HEART} strokeWidth="1.5" strokeLinejoin="round" />
            <SymptomDots data={data} symptomMap={symptomMap} xPositions={points.map((p) => p.x)} />
        </Sparkline>
    );
}

// ── Bar Sparkline (수면) ───────────────────────────────────────────────────────
function SleepSparkline({ data, symptomMap }) {
    const values = data.map((d) => d.sleep_hours);
    const max = Math.max(...values, 9);
    const RECOMMENDED = 7;
    const chartH = H - PAD_Y * 2;
    const gap = 2;
    const barCount = values.length;
    const barW = (W - PAD_X * 2 - gap * (barCount - 1)) / barCount;
    const refY = PAD_Y + (1 - RECOMMENDED / max) * chartH;
    const symptomDays = data.filter((d) => symptomMap[toDateKey(d.recorded_at)]).length;

    return (
        <Sparkline ariaLabel={`최근 7일 수면 추세, 권장 7시간${symptomDays > 0 ? `, 증상 발생일 ${symptomDays}일` : ''}`}>
            <line x1={PAD_X} y1={refY} x2={W - PAD_X} y2={refY} stroke="#8E8E93" strokeWidth="0.5" strokeDasharray="2 1.5" />
            {values.map((v, i) => {
                const barH = (v / max) * chartH;
                const x = PAD_X + i * (barW + gap);
                const y = PAD_Y + chartH - barH;
                return (
                    <rect key={i} x={x} y={y} width={barW} height={barH} rx={1.5} fill={COLOR_SLEEP} fillOpacity={v >= RECOMMENDED ? 0.7 : 0.3} />
                );
            })}
            <SymptomDots
                data={data}
                symptomMap={symptomMap}
                xPositions={values.map((_, i) => PAD_X + i * (barW + gap) + barW / 2)}
            />
        </Sparkline>
    );
}

// ── Line Sparkline (혈압 — 수축기) ────────────────────────────────────────────
function BpSparkline({ data }) {
    const systolic = data.map((d) => d.bp_systolic);
    const diastolic = data.map((d) => d.bp_diastolic);

    // 수축기·이완기 함께 스케일링 (공통 min/max)
    const allValues = [...systolic, ...diastolic];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    const chartW = W - PAD_X * 2;
    const chartH = H - PAD_Y * 2;

    const sysPoints = systolic.map((v, i) => ({
        x: PAD_X + (i / (systolic.length - 1)) * chartW,
        y: PAD_Y + (1 - (v - min) / range) * chartH,
    }));
    const diaPoints = diastolic.map((v, i) => ({
        x: PAD_X + (i / (diastolic.length - 1)) * chartW,
        y: PAD_Y + (1 - (v - min) / range) * chartH,
    }));

    // 수축기-이완기 사이 밴드
    const bandPath = [
        ...sysPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`),
        ...diaPoints.slice().reverse().map((p) => `L${p.x},${p.y}`),
        'Z',
    ].join(' ');

    return (
        <Sparkline ariaLabel="최근 7일 혈압 추세">
            <path d={bandPath} fill={COLOR_BP} fillOpacity="0.12" />
            <path d={toLinePath(sysPoints)} fill="none" stroke={COLOR_BP} strokeWidth="1.2" strokeLinejoin="round" />
            <path d={toLinePath(diaPoints)} fill="none" stroke={COLOR_BP} strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5" />
        </Sparkline>
    );
}

// ── Bar Sparkline (걸음 수) ───────────────────────────────────────────────────
function StepSparkline({ data }) {
    const values = data.map((d) => d.step_count);
    const max = Math.max(...values);
    const chartH = H - PAD_Y * 2;
    const gap = 2;
    const barCount = values.length;
    const barW = (W - PAD_X * 2 - gap * (barCount - 1)) / barCount;

    return (
        <Sparkline ariaLabel="최근 7일 걸음 수 추세">
            {values.map((v, i) => {
                const barH = (v / max) * chartH;
                const x = PAD_X + i * (barW + gap);
                const y = PAD_Y + chartH - barH;
                return (
                    <rect key={i} x={x} y={y} width={barW} height={barH} rx={1.5} fill={COLOR_STEPS} fillOpacity="0.5" />
                );
            })}
        </Sparkline>
    );
}

// ── 공통 SVG 래퍼 ─────────────────────────────────────────────────────────────
function Sparkline({ ariaLabel, children }) {
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className={styles['sparkline']} role="img" aria-label={ariaLabel}>
            {children}
        </svg>
    );
}

// ── 증상 dot (스파크라인 내부 하단) ───────────────────────────────────────────
function SymptomDots({ data, symptomMap, xPositions }) {
    return data.map((d, i) => {
        const severity = symptomMap[toDateKey(d.recorded_at)];
        if (!severity) return null;
        return (
            <circle key={`sym-${i}`} cx={xPositions[i]} cy={H - 1.5} r={1.5} fill={severity >= 4 ? '#FF3B30' : '#8E8E93'} />
        );
    });
}

// ── 날짜 포맷 (아코디언 상세용) ───────────────────────────────────────────────
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatShortDate(isoString) {
    const d = new Date(isoString);
    return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
}

// ── 인사이트 생성 (우선순위 규칙 기반) ─────────────────────────────────────────
function generateInsight(last7, vitals, symptomMap) {
    if (last7.length === 0) return null;

    const sleepValues = last7.map((d) => d.sleep_hours);
    const avgSleep = sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length;
    const hrValues = last7.map((d) => d.heart_rate_bpm);
    const avgHr = hrValues.reduce((a, b) => a + b, 0) / hrValues.length;

    // 우선순위 1: 수면 부족일에 증상 발생 비율 ≥ 50%
    const lowSleepDays = last7.filter((d) => d.sleep_hours < 6);
    const symptomOnLowSleep = lowSleepDays.filter((d) => symptomMap[toDateKey(d.recorded_at)]);
    if (lowSleepDays.length >= 2 && symptomOnLowSleep.length / lowSleepDays.length >= 0.5) {
        return '수면이 부족한 날에 증상이 더 자주 나타나고 있어요.';
    }

    // 우선순위 2: 7일 평균 수면 < 6h
    if (avgSleep < 6) {
        return `이번 주 평균 수면이 ${avgSleep.toFixed(1)}시간이에요. 충분한 수면이 컨디션 관리에 도움이 됩니다.`;
    }

    // 우선순위 3: 오늘 심박수 > 7일 평균 + 10
    if (vitals.heart_rate_bpm > avgHr + 10) {
        return '오늘 심박수가 평소보다 높아요. 컨디션을 살펴보세요.';
    }

    // 우선순위 4: 오늘 혈압 높음
    if (vitals.bp_systolic >= 130 || vitals.bp_diastolic >= 85) {
        return '오늘 혈압이 다소 높아요. 편안히 쉬어보세요.';
    }

    // 우선순위 5: 7일 평균 수면 < 7h
    if (avgSleep < 7) {
        return '이번 주 수면이 권장량보다 조금 부족해요.';
    }

    // 우선순위 6: 정상
    return '이번 주 건강 수치가 안정적이에요.';
}

export default function VitalsToday({ vitals, wearableDevice, wearableHistory, symptomRecords }) {
    const { heart_rate_bpm, bp_systolic, bp_diastolic, sleep_hours, step_count } = vitals;

    const sourceLabel =
        wearableDevice === 'apple'
            ? '출처: Apple Health'
            : wearableDevice === 'galaxy'
              ? '출처: Samsung Health'
              : '출처: 건강 데이터';

    const last7 = getLast7Days(wearableHistory);
    const dateKeys = last7.map((d) => toDateKey(d.recorded_at));
    const symptomMap = buildSymptomMap(symptomRecords, dateKeys);
    const hasChart = last7.length >= 2;
    const insight = hasChart ? generateInsight(last7, vitals, symptomMap) : null;

    // 역순 정렬된 7일 데이터 (최신 먼저)
    const last7Desc = last7.slice().reverse();

    const rows = [
        {
            key: 'heartRate',
            icon: <HeartIcon size={16} color={COLOR_HEART} className={styles['row-icon']} />,
            label: '심박수',
            value: `${heart_rate_bpm ?? '—'} bpm`,
            chart: hasChart ? <HeartRateSparkline data={last7} symptomMap={symptomMap} /> : null,
            details: last7Desc.map((d) => ({ date: formatShortDate(d.recorded_at), value: `${d.heart_rate_bpm} bpm` })),
        },
        {
            key: 'sleep',
            icon: <SleepIcon size={16} color={COLOR_SLEEP} className={styles['row-icon']} />,
            label: '수면',
            value: `${sleep_hours ?? '—'}시간`,
            chart: hasChart ? <SleepSparkline data={last7} symptomMap={symptomMap} /> : null,
            details: last7Desc.map((d) => ({ date: formatShortDate(d.recorded_at), value: `${d.sleep_hours}시간` })),
        },
        {
            key: 'bp',
            icon: <BpIcon size={16} color={COLOR_BP} className={styles['row-icon']} />,
            label: '혈압',
            value: `${bp_systolic ?? '—'}/${bp_diastolic ?? '—'}`,
            chart: hasChart ? <BpSparkline data={last7} /> : null,
            details: last7Desc.map((d) => ({ date: formatShortDate(d.recorded_at), value: `${d.bp_systolic}/${d.bp_diastolic}` })),
        },
        {
            key: 'steps',
            icon: <WalkingIcon size={16} color={COLOR_STEPS} className={styles['row-icon']} />,
            label: '걸음 수',
            value: `${step_count?.toLocaleString('ko-KR') ?? '—'}보`,
            chart: hasChart ? <StepSparkline data={last7} /> : null,
            details: last7Desc.map((d) => ({ date: formatShortDate(d.recorded_at), value: `${d.step_count.toLocaleString('ko-KR')}보` })),
        },
    ];

    const [expandedKey, setExpandedKey] = useState(null);

    function toggleRow(key) {
        setExpandedKey((prev) => (prev === key ? null : key));
    }

    return (
        <section className="home-section" aria-labelledby="vitals-title">
            <h2 id="vitals-title" className="home-section-title">
                오늘의 건강
            </h2>
            <div className={`home-card ${styles.card}`}>
                {insight && <p className={styles['insight']}>{insight}</p>}
                <ul className={styles['list']}>
                    {rows.map(({ key, icon, label, value, chart, details }) => {
                        const isExpanded = expandedKey === key;

                        // hasChart가 false면 클릭 불가
                        if (!hasChart) {
                            return (
                                <li key={key}>
                                    <div className={styles['row']}>
                                        {icon}
                                        <span className={styles['label']}>{label}</span>
                                        <span className={styles['value']}>{value}</span>
                                    </div>
                                </li>
                            );
                        }

                        return (
                            <li key={key}>
                                <button
                                    type="button"
                                    className={styles['row']}
                                    onClick={() => toggleRow(key)}
                                    aria-expanded={isExpanded}
                                >
                                    {icon}
                                    <span className={styles['label']}>{label}</span>
                                    {chart && <div className={styles['chart-cell']}>{chart}</div>}
                                    <span className={styles['value']}>{value}</span>
                                    <ArrowIcon
                                        variant={isExpanded ? 'up' : 'down'}
                                        size={12}
                                        className={styles['chevron']}
                                    />
                                </button>
                                <div className={styles['detail-wrapper']} data-expanded={isExpanded}>
                                    <div className={styles['detail-panel']}>
                                        <ul className={styles['detail-list']}>
                                            {details.map((item) => (
                                                <li key={item.date} className={styles['detail-item']}>
                                                    <span className={styles['detail-date']}>{item.date}</span>
                                                    <span className={styles['detail-value']}>{item.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <p className={styles['source']}>{sourceLabel}</p>
            </div>
        </section>
    );
}
