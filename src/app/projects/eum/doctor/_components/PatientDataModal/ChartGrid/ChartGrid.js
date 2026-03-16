'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import NrsChart from '../NrsChart/NrsChart';
import SleepChart from '../SleepChart/SleepChart';
import HrChart from '../HrChart/HrChart';
import BpChart from '../BpChart/BpChart';
import { ArrowIcon } from '../../../../_components/icons';
import {
    CATEGORY_CODE, WINDOW_SIZE,
    getFilteredDomain, getXTicks, getDateFormatter,
    buildNrsData, buildSleepData, buildHrData, buildBpData,
    calcTrend, getTrendDisplay, formatDateRange, formatNavRange,
} from '../_lib/chartDataBuilders';
import styles from './ChartGrid.module.scss';

// 추세 표시 컴포넌트 — Badge 형태
function TrendBadge({ trend, higherIsWorse }) {
    const { icon, text, color } = getTrendDisplay(trend, higherIsWorse);
    return (
        <span className={styles['card-trend']} style={{ background: `${color}14`, color, borderColor: `${color}40` }}>
            <span aria-hidden="true">{icon}</span>
            {text}
        </span>
    );
}

export default function ChartGrid({ chartData, activePeriod, activeCategory, customRange }) {
    const { symptoms, sleep, heart_rate, blood_pressure } = chartData.tabs;
    const gridRef = useRef(null);

    // ── 전체 도메인 빌드 ──
    const domain = getFilteredDomain(activePeriod, customRange);
    const needsSlide = domain.length > 31;

    // ── 슬라이드 state (최신 데이터=우측 끝 초기값) ──
    const [startIdx, setStartIdx] = useState(() =>
        Math.max(0, domain.length - WINDOW_SIZE)
    );

    // 기간/카테고리/커스텀 범위 변경 시 우측 끝으로 리셋
    const customStart = customRange?.startDate;
    const customEnd = customRange?.endDate;
    useEffect(() => {
        setStartIdx(Math.max(0, domain.length - WINDOW_SIZE));
    }, [activePeriod, activeCategory, domain.length, customStart, customEnd]);

    const endIdx = needsSlide
        ? Math.min(startIdx + WINDOW_SIZE - 1, domain.length - 1)
        : domain.length - 1;
    const viewStartIdx = needsSlide ? startIdx : 0;

    const canPrev = needsSlide && viewStartIdx > 0;
    const canNext = needsSlide && endIdx < domain.length - 1;

    const goLeft = useCallback(() => {
        setStartIdx((prev) => Math.max(0, prev - WINDOW_SIZE));
    }, []);
    const goRight = useCallback(() => {
        setStartIdx((prev) => Math.min(domain.length - WINDOW_SIZE, prev + WINDOW_SIZE));
    }, [domain.length]);

    // 키보드 ← → 지원
    useEffect(() => {
        if (!needsSlide) return;
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goLeft(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goRight(); }
        };
        const el = gridRef.current;
        el?.addEventListener('keydown', handleKey);
        return () => el?.removeEventListener('keydown', handleKey);
    }, [needsSlide, goLeft, goRight]);

    // ── 뷰포트 도메인 슬라이스 ──
    const viewDomain = needsSlide ? domain.slice(viewStartIdx, endIdx + 1) : domain;
    const dateFormatter = getDateFormatter(needsSlide ? '1month' : activePeriod);
    const xTicks = getXTicks(viewDomain);
    const dateRange = formatDateRange(viewDomain);

    // ── 카테고리 필터 적용 후 증상 발생일 목록 ──
    const filterCode = CATEGORY_CODE[activeCategory];
    const viewDomainSet = new Set(viewDomain);
    const symptomDays = symptoms.data
        .filter((d) => activeCategory === 'all' || d.category === filterCode)
        .map((d) => d.date)
        .filter((d) => viewDomainSet.has(d));
    const symptomDaySet = new Set(symptomDays);

    // ── 뷰포트 기준 데이터 빌드 ──
    const nrsData = buildNrsData(symptoms, viewDomain, activeCategory);
    const sleepData = buildSleepData(sleep, viewDomain, symptomDaySet);
    const hrData = buildHrData(heart_rate, viewDomain, symptomDaySet);
    const bpData = buildBpData(blood_pressure, viewDomain, symptomDaySet);

    // ── 평균값 계산 (뷰포트 기준) ──
    const validNrs = nrsData.filter((d) => d.severity != null);
    const avgNrs = validNrs.length
        ? +(validNrs.reduce((s, d) => s + d.severity, 0) / validNrs.length).toFixed(1)
        : null;

    const validSleep = sleepData.filter((d) => d.hours != null);
    const avgHours = validSleep.length
        ? +(validSleep.reduce((s, d) => s + d.hours, 0) / validSleep.length).toFixed(1)
        : null;

    const validHr = hrData.filter((d) => d.median != null);
    const avgMedian = validHr.length
        ? Math.round(validHr.reduce((s, d) => s + d.median, 0) / validHr.length)
        : null;

    const validBp = bpData.filter((d) => d.systolic != null);
    const avgSystolic = validBp.length
        ? Math.round(validBp.reduce((s, d) => s + d.systolic, 0) / validBp.length)
        : null;
    const avgDiastolic = validBp.length
        ? Math.round(validBp.reduce((s, d) => s + d.diastolic, 0) / validBp.length)
        : null;

    // ── 추세 계산 (뷰포트 기준) ──
    const nrsTrend = calcTrend(nrsData.map((d) => d.severity));
    const sleepTrend = calcTrend(sleepData.map((d) => d.hours));
    const hrTrend = calcTrend(hrData.map((d) => d.median));
    const bpTrend = calcTrend(bpData.map((d) => d.systolic));

    return (
        <>
            <div className={styles['subtitle-row']}>
                <p className={styles.subtitle}>환자 증상과 관련 높은 4개 지표</p>
                <div className={styles.legend} aria-label="차트 범례">
                    <div className={styles['legend-item']}>
                        <span className={styles['legend-rect']} aria-hidden="true" />
                        <span>증상 발생일</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-dot']} ${styles['legend-dot--autonomic']}`} aria-hidden="true" />
                        <span>심리/자율</span>
                    </div>
                    <div className={styles['legend-item']}>
                        <span className={`${styles['legend-dot']} ${styles['legend-dot--digestive']}`} aria-hidden="true" />
                        <span>소화기</span>
                    </div>
                </div>
            </div>

            {/* 슬라이드 네비게이션 — 6개월/1년에서만 표시 */}
            {needsSlide && (
                <nav className={styles.nav} aria-label="차트 기간 탐색">
                    <button className={styles['nav-btn']} onClick={goLeft} disabled={!canPrev} aria-label="이전 기간">
                        <ArrowIcon variant="left" size={16} />
                    </button>
                    <span className={styles['nav-range']}>
                        {formatNavRange(viewDomain[0], viewDomain[viewDomain.length - 1])}
                    </span>
                    <button className={styles['nav-btn']} onClick={goRight} disabled={!canNext} aria-label="다음 기간">
                        <ArrowIcon variant="right" size={16} />
                    </button>
                </nav>
            )}

            <div
                className={styles.grid}
                ref={gridRef}
                tabIndex={needsSlide ? 0 : undefined}
                aria-label={needsSlide ? '차트 영역 — 좌우 화살표로 기간 이동' : undefined}
            >
                <div className={styles.card}>
                    <div className={styles['card-header']}>
                        <p className={styles['card-title']}>증상 강도 (NRS)</p>
                        <div className={styles['card-summary']}>
                            <span className={styles['card-avg']}>
                                {avgNrs != null ? `평균 NRS ${avgNrs}` : '데이터 없음'}
                            </span>
                            <TrendBadge trend={nrsTrend} higherIsWorse={true} />
                        </div>
                        <p className={styles['card-date-range']}>{dateRange}</p>
                    </div>
                    <NrsChart data={nrsData} symptomDays={symptomDays} xTicks={xTicks} dateFormatter={dateFormatter} />
                </div>

                <div className={styles.card}>
                    <div className={styles['card-header']}>
                        <p className={styles['card-title']}>수면시간</p>
                        <div className={styles['card-summary']}>
                            <span className={styles['card-avg']}>
                                {avgHours != null ? `일일 평균 ${avgHours}시간` : '데이터 없음'}
                            </span>
                            <TrendBadge trend={sleepTrend} higherIsWorse={false} />
                        </div>
                        <p className={styles['card-date-range']}>{dateRange}</p>
                    </div>
                    <SleepChart data={sleepData} averageHours={avgHours} symptomDays={symptomDays} xTicks={xTicks} dateFormatter={dateFormatter} />
                </div>

                <div className={styles.card}>
                    <div className={styles['card-header']}>
                        <p className={styles['card-title']}>심박수 (bpm)</p>
                        <div className={styles['card-summary']}>
                            <span className={styles['card-avg']}>
                                {avgMedian != null ? `평균 중앙값 ${avgMedian} bpm` : '데이터 없음'}
                            </span>
                            <TrendBadge trend={hrTrend} higherIsWorse={true} />
                        </div>
                        <p className={styles['card-date-range']}>{dateRange}</p>
                    </div>
                    <HrChart data={hrData} symptomDays={symptomDays} xTicks={xTicks} dateFormatter={dateFormatter} />
                </div>

                <div className={styles.card}>
                    <div className={styles['card-header']}>
                        <p className={styles['card-title']}>혈압 (mmHg)</p>
                        <div className={styles['card-summary']}>
                            <span className={styles['card-avg']}>
                                {avgSystolic != null
                                    ? `평균 ${avgSystolic}/${avgDiastolic} mmHg`
                                    : '데이터 없음'}
                            </span>
                            <TrendBadge trend={bpTrend} higherIsWorse={true} />
                        </div>
                        <p className={styles['card-date-range']}>{dateRange}</p>
                    </div>
                    <BpChart data={bpData} symptomDays={symptomDays} xTicks={xTicks} dateFormatter={dateFormatter} />
                </div>
            </div>
        </>
    );
}
