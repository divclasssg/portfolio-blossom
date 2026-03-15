'use client';

import { useState, useRef, useCallback } from 'react';
import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';
import styles from './Timeline.module.scss';
import { AiIcon, ArrowIcon } from '../../../_components/icons';
import ActionButton from '../ActionButton/ActionButton';
import Badge from '../Badge/Badge';

const SEVERITY_LABEL = { 1: '낮음', 2: '중간', 3: '높음', 4: '심함' };

// NRS 심각도별 색상 매핑
function getNrsColor(severity) {
    if (severity <= 3) return '#34C759';   // clinical.normal (초록)
    if (severity <= 6) return '#FF9500';   // clinical.warning (주황)
    return '#FF3B30';                       // clinical.danger (빨강)
}

const CATEGORY_LABEL = {
    'SYM-01': 'General / Constitutional',
    'SYM-02': 'Musculoskeletal',
    'SYM-03': 'Neurological',
    'SYM-05': 'Gastrointestinal',
    'SYM-07': 'Respiratory',
    'SYM-08': 'Psychological',
    'SYM-09': 'Dermatological',
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
    // MM-DD 접미사로 매칭 — 연도 하드코딩 제거
    return healthPlatform.find((h) => h.recorded_at.slice(5, 10) === date) ?? null;
}

// 증상 타임라인 — 날짜 | 증상명 | NRS | 펼침 토글 + 건강 서브행
export default function Timeline({ timeline, expandedTimeline, healthPlatform }) {
    const { items: compactItems, remaining_count } = timeline;
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [showAll, setShowAll] = useState(false);
    const { open: openModal } = usePatientDataModal();
    const expandRef = useRef(null);
    const btnRef = useRef(null);

    // 전체 항목 (날짜 역순) — 항상 계산해서 DOM에 유지
    const allItems = [...compactItems, ...(expandedTimeline?.items ?? [])].sort((a, b) =>
        b.date.localeCompare(a.date)
    );
    // compact에 포함된 항목의 key Set
    const compactKeys = new Set(compactItems.map((i) => `${i.date}-${i.category}`));
    // expanded 전용 항목만 추출 (애니메이션 대상)
    const expandedOnly = allItems.filter((i) => !compactKeys.has(`${i.date}-${i.category}`));

    const handleToggle = useCallback(() => {
        const next = !showAll;
        setShowAll(next);

        if (next) {
            // 열림: 버튼이 보이도록 스크롤
            requestAnimationFrame(() => {
                btnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }
    }, [showAll]);

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

    function renderItem(item) {
        const itemKey = `${item.date}-${item.category}`;
        const health = findHealthRecord(item.date, healthPlatform);
        const hasHealth = !!health;
        const isExpanded = expandedItems.has(itemKey);
        const healthId = `health-${itemKey}`;

        const hrTrend = health ? getTrend(health.heart_rate_bpm, avgHr) : null;
        const sleepTrend = health
            ? getTrend(health.sleep_hours, parseFloat(avgSleep))
            : null;

        const [month, day] = item.date.split('-');
        const matchedRecord = findHealthRecord(item.date, healthPlatform);
        const year = matchedRecord
            ? matchedRecord.recorded_at.slice(0, 4)
            : new Date().getFullYear();
        const dateLabel = `${year}. ${month}. ${day}`;

        return (
            <li key={itemKey} className={styles.item}>
                {hasHealth ? (
                    <button
                        className={styles['item-main']}
                        onClick={() => toggleItem(itemKey)}
                        aria-expanded={isExpanded}
                        aria-controls={healthId}
                    >
                        <time className={styles['item-date']} dateTime={`${year}-${month}-${day}`}>{dateLabel}</time>
                        <span className={styles['item-name']} title={item.preview}>
                            {CATEGORY_LABEL[item.category] ?? item.preview}
                        </span>
                        <Badge
                            className={styles['nrs-badge']}
                            style={{ background: `${getNrsColor(item.severity)}14`, color: getNrsColor(item.severity), borderColor: `${getNrsColor(item.severity)}30` }}
                            aria-label={`NRS ${item.severity} (${SEVERITY_LABEL[item.severity]})`}
                        >
                            NRS {item.severity}
                        </Badge>
                        <span className={styles['expand-icon']} aria-hidden="true">
                            <ArrowIcon variant={isExpanded ? 'up' : 'down'} size={12} color="currentColor" />
                        </span>
                    </button>
                ) : (
                    <button className={styles['item-main']} disabled aria-disabled="true">
                        <time className={styles['item-date']} dateTime={`${year}-${month}-${day}`}>{dateLabel}</time>
                        <span className={styles['item-name']} title={item.preview}>
                            {CATEGORY_LABEL[item.category] ?? item.preview}
                        </span>
                        <Badge
                            className={styles['nrs-badge']}
                            style={{ background: `${getNrsColor(item.severity)}14`, color: getNrsColor(item.severity), borderColor: `${getNrsColor(item.severity)}30` }}
                            aria-label={`NRS ${item.severity} (${SEVERITY_LABEL[item.severity]})`}
                        >
                            NRS {item.severity}
                        </Badge>
                        <span className={styles['expand-icon']} aria-hidden="true" />
                    </button>
                )}

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
    }

    return (
        <section className={`section ${styles.section}`}>
            <div className="section-content">
                <div className={`section-header ${styles['section-header']}`}>
                    <AiIcon size={24} />
                    <h2 className={`section-title ${styles['section-title']}`}>Timeline</h2>
                    <ActionButton
                        variant="text"
                        aria-label="환자 데이터 상세 보기 — 증상 타임라인 차트 열기"
                        onClick={openModal}
                    >
                        데이터보기
                    </ActionButton>
                </div>

                <ul className={styles.items} aria-label="최근 증상 기록">
                    {compactItems.map((item) => renderItem(item))}
                </ul>

                {/* 확장 영역 — 높이 애니메이션 */}
                <div
                    ref={expandRef}
                    className={`${styles['expand-area']} ${showAll ? styles['expand-area--open'] : ''}`}
                >
                    <ul className={styles.items} aria-label="추가 증상 기록">
                        {expandedOnly.map((item) => renderItem(item))}
                    </ul>
                </div>

                <ActionButton
                    ref={btnRef}
                    className={`${styles['more-btn']} ${showAll ? styles['more-btn--open'] : ''}`}
                    onClick={handleToggle}
                    aria-label={
                        showAll ? '증상 기록 접기' : `증상 기록 ${remaining_count}건 더 보기`
                    }
                >
                    {showAll ? '접기' : '더보기'}
                </ActionButton>
            </div>
        </section>
    );
}
