'use client';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  Tooltip,
  Customized,
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
const BOX_HALF_WIDTH = 7; // 박스 반너비 (px)

const fmtDate = (d) => {
  const [, m, day] = d.split('-');
  return `${parseInt(m)}/${parseInt(day)}`;
};


// Customized 컴포넌트 — yScale에 접근해 box-and-whisker SVG 렌더
function BoxWhiskerPlot({ formattedGraphicalItems, yAxisMap }) {
  const yScale = yAxisMap?.[0]?.scale;
  if (!yScale) return null;

  // 숨긴 Line(dataKey="median")의 points에서 x좌표 추출
  const lineItem = formattedGraphicalItems?.find(
    (item) => item?.item?.props?.dataKey === 'median',
  );
  const points = lineItem?.props?.points;
  if (!points?.length) return null;

  const py = (v) => yScale(v);

  return (
    <g>
      {points.map((point) => {
        const { x, payload } = point;
        const { min, q1, median, q3, max, date } = payload;
        if (min == null) return null;

        return (
          <g key={date}>
            {/* 수염 세로선 (min ~ max) */}
            <line x1={x} x2={x} y1={py(max)} y2={py(min)} stroke={HR_WHISKER_COLOR} strokeWidth={1.5} />
            {/* min 가로 캡 */}
            <line x1={x - 4} x2={x + 4} y1={py(min)} y2={py(min)} stroke={HR_WHISKER_COLOR} strokeWidth={1.5} />
            {/* max 가로 캡 */}
            <line x1={x - 4} x2={x + 4} y1={py(max)} y2={py(max)} stroke={HR_WHISKER_COLOR} strokeWidth={1.5} />
            {/* 박스 (q1 ~ q3) */}
            <rect
              x={x - BOX_HALF_WIDTH}
              y={py(q3)}
              width={BOX_HALF_WIDTH * 2}
              height={Math.max(py(q1) - py(q3), 1)}
              fill={HR_BOX_FILL}
              stroke={HR_WHISKER_COLOR}
              strokeWidth={1}
            />
            {/* 중앙값 선 */}
            <line
              x1={x - BOX_HALF_WIDTH}
              x2={x + BOX_HALF_WIDTH}
              y1={py(median)}
              y2={py(median)}
              stroke={HR_MEDIAN_COLOR}
              strokeWidth={2}
            />
          </g>
        );
      })}
    </g>
  );
}

function HrTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload;
  if (!entry || entry.median == null) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles['tooltip-date']}>{fmtDate(label)}</p>
      <p className={styles['tooltip-row']}>중앙값 {entry.median} bpm</p>
      <p className={styles['tooltip-range']}>
        Q1–Q3: {entry.q1}–{entry.q3}
      </p>
      <p className={styles['tooltip-range']}>
        범위: {entry.min}–{entry.max}
      </p>
    </div>
  );
}

export default function HrChart({ data, symptomDays, xTicks }) {
  return (
    <ComposedChart
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      data={data}
      syncId="timeline"
      margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
    >
      <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="0" />

      {/* 정상 심박 범위 (60–100 bpm) */}
      <ReferenceArea y1={60} y2={100} fill={REFERENCE_RANGE_COLOR} fillOpacity={0.3} strokeOpacity={0} />

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
        domain={[50, 115]}
        ticks={[60, 70, 80, 90, 100, 110]}
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        width={32}
      />

      <Tooltip content={<HrTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />

      {/* BoxWhiskerPlot이 참조할 포인트 생성용 숨긴 Line */}
      <Line dataKey="median" stroke="none" dot={false} activeDot={false} legendType="none" />

      {/* Box-and-whisker SVG 오버레이 */}
      <Customized component={BoxWhiskerPlot} />
    </ComposedChart>
  );
}
