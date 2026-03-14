// D-F12 차트 공통 색상 — CLAUDE_data_hierarchy.md 기반
// NRS 카테고리 색상은 Okabe-Ito CVD-safe 팔레트 사용 (Data Hierarchy 미정의 항목)
export const NRS_CATEGORY_COLORS = {
    'SYM-01': '#F0E442', // 전신 — yellow
    'SYM-02': '#009E73', // 근골격 — bluish green
    'SYM-03': '#56B4E9', // 신경 — sky blue
    'SYM-05': '#E3B8D3', // 소화기
    'SYM-07': '#E69F00', // 호흡기 — orange
    'SYM-08': '#D55E00', // 심리 — vermillion
    'SYM-09': '#0072B2', // 피부 — blue
    'SYM-12': '#CC79A7', // 심혈관/자율 — reddish-purple
};

// 심박수 차트 (Data Hierarchy 명시 — Okabe-Ito 기반)
export const HR_BOX_FILL = 'rgba(0,114,178,0.20)'; // box 내부 (진한 파랑 20%)
export const HR_WHISKER_COLOR = '#56B4E9'; // 수염, 박스 테두리 (하늘색)
export const HR_MEDIAN_COLOR = '#0072B2'; // 중앙값 선 (진한 파랑)

// 수면 차트 (Data Hierarchy 명시)
export const SLEEP_BAR_COLOR = '#E69F00'; // 일별 수면시간
export const SLEEP_OUTLIER_COLOR = '#FF3B30'; // 정상 이탈 (clinical.danger)
export const SLEEP_AVG_COLOR = '#D55E00'; // 평균선

// 공통
export const REFERENCE_RANGE_COLOR = '#C7C7CC'; // 정상 참조 범위 (Neutral-divider)
export const SYMPTOM_DAY_BG = 'rgba(209,209,214,0.30)'; // 증상 발생일 배경 ($neutral-surface 기반)
