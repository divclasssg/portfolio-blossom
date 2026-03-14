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
import { NRS_CATEGORY_COLORS, SYMPTOM_DAY_BG } from '../_lib/chartColors';
import styles from './NrsChart.module.scss';

const CHART_WIDTH = 452;
const CHART_HEIGHT = 200;

// 날짜 문자열 → "2/5" 형식 (타임존 독립)
const fmtDate = (d) => {
    const [, m, day] = d.split('-');
    return `${parseInt(m)}/${parseInt(day)}`;
};

// 카테고리 → 한국어 라벨
const CATEGORY_LABEL = {
    'SYM-12': '심리/자율',
    'SYM-05': '소화기',
};

function NrsTooltip({ active, payload, label }) {
    if (!active || !payload?.length || payload[0].value == null) return null;
    const { value, payload: entry } = payload[0];
    return (
        <div className={styles.tooltip}>
            <p className={styles['tooltip-date']}>{fmtDate(label)}</p>
            <p className={styles['tooltip-value']}>NRS {value}</p>
            {entry.category && (
                <p className={styles['tooltip-category']}>
                    {CATEGORY_LABEL[entry.category] ?? entry.category}
                </p>
            )}
            {entry.label && <p className={styles['tooltip-label']}>{entry.label}</p>}
        </div>
    );
}

export default function NrsChart({ data, symptomDays, xTicks }) {
    return (
        <BarChart
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            data={data}
            syncId="timeline"
            margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
        >
            <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

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
                tickFormatter={fmtDate}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
            />
            <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={28}
            />

            <Tooltip content={<NrsTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

            <Bar dataKey="severity" radius={[3, 3, 0, 0]} maxBarSize={24}>
                {data.map((entry) => (
                    <Cell
                        key={entry.date}
                        fill={NRS_CATEGORY_COLORS[entry.category] ?? 'transparent'}
                    />
                ))}
            </Bar>
        </BarChart>
    );
}
