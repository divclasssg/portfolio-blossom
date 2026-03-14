'use client';

import { useState } from 'react';
import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';
import styles from './Timeline.module.scss';
import { AiIcon } from '../../../_components/icons';

const SEVERITY_LABEL = { 1: '낮음', 2: '중간', 3: '높음', 4: '심함' };

const CATEGORY_LABEL = {
    'SYM-05': 'Gastrointestinal Symptoms',
    'SYM-07': 'Respiratory Symptoms',
    'SYM-12': 'Cardiovascular / Autonomic',
};

// 웨어러블 평균 대비 트렌드 화살표
function getTrend(value, average) {
    if (value > average * 1.05) return { arrow: '↑', color: '#ef4444' };
    if (value < average * 0.95) return { arrow: '↓', color: '#3b82f6' };
    return { arrow: '→', color: '#9ca3af' };
}

// healthPlatform 배열에서 특정 날짜(MM-DD) 레코드 찾기
function findHealthRecord(date, healthPlatform) {
    if (!healthPlatform?.length) return null;
    const target = `2026-${date}`;
    return healthPlatform.find((h) => h.recorded_at.startsWith(target)) ?? null;
}

// 증상 타임라인 — 날짜 | 증상명 | NRS | 펼침 토글 + 건강 서브행
export default function Timeline({ timeline, expandedTimeline, healthPlatform }) {
    const { items: compactItems, remaining_count } = timeline;
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    const { open: openModal } = usePatientDataModal();

    // 표시할 항목: compact만 또는 compact + expanded (날짜 역순)
    const visibleItems = showAll
        ? [...compactItems, ...(expandedTimeline?.items ?? [])].sort((a, b) =>
              b.date.localeCompare(a.date)
          )
        : compactItems;

    // 평균 HR, Sleep 계산
    const avgHr = healthPlatform?.length
        ? Math.round(
              healthPlatform.reduce((s, h) => s + h.heart_rate_bpm, 0) / healthPlatform.length
          )
        : 80;
    const avgSleep = healthPlatform?.length
        ? (healthPlatform.reduce((s, h) => s + h.sleep_hours, 0) / healthPlatform.length).toFixed(1)
        : 5.5;

    function toggleItem(key) {
        setExpandedItems((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <div className={styles['section-header']}>
                    <AiIcon size={24} />
                    <h2 className={styles['section-title']}>Timeline</h2>
                </div>

                <ul className={styles.items} aria-label="최근 증상 기록">
                    {visibleItems.map((item) => {
                        const itemKey = `${item.date}-${item.category}`;
                        const health = findHealthRecord(item.date, healthPlatform);
                        const hasHealth = !!health;
                        const isExpanded = expandedItems.has(itemKey);
                        const healthId = `health-${itemKey}`;

                        const hrTrend = health ? getTrend(health.heart_rate_bpm, avgHr) : null;
                        const sleepTrend = health
                            ? getTrend(health.sleep_hours, parseFloat(avgSleep))
                            : null;

                        // 날짜 포맷: "03-08" → "2026. 03. 08"
                        const [month, day] = item.date.split('-');
                        const dateLabel = `2026. ${month}. ${day}`;

                        return (
                            <li key={itemKey} className={styles.item}>
                                {/* 주 행: 날짜 | 증상명 | NRS | ∧/V */}
                                {hasHealth ? (
                                    <button
                                        className={styles['item-main']}
                                        onClick={() => toggleItem(itemKey)}
                                        aria-expanded={isExpanded}
                                        aria-controls={healthId}
                                    >
                                        <span className={styles['item-date']}>{dateLabel}</span>
                                        <span className={styles['item-name']} title={item.preview}>
                                            {CATEGORY_LABEL[item.category] ?? item.preview}
                                        </span>
                                        <span
                                            className={styles['nrs-label']}
                                            aria-label={`NRS ${item.severity} (${SEVERITY_LABEL[item.severity]})`}
                                        >
                                            NRS {item.severity}
                                        </span>
                                        <span className={styles['expand-icon']} aria-hidden="true">
                                            {isExpanded ? '∧' : 'V'}
                                        </span>
                                    </button>
                                ) : (
                                    <div className={styles['item-main']}>
                                        <span className={styles['item-date']}>{dateLabel}</span>
                                        <span className={styles['item-name']} title={item.preview}>
                                            {CATEGORY_LABEL[item.category] ?? item.preview}
                                        </span>
                                        <span
                                            className={styles['nrs-label']}
                                            aria-label={`NRS ${item.severity} (${SEVERITY_LABEL[item.severity]})`}
                                        >
                                            NRS {item.severity}
                                        </span>
                                    </div>
                                )}

                                {/* 건강 서브 행 (웨어러블 데이터 있는 경우, expanded일 때만) */}
                                {hasHealth && isExpanded && (
                                    <div className={styles['item-health']} id={healthId}>
                                        <span className={styles['health-stat']}>
                                            HR {health.heart_rate_bpm}bpm
                                            <span
                                                className={styles['health-trend']}
                                                style={{ color: hrTrend.color }}
                                                aria-label={
                                                    hrTrend.arrow === '↑'
                                                        ? '평균 대비 높음'
                                                        : hrTrend.arrow === '↓'
                                                          ? '평균 대비 낮음'
                                                          : '평균'
                                                }
                                            >
                                                {hrTrend.arrow}
                                            </span>
                                        </span>
                                        <span
                                            className={styles['health-divider']}
                                            aria-hidden="true"
                                        />
                                        <span className={styles['health-stat']}>
                                            Sleep {health.sleep_hours}h
                                            <span
                                                className={styles['health-trend']}
                                                style={{ color: sleepTrend.color }}
                                                aria-label={
                                                    sleepTrend.arrow === '↑'
                                                        ? '평균 대비 많음'
                                                        : sleepTrend.arrow === '↓'
                                                          ? '평균 대비 적음'
                                                          : '평균'
                                                }
                                            >
                                                {sleepTrend.arrow}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <button
                    className={styles['more-btn']}
                    onClick={() => setShowAll((prev) => !prev)}
                    aria-label={
                        showAll ? '증상 기록 접기' : `증상 기록 ${remaining_count}건 더 보기`
                    }
                >
                    {showAll ? '접기' : '더보기'}
                </button>

                <button
                    className={styles['data-btn']}
                    onClick={openModal}
                    aria-label="환자 데이터 상세 보기 — 증상 타임라인 차트 열기"
                >
                    데이터 보기
                </button>
            </div>
        </section>
    );
}
