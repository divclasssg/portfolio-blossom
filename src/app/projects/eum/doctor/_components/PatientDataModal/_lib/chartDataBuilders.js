import { TREND_POSITIVE, TREND_NEGATIVE, TREND_FLAT } from './chartColors';
import { shiftDates } from '../../../../_lib/dateShift';

// shiftDates로 기준일 시프트 — 원본 END_DATE를 오늘 기준으로 이동
const shifted = shiftDates({ date: '2026-02-17' });
export const END_DATE = shifted.date;

// 카테고리 칩 ID → JSON category 코드 매핑
export const CATEGORY_CODE = {
    general: 'SYM-01',
    musculoskeletal: 'SYM-02',
    neurological: 'SYM-03',
    digestive: 'SYM-05',
    respiratory: 'SYM-07',
    psychological: 'SYM-08',
    dermatological: 'SYM-09',
    autonomic: 'SYM-12',
};

// 기간 선택 → 도메인 시작일 (shiftDates로 동적 계산)
export const PERIOD_FROM = shiftDates({
    '1day': '2026-02-17',
    '1week': '2026-02-11',
    '1month': '2026-01-18',
    '6months': '2025-08-17',
    '1year': '2025-02-17',
});

export const WINDOW_SIZE = 30;

export function generateDomain(from, to) {
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

export function getFilteredDomain(activePeriod, customRange) {
    if (activePeriod === 'custom' && customRange?.startDate && customRange?.endDate) {
        return generateDomain(customRange.startDate, customRange.endDate);
    }
    const from = PERIOD_FROM[activePeriod] ?? '2025-02-17';
    return generateDomain(from, END_DATE);
}

// X축 틱 로직: 기간 길이에 따라 다른 전략
export function getXTicks(domain) {
    if (domain.length <= 7) return domain;
    if (domain.length <= 31) {
        const step = Math.floor((domain.length - 1) / 4);
        const indices = [0, step, 2 * step, 3 * step, domain.length - 1];
        return [...new Set(indices)].map((i) => domain[i]);
    }
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
export function getDateFormatter(activePeriod) {
    if (activePeriod === '1year' || activePeriod === '6months') {
        return (d) => {
            const [y, m] = d.split('-');
            return `${y.slice(2)}.${parseInt(m)}`;
        };
    }
    return (d) => {
        const [, m, day] = d.split('-');
        return `${parseInt(m)}/${parseInt(day)}`;
    };
}

export function buildNrsData(symptoms, domain, activeCategory) {
    const map = {};
    symptoms.data.forEach((item) => {
        map[item.date] = item;
    });
    const filterCode = CATEGORY_CODE[activeCategory];

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

export function buildSleepData(sleep, domain, symptomDaySet) {
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

        const recommendedDelta = hours != null ? +(hours - RECOMMENDED_MIN).toFixed(1) : null;

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

export function buildHrData(heartRate, domain, symptomDaySet) {
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

export function buildBpData(bp, domain, symptomDaySet) {
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
            bpClass: classifyBp(systolic, diastolic),
            pulsePressure: systolic != null ? systolic - diastolic : null,
            isSymptomDay: symptomDaySet.has(date),
        };
    });
}

// 선형 회귀 기반 추세 계산
export function calcTrend(values, threshold = 0.01) {
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

    const range = Math.max(...valid) - Math.min(...valid);
    const normalizedSlope = range > 0 ? slope / range : 0;

    if (normalizedSlope > threshold) return { direction: 'up', slope };
    if (normalizedSlope < -threshold) return { direction: 'down', slope };
    return { direction: 'flat', slope };
}

// 추세 방향 → 색상·아이콘·텍스트
export function getTrendDisplay(trend, higherIsWorse) {
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
export function formatDateRange(domain) {
    if (!domain.length) return '';
    const fmt = (d) => {
        const [y, m, day] = d.split('-');
        return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
    };
    return `${fmt(domain[0])} ~ ${fmt(domain[domain.length - 1])}`;
}

// 네비게이션 범위 텍스트: "2025.10 ~ 2025.12"
export function formatNavRange(startDate, endDate) {
    if (!startDate || !endDate) return '';
    const fmt = (d) => {
        const [y, m] = d.split('-');
        return `${y}.${parseInt(m)}`;
    };
    return `${fmt(startDate)} ~ ${fmt(endDate)}`;
}
