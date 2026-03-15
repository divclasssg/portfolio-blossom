'use client';

import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    Tooltip,
} from 'recharts';
import { REFERENCE_RANGE_COLOR, SYMPTOM_DAY_BG } from '../_lib/chartColors';
import styles from './BpChart.module.scss';

const BP_COLOR = '#009E73';
const BP_OUTLIER_COLOR = '#FF3B30';
const CHART_WIDTH = 452;
const CHART_HEIGHT = 200;

const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
};

// 수축기/이완기 점 커스텀 렌더러 — value null이면 미렌더
function BpDot({ cx, cy, value, payload }) {
    if (value == null) return null;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={payload.outlier ? BP_OUTLIER_COLOR : BP_COLOR}
            stroke="#fff"
            strokeWidth={1.5}
        />
    );
}

function BpTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0]?.payload;
    if (!entry || entry.systolic == null) return null;

    // 분류별 색상 결정
    const isElevated = entry.bpClass && entry.bpClass !== '정상' && entry.bpClass !== '높은 정상';

    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-date">{fmtDate(label)}</p>
            <p className={styles['tooltip-row']}>수축기 {entry.systolic} mmHg</p>
            <p className={styles['tooltip-row']}>이완기 {entry.diastolic} mmHg</p>
            {entry.bpClass && (
                <p className={isElevated ? styles['tooltip-warning'] : styles['tooltip-class']}>
                    {entry.bpClass}
                </p>
            )}
            {entry.pulsePressure != null && (
                <p className={styles['tooltip-secondary']}>맥압 {entry.pulsePressure} mmHg</p>
            )}
            {entry.outlier && <p className={styles['tooltip-outlier']}>⚠️ 참조 범위 이탈</p>}
            {entry.isSymptomDay && <p className={styles['tooltip-symptom']}>증상 발생일</p>}
        </div>
    );
}

export default function BpChart({ data, symptomDays, xTicks, dateFormatter }) {
    return (
        <ComposedChart
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            data={data}
            syncId="timeline"
            margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
        >
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

            {/* 수축기 정상 범위 (90–120 mmHg) */}
            <ReferenceArea
                y1={90}
                y2={120}
                fill={REFERENCE_RANGE_COLOR}
                fillOpacity={0.3}
                strokeOpacity={0}
            />
            {/* 이완기 정상 범위 (60–80 mmHg) */}
            <ReferenceArea
                y1={60}
                y2={80}
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
                domain={[50, 145]}
                ticks={[60, 80, 100, 120, 140]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={36}
            />

            <Tooltip content={<BpTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

            {/* 맥압 밴드 — 스택 Area로 이완기~수축기 구간 채움 */}
            {/* base: 이완기까지 투명 오프셋, band: 맥압(수축기-이완기) 높이 */}
            <Area
                dataKey="base"
                stackId="bp"
                stroke="none"
                fill="none"
                activeDot={false}
                legendType="none"
            />
            <Area
                dataKey="band"
                stackId="bp"
                stroke="none"
                fill={BP_COLOR}
                fillOpacity={0.15}
                activeDot={false}
                legendType="none"
            />

            {/* 수축기 점 (선 없음 — 데이터 연속성 오해 방지) */}
            <Line
                dataKey="systolic"
                stroke="none"
                dot={<BpDot />}
                activeDot={false}
                legendType="none"
            />
            {/* 이완기 점 (선 없음) */}
            <Line
                dataKey="diastolic"
                stroke="none"
                dot={<BpDot />}
                activeDot={false}
                legendType="none"
            />
        </ComposedChart>
    );
}
