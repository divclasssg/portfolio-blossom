'use client';

import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceArea,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { NRS_CATEGORY_COLORS, SYMPTOM_DAY_BG, CHART_AXIS_TICK, CHART_GRID_STROKE, CHART_CURSOR_FILL } from '../_lib/chartColors';
import { CATEGORY_LABEL, SEVERITY_LABEL } from '../../../_lib/constants';
import styles from './NrsChart.module.scss';

// 날짜 문자열 → "2/5" 형식 (타임존 독립)
const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
};

function NrsTooltip({ active, payload, label }) {
    if (!active || !payload?.length || payload[0].value == null) return null;
    const { value, payload: entry } = payload[0];
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip-date">{fmtDate(label)}</p>
            <p className={styles['tooltip-value']}>강도 {value} ({SEVERITY_LABEL[value] ?? `${value}단계`})</p>
            {entry.prevDelta != null && (
                <p className={styles['tooltip-delta']}>
                    이전 대비 {entry.prevDelta > 0 ? `↑${entry.prevDelta}` : entry.prevDelta < 0 ? `↓${Math.abs(entry.prevDelta)}` : '변화 없음'}
                </p>
            )}
            {entry.category && (
                <p className={styles['tooltip-category']}>
                    {CATEGORY_LABEL[entry.category] ?? entry.category}
                    {entry.categoryFreq != null && (
                        <span className={styles['tooltip-freq']}> ({entry.categoryFreq}회)</span>
                    )}
                </p>
            )}
            {entry.label && <p className={styles['tooltip-label']}>{entry.label}</p>}
        </div>
    );
}

export default function NrsChart({ data, symptomDays, xTicks, dateFormatter }) {
    return (
        <ResponsiveContainer width="100%" height={200}>
        <BarChart
            data={data}
            syncId="timeline"
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        >
            <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} strokeDasharray="0" />

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
                tick={{ fontSize: 11, fill: CHART_AXIS_TICK }}
                axisLine={false}
                tickLine={false}
            />
            <YAxis
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tick={{ fontSize: 11, fill: CHART_AXIS_TICK }}
                axisLine={false}
                tickLine={false}
                width={28}
            />

            <Tooltip content={<NrsTooltip />} cursor={{ fill: CHART_CURSOR_FILL }} isAnimationActive={false} />

            <Bar dataKey="severity" radius={[3, 3, 0, 0]} maxBarSize={24}>
                {data.map((entry) => (
                    <Cell
                        key={entry.date}
                        fill={NRS_CATEGORY_COLORS[entry.category] ?? 'transparent'}
                    />
                ))}
            </Bar>
        </BarChart>
        </ResponsiveContainer>
    );
}
