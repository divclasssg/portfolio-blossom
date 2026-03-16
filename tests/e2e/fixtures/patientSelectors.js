// 환자 앱 aria-label 기반 로케이터
// doctor selectors.js와 동일 패턴

export const P_SELECTORS = {
    // ── AppBar ──
    appBar: '[role="banner"]',
    backBtn: '[aria-label="뒤로 가기"]',

    // ── TabBar ──
    tabBar: '[aria-label="주요 메뉴"]',
    tabHome: 'a[href="/projects/eum/patient"]',
    tabSymptoms: 'a[href="/projects/eum/patient/symptoms"]',
    tabSummary: 'a[href="/projects/eum/patient/summary"]',

    // ── Home ──
    symptomLogCta: '[aria-label="증상 기록하기"]',
    vitalsSection: '[aria-labelledby="vitals-title"]',

    // ── Symptoms ──
    segmentedControl: '[role="tablist"]',
    chatTab: '#tab-chat',
    recordsTab: '#tab-records',
    chatArea: '[aria-label="증상 기록 대화"]',
    chatInput: '[aria-label="증상 입력"]',
    sendBtn: '[aria-label="전송"]',
    severityMild: '[aria-label="약함(1-3)"]',
    severityModerate: '[aria-label="보통(4-6)"]',
    severitySevere: '[aria-label="심함(7-8)"]',
    severityExtreme: '[aria-label="극심(9-10)"]',

    // ── Checkin ──
    hospitalCode: '#hospital-code',
    codeError: '#code-error',

    // ── Onboarding ──
    consentAll: '[aria-label="전체 동의"]',
    nameInput: '#name-input',
    birthInput: '#birth-date-input',
    phoneInput: '#phone-input',
    codeInput: '#code-input',
    heightInput: '#height-input',
    weightInput: '#weight-input',
    bloodTypeSelect: '#blood-type-select',
    conditionInput: '[aria-label="기저질환 입력"]',
    addConditionBtn: '[aria-label="기저질환 추가"]',
    allergenInput: '[aria-label="알레르기 물질명 입력"]',
    addAllergyBtn: '[aria-label="알레르기 추가"]',
};

export function ploc(page, key) {
    return page.locator(P_SELECTORS[key]);
}
