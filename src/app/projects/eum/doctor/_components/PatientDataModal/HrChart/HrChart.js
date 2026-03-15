'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    Tooltip,
} from 'recharts';
import {
    HR_BOX_FILL,
    HR_WHISKER_COLOR,
    HR_MEDIAN_COLOR,
    REFERENCE_RANGE_COLOR,
    SYMPTOM_DAY_BG,
} from '../_lib/chartColors';
import styles from './HrChart.module.scss';

const CHART_WIDTH = 452;
const CHART_HEIGHT = 200;
const WHISKER_CAP = 4; // 수염 캡 반너비 (px)

const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
};

// stacked Bar의 custom shape — q1→q3 박스를 기준으로 전체 box-and-whisker 렌더
function BoxWhiskerShape({ x, y, width, height, payload }) {
    const { min, q1, median, q3, max } = payload;
    if (min == null || height === 0 || q3 === q1) return null;

    // y = q3 픽셀 위치 (박스 상단), y+height = q1 픽셀 위치 (박스 하단)
    const pxPerUnit = height / (q3 - q1);
    const py = (v) => y + (q3 - v) * pxPerUnit;
    const cx = x + width / 2; // 바 중앙 x
    const halfBox = Math.min(width / 2, 7); // 박스 반너비 (최대 7px)

    return (
        <g>
            {/* 수염 세로선 (min ~ max) */}
            <line
                x1={cx}
                x2={cx}
                y1={py(max)}
                y2={py(min)}
                stroke={HR_WHISKER_COLOR}
                strokeWidth={1.5}
            />
            {/* min 가로 캡 */}
            <line
                x1={cx - WHISKER_CAP}
                x2={cx + WHISKER_CAP}
                y1={py(min)}
                y2={py(min)}
                stroke={HR_WHISKER_COLOR}
                strokeWidth={1.5}
            />
            {/* max 가로 캡 */}
            <line
                x1={cx - WHISKER_CAP}
                x2={cx + WHISKER_CAP}
                y1={py(max)}
                y2={py(max)}
                stroke={HR_WHISKER_COLOR}
                strokeWidth={1.5}
            />
            {/* 박스 (q1 ~ q3) */}
            <rect
                x={cx - halfBox}
                y={y}
                width={halfBox * 2}
                height={height}
                fill={HR_BOX_FILL}
                stroke={HR_WHISKER_COLOR}
                strokeWidth={1}
            />
            {/* 중앙값 선 */}
            <line
                x1={cx - halfBox}
                x2={cx + halfBox}
                y1={py(median)}
                y2={py(median)}
                stroke={HR_MEDIAN_COLOR}
                strokeWidth={2}
            />
        </g>
    );
}

function HrTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0]?.payload;
    if (!entry || entry.median == null) return null;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-date">{fmtDate(label)}</p>
            <p className={styles['tooltip-row']}>중앙값 {entry.median} bpm</p>
            <p className={styles['tooltip-range']}>
                Q1–Q3: {entry.q1}–{entry.q3}
            </p>
            <p className={styles['tooltip-range']}>
                범위: {entry.min}–{entry.max}
            </p>
            {entry.inNormalRange != null && (
                <p className={entry.inNormalRange ? styles['tooltip-normal'] : styles['tooltip-abnormal']}>
                    {entry.inNormalRange ? '정상 범위' : '정상 범위 이탈'}
                </p>
            )}
            {entry.isSymptomDay && (
                <p className={styles['tooltip-symptom']}>증상 발생일</p>
            )}
        </div>
    );
}

export default function HrChart({ data, symptomDays, xTicks, dateFormatter }) {
    return (
        <BarChart
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            data={data}
            syncId="timeline"
            margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
        >
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

            {/* 정상 심박 범위 (60–100 bpm) */}
            <ReferenceArea
                y1={60}
                y2={100}
                fill={REFERENCE_RANGE_COLOR}
                fillOpacity={0.3}
                strokeOpacity={0}
            />

            {/* 증상 발생일 배경 */}
            {symptomDays.map((date) => (
                <ReferenceArea
                    key={date}
                    x1={date}
                    x2={date}
                    fill={SYMPTOM_DAY_BG}
                    strokeOpacity={0}
                />
            ))}

            <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={dateFormatter || fmtDate}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
            />
            <YAxis
                domain={[50, 115]}
                ticks={[60, 70, 80, 90, 100, 110]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={32}
            />

            <Tooltip content={<HrTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

            {/* 투명 base (0→q1) — boxSpan의 y 오프셋용 */}
            <Bar dataKey="q1" stackId="hr" fill="none" legendType="none" />
            {/* box-and-whisker shape (q1→q3 영역에 전체 SVG 렌더) */}
            <Bar
                dataKey="boxSpan"
                stackId="hr"
                shape={<BoxWhiskerShape />}
                legendType="none"
            />
        </BarChart>
    );
}
