'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import NrsChart from '../NrsChart/NrsChart';
import SleepChart from '../SleepChart/SleepChart';
import HrChart from '../HrChart/HrChart';
import BpChart from '../BpChart/BpChart';
import { ArrowIcon } from '../../../../_components/icons';
import { TREND_POSITIVE, TREND_NEGATIVE, TREND_FLAT } from '../_lib/chartColors';
import styles from './ChartGrid.module.scss';

const END_DATE = '2026-02-17';

// 카테고리 칩 ID → JSON category 코드 매핑
const CATEGORY_CODE = {
    general: 'SYM-01',
    musculoskeletal: 'SYM-02',
    neurological: 'SYM-03',
    digestive: 'SYM-05',
    respiratory: 'SYM-07',
    psychological: 'SYM-08',
    dermatological: 'SYM-09',
    autonomic: 'SYM-12',
};

// 기간 선택 → 도메인 시작일
const PERIOD_FROM = {
    '1day': '2026-02-17',
    '1week': '2026-02-11',
    '1month': '2026-01-18',
    '6months': '2025-08-17',
    '1year': '2025-02-17',
};

function generateDomain(from, to) {
    const dates = [];
    const current = new Date(from + 'T00:00:00');
    const end = new Date(to + 'T00:00:00');
    while (current <= end) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

function getFilteredDomain(activePeriod, customRange) {
    if (activePeriod === 'custom' && customRange?.startDate && customRange?.endDate) {
        return generateDomain(customRange.startDate, customRange.endDate);
    }
    const from = PERIOD_FROM[activePeriod] ?? '2025-02-17';
    return generateDomain(from, END_DATE);
}

// X축 틱 로직: 기간 길이에 따라 다른 전략
function getXTicks(domain) {
    if (domain.length <= 7) return domain;
    if (domain.length <= 31) {
        // 1개월 이하: 5개 균등 분할
        const step = Math.floor((domain.length - 1) / 4);
        const indices = [0, step, 2 * step, 3 * step, domain.length - 1];
        return [...new Set(indices)].map((i) => domain[i]);
    }
    // 6개월/1년: 월 첫째 날 기준, 1년이면 격월
    const monthStep = domain.length > 180 ? 2 : 1;
    const ticks = [];
    let lastMonth = -1;
    let monthCount = 0;
    for (const d of domain) {
        const m = parseInt(d.split('-')[1]);
        if (m !== lastMonth) {
            monthCount++;
            if (monthCount % monthStep === 1 || monthStep === 1) {
                ticks.push(d);
            }
            lastMonth = m;
        }
    }
    return ticks;
}

// 기간에 따른 날짜 포맷터 생성
function getDateFormatter(activePeriod) {
    if (activePeriod === '1year' || activePeriod === '6months') {
        // "25.8" 또는 "26.2" — 연도 약식 + 월
        return (d) => {
            const [y, m] = d.split('-');
            return `${y.slice(2)}.${parseInt(m)}`;
        };
    }
    // 1day, 1week, 1month
    return (d) => {
        const [, m, day] = d.split('-');
        return `${parseInt(m)}/${parseInt(day)}`;
    };
}

function buildNrsData(symptoms, domain, activeCategory) {
    const map = {};
    symptoms.data.forEach((item) => {
        map[item.date] = item;
    });
    const filterCode = CATEGORY_CODE[activeCategory]; // 'all'이면 undefined

    // 카테고리 빈도 계산 (tooltip용)
    const categoryCount = {};
    const domainSet = new Set(domain);
    symptoms.data.forEach((item) => {
        if (!domainSet.has(item.date)) return;
        if (activeCategory !== 'all' && item.category !== filterCode) return;
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    let prevSeverity = null;
    return domain.map((date) => {
        const item = map[date];
        const show = item && (activeCategory === 'all' || item.category === filterCode);
        const severity = show ? item.severity : null;

        // 이전 기록 대비 변화량
        const prevDelta = severity != null && prevSeverity != null
            ? severity - prevSeverity
            : null;
        if (severity != null) prevSeverity = severity;

        return {
            date,
            severity,
            category: show ? item.category : null,
            label: show ? item.label : null,
            prevDelta,
            categoryFreq: show ? categoryCount[item.category] : null,
        };
    });
}

function buildSleepData(sleep, domain, symptomDaySet) {
    const map = {};
    (sleep.data || sleep.data_7day).forEach((item) => {
        map[item.date] = item;
    });

    const RECOMMENDED_MIN = 7;
    const result = [];
    for (let i = 0; i < domain.length; i++) {
        const date = domain[i];
        const hours = map[date]?.hours ?? null;
        const outlier = map[date]?.outlier_flag ?? false;

        // 권장 수면 대비 부족분
        const recommendedDelta = hours != null ? +(hours - RECOMMENDED_MIN).toFixed(1) : null;

        // 최근 7일 평균 (현재 포함, 유효 데이터만)
        let recentAvg = null;
        if (hours != null) {
            const recent = [];
            for (let j = Math.max(0, i - 6); j <= i; j++) {
                const h = result[j]?.hours ?? (j === i ? hours : null);
                if (h != null) recent.push(h);
            }
            if (recent.length >= 2) {
                recentAvg = +(recent.reduce((s, v) => s + v, 0) / recent.length).toFixed(1);
            }
        }

        result.push({ date, hours, outlier, recommendedDelta, recentAvg, isSymptomDay: symptomDaySet.has(date) });
    }
    return result;
}

function buildHrData(heartRate, domain, symptomDaySet) {
    const map = {};
    heartRate.data.forEach((item) => {
        map[item.date] = item;
    });
    return domain.map((date) => {
        const entry = map[date];
        const median = entry?.median ?? null;
        return {
            date,
            min: entry?.min ?? null,
            q1: entry?.q1 ?? null,
            median,
            q3: entry?.q3 ?? null,
            max: entry?.max ?? null,
            boxSpan: entry?.q3 != null ? entry.q3 - entry.q1 : null,
            // tooltip용: 정상 범위(60-100) 판정
            inNormalRange: median != null ? median >= 60 && median <= 100 : null,
            isSymptomDay: symptomDaySet.has(date),
        };
    });
}

// 혈압 분류 (KSH 2018 기준)
function classifyBp(systolic, diastolic) {
    if (systolic == null || diastolic == null) return null;
    if (systolic >= 180 || diastolic >= 120) return '고혈압 위기';
    if (systolic >= 160 || diastolic >= 100) return '고혈압 2기';
    if (systolic >= 140 || diastolic >= 90) return '고혈압 1기';
    if (systolic >= 130 || diastolic >= 85) return '주의';
    if (systolic >= 120 || diastolic >= 80) return '높은 정상';
    return '정상';
}

function buildBpData(bp, domain, symptomDaySet) {
    const map = {};
    (bp.data || bp.data_7day).forEach((item) => {
        map[item.date] = item;
    });
    return domain.map((date) => {
        const entry = map[date];
        const systolic = entry?.systolic ?? null;
        const diastolic = entry?.diastolic ?? null;
        return {
            date,
            systolic,
            diastolic,
            outlier: entry?.outlier_flag ?? false,
            base: diastolic,
            band: entry ? systolic - diastolic : null,
            // tooltip용
            bpClass: classifyBp(systolic, diastolic),
            pulsePressure: systolic != null ? systolic - diastolic : null,
            isSymptomDay: symptomDaySet.has(date),
        };
    });
}

// 선형 회귀 기반 추세 계산
// values: null 제외 숫자 배열, threshold: 정규화된 기울기 임계값
function calcTrend(values, threshold = 0.01) {
    const valid = values.filter((v) => v != null);
    if (valid.length < 3) return { direction: 'insufficient', slope: 0 };

    const n = valid.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += valid[i];
        sumXY += i * valid[i];
        sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    // 값 범위 대비 정규화
    const range = Math.max(...valid) - Math.min(...valid);
    const normalizedSlope = range > 0 ? slope / range : 0;

    if (normalizedSlope > threshold) return { direction: 'up', slope };
    if (normalizedSlope < -threshold) return { direction: 'down', slope };
    return { direction: 'flat', slope };
}

// 추세 방향 → 색상·아이콘·텍스트 (차트마다 의미가 다름)
// higherIsWorse: NRS/심박/혈압은 상승=부정적, 수면은 상승=긍정적
function getTrendDisplay(trend, higherIsWorse) {
    if (trend.direction === 'insufficient') {
        return { text: '데이터 부족', color: TREND_FLAT };
    }
    if (trend.direction === 'flat') {
        return { text: '변화 없음', color: TREND_FLAT };
    }
    const isUp = trend.direction === 'up';
    const isNegative = higherIsWorse ? isUp : !isUp;
    return {
        icon: isUp ? '↑' : '↓',
        text: isUp ? '상승' : '하락',
        color: isNegative ? TREND_NEGATIVE : TREND_POSITIVE,
    };
}

// 날짜 범위 포맷: "2025년 8월 17일 ~ 2026년 2월 17일"
function formatDateRange(domain) {
    if (!domain.length) return '';
    const fmt = (d) => {
        const [y, m, day] = d.split('-');
        return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
    };
    return `${fmt(domain[0])} ~ ${fmt(domain[domain.length - 1])}`;
}

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

const WINDOW_SIZE = 30; // 뷰포트 크기 (일수)

// 네비게이션 범위 텍스트: "2025.10 ~ 2025.12"
function formatNavRange(startDate, endDate) {
    const fmt = (d) => {
        const [y, m] = d.split('-');
        return `${y}.${parseInt(m)}`;
    };
    return `${fmt(startDate)} ~ ${fmt(endDate)}`;
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
    // 슬라이드 시 윈도우는 ~30일 → m/d 포맷, 전체 표시 시 activePeriod 기준
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
                <nav
                    className={styles.nav}
                    aria-label="차트 기간 탐색"
                >
                    <button
                        className={styles['nav-btn']}
                        onClick={goLeft}
                        disabled={!canPrev}
                        aria-label="이전 기간"
                    >
                        <ArrowIcon variant="left" size={16} />
                    </button>
                    <span className={styles['nav-range']}>
                        {formatNavRange(viewDomain[0], viewDomain[viewDomain.length - 1])}
                    </span>
                    <button
                        className={styles['nav-btn']}
                        onClick={goRight}
                        disabled={!canNext}
                        aria-label="다음 기간"
                    >
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
                    <NrsChart
                        data={nrsData}
                        symptomDays={symptomDays}
                        xTicks={xTicks}
                        dateFormatter={dateFormatter}
                    />
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
                    <SleepChart
                        data={sleepData}
                        averageHours={avgHours}
                        symptomDays={symptomDays}
                        xTicks={xTicks}
                        dateFormatter={dateFormatter}
                    />
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
                    <HrChart
                        data={hrData}
                        symptomDays={symptomDays}
                        xTicks={xTicks}
                        dateFormatter={dateFormatter}
                    />
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
                    <BpChart
                        data={bpData}
                        symptomDays={symptomDays}
                        xTicks={xTicks}
                        dateFormatter={dateFormatter}
                    />
                </div>
            </div>
        </>
    );
}
