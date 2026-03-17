import { calcLinePoints, toLinePath } from '../../_lib/sparkline';
import { toDateKey } from '../../_lib/vitalsData';
import styles from './VitalsToday.module.scss';

// ── 주제별 색상 (tokens.scss 대응) ────────────────────────────────────────────
export const COLOR_HEART = '#ff3b30';  // $color-danger
export const COLOR_SLEEP = '#5856d6';  // $color-secondary
export const COLOR_BP = '#34c759';     // $color-normal
export const COLOR_STEPS = '#ff9500';  // $color-warning

// ── SVG 스파크라인 상수 ──────────────────────────────────────────────────────
const W = 120;
const H = 24;
const PAD_X = 2;
const PAD_Y = 3;
const DIMS = { width: W, height: H, padX: PAD_X, padY: PAD_Y };

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
            <circle key={`sym-${i}`} cx={xPositions[i]} cy={H - 1.5} r={1.5} fill={severity >= 4 ? '#FF3B30' : '#6d6d72'} />
        );
    });
}

// ── Area Sparkline (심박수) ────────────────────────────────────────────────────
export function HeartRateSparkline({ data, symptomMap }) {
    const values = data.map((d) => d.heart_rate_bpm);
    const points = calcLinePoints(values, DIMS);
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
export function SleepSparkline({ data, symptomMap }) {
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
            <line x1={PAD_X} y1={refY} x2={W - PAD_X} y2={refY} stroke="#6d6d72" strokeWidth="0.5" strokeDasharray="2 1.5" />
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

// ── Line Sparkline (혈압 — 수축기/이완기) ──────────────────────────────────────
export function BpSparkline({ data }) {
    const systolic = data.map((d) => d.bp_systolic);
    const diastolic = data.map((d) => d.bp_diastolic);

    // 수축기·이완기 함께 스케일링 (공통 min/max)
    const allValues = [...systolic, ...diastolic];
    const sharedDims = { ...DIMS, min: Math.min(...allValues), max: Math.max(...allValues) };
    const sysPoints = calcLinePoints(systolic, sharedDims);
    const diaPoints = calcLinePoints(diastolic, sharedDims);

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
export function StepSparkline({ data }) {
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
