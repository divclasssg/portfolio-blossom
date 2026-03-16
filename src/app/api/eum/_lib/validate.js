// API 입력값 형식 검증
// 허용 패턴: pat_ 접두사 + 영소문자/숫자/언더스코어, 최대 50자
const PATIENT_ID_RE = /^pat_[a-z0-9_]{1,46}$/;
// 허용 패턴: ses_ 접두사 + 영소문자/숫자/언더스코어, 최대 50자
const SESSION_ID_RE = /^ses_[a-z0-9_]{1,46}$/;

export function isValidPatientId(id) {
    return typeof id === 'string' && PATIENT_ID_RE.test(id);
}

export function isValidSessionId(id) {
    return typeof id === 'string' && SESSION_ID_RE.test(id);
}
