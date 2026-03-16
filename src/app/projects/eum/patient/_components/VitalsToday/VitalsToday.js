'use client';

import { useState } from 'react';
import ArrowIcon from '../../../_components/icons/ArrowIcon';
import BpIcon from '../../../_components/icons/BpIcon';
import HeartIcon from '../../../_components/icons/HeartIcon';
import SleepIcon from '../../../_components/icons/SleepIcon';
import WalkingIcon from '../../../_components/icons/WalkingIcon';
import { WEEKDAYS } from '../../_lib/constants';
import { toDateKey, getLast7Days, buildSymptomMap, generateInsight } from '../../_lib/vitalsData';
import {
    COLOR_HEART, COLOR_SLEEP, COLOR_BP, COLOR_STEPS,
    HeartRateSparkline, SleepSparkline, BpSparkline, StepSparkline,
} from './Sparklines';
import styles from './VitalsToday.module.scss';

// ── 날짜 포맷 (아코디언 상세용) ───────────────────────────────────────────────
function formatShortDate(isoString) {
    const d = new Date(isoString);
    return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
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
            details: last7Desc.map((d) => ({
                date: formatShortDate(d.recorded_at),
                value: `${d.heart_rate_bpm} bpm`,
                flagged: d.heart_rate_bpm >= 90,
            })),
        },
        {
            key: 'sleep',
            icon: <SleepIcon size={16} color={COLOR_SLEEP} className={styles['row-icon']} />,
            label: '수면',
            value: `${sleep_hours ?? '—'}시간`,
            chart: hasChart ? <SleepSparkline data={last7} symptomMap={symptomMap} /> : null,
            details: last7Desc.map((d) => ({
                date: formatShortDate(d.recorded_at),
                value: `${d.sleep_hours}시간`,
                flagged: d.sleep_hours < 5,
            })),
        },
        {
            key: 'bp',
            icon: <BpIcon size={16} color={COLOR_BP} className={styles['row-icon']} />,
            label: '혈압',
            value: `${bp_systolic ?? '—'}/${bp_diastolic ?? '—'}`,
            chart: hasChart ? <BpSparkline data={last7} /> : null,
            details: last7Desc.map((d) => ({
                date: formatShortDate(d.recorded_at),
                value: `${d.bp_systolic}/${d.bp_diastolic}`,
                flagged: d.bp_systolic >= 130 || d.bp_diastolic >= 85,
            })),
        },
        {
            key: 'steps',
            icon: <WalkingIcon size={16} color={COLOR_STEPS} className={styles['row-icon']} />,
            label: '걸음 수',
            value: `${step_count?.toLocaleString('ko-KR') ?? '—'}보`,
            chart: hasChart ? <StepSparkline data={last7} /> : null,
            details: last7Desc.map((d) => ({
                date: formatShortDate(d.recorded_at),
                value: `${d.step_count.toLocaleString('ko-KR')}보`,
                flagged: false,
            })),
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
                                                    <span
                                                        className={styles['detail-value']}
                                                        data-flagged={item.flagged || undefined}
                                                    >
                                                        {item.value}
                                                    </span>
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
