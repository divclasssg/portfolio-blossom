// Client Component에서 사용 (document.cookie 파싱)
// 쿠키 없으면 null 반환
export function getPatientIdFromCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)eum_patient_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
