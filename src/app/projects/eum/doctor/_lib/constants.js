export const SEVERITY_LABEL = { 1: '낮음', 2: '중간', 3: '높음', 4: '심함' };

export const CATEGORY_LABEL = {
    'SYM-01': '전신',
    'SYM-02': '근골격',
    'SYM-03': '신경',
    'SYM-05': '소화기',
    'SYM-07': '호흡기',
    'SYM-08': '심리',
    'SYM-09': '피부',
    'SYM-12': '심혈관/자율',
};

// NRS 심각도별 색상 매핑 (tokens.scss clinical 대응)
export function getNrsColor(severity) {
    if (severity <= 3) return '#34C759';   // clinical.normal
    if (severity <= 6) return '#FF9500';   // clinical.warning
    return '#FF3B30';                       // clinical.danger
}
