// SVG 꺾은선 스파크라인 좌표 계산
// min/max 생략 시 values에서 자동 계산, 지정 시 고정 범위 사용
export function calcLinePoints(values, { width, height, padX, padY, min, max }) {
    const lo = min ?? Math.min(...values);
    const hi = max ?? Math.max(...values);
    const range = hi - lo || 1;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    return values.map((v, i) => ({
        x: padX + (i / (values.length - 1)) * chartW,
        y: padY + (1 - (v - lo) / range) * chartH,
    }));
}

export function toLinePath(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}
