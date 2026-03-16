// chronic_conditions 문자열에서 ICD 코드 추출 — "역류성 식도염 (K21.0)" → "K21.0"
export function extractIcdCode(condition) {
    const match = typeof condition === 'string' ? condition.match(/\(([A-Z]\d[\d.]*)\)/) : null;
    return match ? match[1] : null;
}
