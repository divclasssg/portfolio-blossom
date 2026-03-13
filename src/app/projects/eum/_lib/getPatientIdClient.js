const DEFAULT_PATIENT_ID = 'pat_yoon_001';

// Client Component에서 사용 (document.cookie 파싱)
export function getPatientIdFromCookie() {
  if (typeof document === 'undefined') return DEFAULT_PATIENT_ID;
  const match = document.cookie.match(/(?:^|;\s*)eum_patient_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : DEFAULT_PATIENT_ID;
}
