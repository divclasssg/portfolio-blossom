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
} from 'recharts';
import {
  SLEEP_BAR_COLOR,
  SLEEP_OUTLIER_COLOR,
  SLEEP_AVG_COLOR,
  REFERENCE_RANGE_COLOR,
  SYMPTOM_DAY_BG,
} from '../_lib/chartColors';
import styles from './SleepChart.module.scss';

const CHART_WIDTH = 452;
const CHART_HEIGHT = 200;

const fmtDate = (d) => {
  const [, m, day] = d.split('-');
  return `${parseInt(m)}/${parseInt(day)}`;
};


function SleepTooltip({ active, payload, label }) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  const { value, payload: entry } = payload[0];
  return (
    <div className={styles.tooltip}>
      <p className={styles['tooltip-date']}>{fmtDate(label)}</p>
      <p className={styles['tooltip-value']}>{value}시간</p>
      {entry.outlier && (
        <p className={styles['tooltip-outlier']}>⚠️ 참조 범위 이탈</p>
      )}
    </div>
  );
}

export default function SleepChart({ data, averageHours, symptomDays, xTicks }) {
  return (
    <BarChart
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      data={data}
      syncId="timeline"
      margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
    >
      <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

      {/* 권장 수면 범위 (7-9h) 배경 */}
      <ReferenceArea y1={7} y2={9} fill={REFERENCE_RANGE_COLOR} fillOpacity={0.25} strokeOpacity={0} />

      {/* 증상 발생일 배경 */}
      {symptomDays.map((date) => (
        <ReferenceArea key={date} x1={date} x2={date} fill={SYMPTOM_DAY_BG} strokeOpacity={0} />
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
        ticks={[0, 3, 6, 9]}
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        unit="h"
        width={32}
      />

      <Tooltip
        content={<SleepTooltip />}
        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
      />

      {/* 평균 수면시간 기준선 — 직접 레이블 */}
      <ReferenceLine
        y={averageHours}
        stroke={SLEEP_AVG_COLOR}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        label={{ value: `평균 ${averageHours}h`, position: 'insideTopRight', fontSize: 11, fill: SLEEP_AVG_COLOR, dy: -6 }}
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
  );
}
