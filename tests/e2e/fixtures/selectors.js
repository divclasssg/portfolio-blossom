// aria-label 기반 로케이터 헬퍼
// 기존 코드에 aria-label이 풍부하므로 data-testid 불필요

export const SELECTORS = {
    // DoctorPanel
    panel: '[aria-label="Eum 의사 보조 패널"]',
    panelClose: '[aria-label="패널 닫기"]',
    panelOpen: '[aria-label="Eum 패널 열기"]',
    panelPin: '[aria-label="패널 위치 고정"], [aria-label="패널 고정 해제"]',

    // PanelHeader
    headerBack: '[aria-label="이전 화면으로 돌아가기"]',
    chartModalBtn: '[aria-label="타임라인 차트 보기 (D-F12)"]',

    // PatientProfile
    patientDetailToggle: '[aria-label="환자 상세정보 펼치기"], [aria-label="환자 상세정보 접기"]',

    // Timeline
    timelineMoreBtn: '[aria-label*="건 더 보기"]',
    timelineCollapseBtn: '[aria-label="증상 기록 접기"]',
    timelineDataBtn: '[aria-label="환자 데이터 상세 보기 — 증상 타임라인 차트 열기"]',

    // PatientDataModal (D-F12)
    modal: '[role="dialog"][aria-label="환자 데이터 — 증상 타임라인"]',
    modalClose: '[aria-label="환자 데이터 패널 닫기"]',
    tabBar: '[aria-label="환자 데이터 탭"]',

    // AiDataProvider
    progressbar: '[role="progressbar"]',
    aiSectionTitle: 'h2:text("AI Analysis")',

    // FooterCta (D-000)
    resultWriteBtn: '[aria-label="결과 작성 화면으로 이동 (D-001)"]',

    // ResultFooterCta (D-001)
    transmitBtn: '[aria-label="진료 결과 확인 및 전송, 진료 종료"]',
    cancelBtn: '[aria-label="결과 작성 취소, 이전 화면으로 돌아가기"]',

    // TransmissionDialog
    transmitDialog: '[role="dialog"][aria-labelledby="dialog-title"]',

    // FilterBar
    periodFilter: '[aria-label="기간 선택"]',
    categoryFilter: '[aria-label="증상 카테고리 필터"]',
};

// 로케이터 생성 헬퍼 — page.locator()에 바로 사용
export function loc(page, key) {
    return page.locator(SELECTORS[key]);
}
