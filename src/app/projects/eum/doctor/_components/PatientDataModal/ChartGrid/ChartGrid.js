'use client';

import NrsChart from '../NrsChart/NrsChart';
import SleepChart from '../SleepChart/SleepChart';
import HrChart from '../HrChart/HrChart';
import BpChart from '../BpChart/BpChart';
import styles from './ChartGrid.module.scss';

// 전체 13일 도메인 (2026-02-05 ~ 2026-02-17)
const DOMAIN = [
    '2026-02-05',
    '2026-02-06',
    '2026-02-07',
    '2026-02-08',
    '2026-02-09',
    '2026-02-10',
    '2026-02-11',
    '2026-02-12',
    '2026-02-13',
    '2026-02-14',
    '2026-02-15',
    '2026-02-16',
    '2026-02-17',
];

// 카테고리 칩 ID → JSON category 코드 매핑
const CATEGORY_CODE = {
    digestive: 'SYM-05',
    autonomic: 'SYM-12',
};

// 기간 선택 → 도메인 시작일 (데이터 기준: 최신 2026-02-17)
const PERIOD_FROM = {
    '1day': '2026-02-17',
    '1week': '2026-02-11',
    '1month': '2026-02-05',
    '6months': '2026-02-05',
    '1year': '2026-02-05',
};

function getFilteredDomain(activePeriod, customRange) {
    if (activePeriod === 'custom' && customRange?.startDate && customRange?.endDate) {
        return DOMAIN.filter((d) => d >= customRange.startDate && d <= customRange.endDate);
    }
    const from = PERIOD_FROM[activePeriod] ?? '2026-02-05';
    return DOMAIN.filter((d) => d >= from);
}

// X축 틱: 7개 이하 → 전부, 초과 → 5개 균등 분할 (중복 제거)
function getXTicks(domain) {
    if (domain.length <= 7) return domain;
    const step = Math.floor((domain.length - 1) / 4);
    const indices = [0, step, 2 * step, 3 * step, domain.length - 1];
    return [...new Set(indices)].map((i) => domain[i]);
}

function buildNrsData(symptoms, domain, activeCategory) {
    const map = {};
    symptoms.data.forEach((item) => {
        map[item.date] = item;
    });
    const filterCode = CATEGORY_CODE[activeCategory]; // 'all'이면 undefined
    return domain.map((date) => {
        const item = map[date];
        const show = item && (activeCategory === 'all' || item.category === filterCode);
        return {
            date,
            severity: show ? item.severity : null,
            category: show ? item.category : null,
            label: show ? item.label : null,
        };
    });
}

function buildSleepData(sleep, domain) {
    const map = {};
    sleep.data_7day.forEach((item) => {
        map[item.date] = item;
    });
    return domain.map((date) => ({
        date,
        hours: map[date]?.hours ?? null,
        outlier: map[date]?.outlier_flag ?? false,
    }));
}

function buildHrData(heartRate, domain) {
    const map = {};
    heartRate.data.forEach((item) => {
        map[item.date] = item;
    });
    return domain.map((date) => ({
        date,
        min: map[date]?.min ?? null,
        q1: map[date]?.q1 ?? null,
        median: map[date]?.median ?? null,
        q3: map[date]?.q3 ?? null,
        max: map[date]?.max ?? null,
    }));
}

function buildBpData(bp, domain) {
    const map = {};
    bp.data_7day.forEach((item) => {
        map[item.date] = item;
    });
    return domain.map((date) => {
        const entry = map[date];
        return {
            date,
            systolic: entry?.systolic ?? null,
            diastolic: entry?.diastolic ?? null,
            outlier: entry?.outlier_flag ?? false,
            base: entry?.diastolic ?? null,
            band: entry ? entry.systolic - entry.diastolic : null,
        };
    });
}

export default function ChartGrid({ chartData, activePeriod, activeCategory, customRange }) {
    const { symptoms, sleep, heart_rate, blood_pressure } = chartData.tabs;

    const domain = getFilteredDomain(activePeriod, customRange);
    const xTicks = getXTicks(domain);

    // 카테고리 필터 적용 후 증상 발생일 목록
    const filterCode = CATEGORY_CODE[activeCategory];
    const symptomDays = symptoms.data
        .filter((d) => activeCategory === 'all' || d.category === filterCode)
        .map((d) => d.date)
        .filter((d) => domain.includes(d));

    const nrsData = buildNrsData(symptoms, domain, activeCategory);
    const sleepData = buildSleepData(sleep, domain);
    const hrData = buildHrData(heart_rate, domain);
    const bpData = buildBpData(blood_pressure, domain);

    return (
        <div className={styles.grid}>
            <div className={styles.card}>
                <p className={styles['card-title']}>증상 강도 (NRS)</p>
                <NrsChart data={nrsData} symptomDays={symptomDays} xTicks={xTicks} />
            </div>

            <div className={styles.card}>
                <p className={styles['card-title']}>수면시간</p>
                <SleepChart
                    data={sleepData}
                    averageHours={sleep.average_hours}
                    symptomDays={symptomDays}
                    xTicks={xTicks}
                />
            </div>

            <div className={styles.card}>
                <p className={styles['card-title']}>심박수 (bpm)</p>
                <HrChart data={hrData} symptomDays={symptomDays} xTicks={xTicks} />
            </div>

            <div className={styles.card}>
                <p className={styles['card-title']}>혈압 (mmHg)</p>
                <BpChart data={bpData} symptomDays={symptomDays} xTicks={xTicks} />
            </div>
        </div>
    );
}
