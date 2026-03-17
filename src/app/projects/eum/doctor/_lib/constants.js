export const SEVERITY_LABEL = { 1: '약함', 2: '보통', 3: '심함', 4: '극심' };

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

// 4단계 심각도별 색상 매핑 (tokens.scss clinical 대응)
export function getNrsColor(severity) {
    if (severity <= 1) return '#34C759';   // clinical.normal (약함)
    if (severity <= 2) return '#FF9500';   // clinical.warning (보통)
    if (severity <= 3) return '#E65C00';   // clinical.elevated (심함)
    return '#FF3B30';                       // clinical.danger (극심)
}
