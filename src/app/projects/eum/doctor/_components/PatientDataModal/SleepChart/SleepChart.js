'use client';

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    SLEEP_BAR_COLOR,
    SLEEP_OUTLIER_COLOR,
    SLEEP_AVG_COLOR,
    REFERENCE_RANGE_COLOR,
    SYMPTOM_DAY_BG,
} from '../_lib/chartColors';
import styles from './SleepChart.module.scss';


const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
};

function SleepTooltip({ active, payload, label }) {
    if (!active || !payload?.length || payload[0].value == null) return null;
    const { value, payload: entry } = payload[0];
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-date">{fmtDate(label)}</p>
            <p className={styles['tooltip-value']}>{value}시간</p>
            {entry.recommendedDelta != null && (
                <p className={styles['tooltip-secondary']}>
                    권장 대비 {entry.recommendedDelta >= 0 ? `+${entry.recommendedDelta}` : entry.recommendedDelta}h
                </p>
            )}
            {entry.recentAvg != null && (
                <p className={styles['tooltip-secondary']}>
                    최근 7일 평균 {entry.recentAvg}h
                </p>
            )}
            {entry.outlier && <p className={styles['tooltip-outlier']}>⚠️ 참조 범위 이탈</p>}
            {entry.isSymptomDay && <p className={styles['tooltip-symptom']}>증상 발생일</p>}
        </div>
    );
}

export default function SleepChart({ data, averageHours, symptomDays, xTicks, dateFormatter }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
        <BarChart
            data={data}
            syncId="timeline"
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        >
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

            {/* 권장 수면 범위 (7-9h) 배경 */}
            <ReferenceArea
                y1={7}
                y2={9}
                fill={REFERENCE_RANGE_COLOR}
                fillOpacity={0.25}
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
                domain={[0, 10]}
                ticks={[0, 3, 6, 9]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                unit="h"
                width={32}
            />

            <Tooltip content={<SleepTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

            {/* 평균 수면시간 기준선 — Badge 형태 라벨 */}
            <ReferenceLine
                y={averageHours}
                stroke={SLEEP_AVG_COLOR}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                label={({ viewBox }) => {
                    const text = `평균 ${averageHours}h`;
                    const px = 6, py = 3, w = text.length * 7 + px * 2, h = 18;
                    const x = viewBox.width + viewBox.x - w - 4;
                    const y = viewBox.y - h - 4;
                    return (
                        <g>
                            <rect x={x} y={y} width={w} height={h} rx={4} fill={SLEEP_AVG_COLOR} />
                            <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize={11} fontWeight={700}>
                                {text}
                            </text>
                        </g>
                    );
                }}
            />

            <Bar dataKey="hours" radius={[3, 3, 0, 0]} maxBarSize={24}>
                {data.map((entry) => (
                    <Cell
                        key={entry.date}
                        fill={entry.outlier ? SLEEP_OUTLIER_COLOR : SLEEP_BAR_COLOR}
                    />
                ))}
            </Bar>
        </BarChart>
        </ResponsiveContainer>
    );
}
