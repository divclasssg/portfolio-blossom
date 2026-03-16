// 앵커일: JSON 데이터의 "오늘" 기준
const ANCHOR = '2026-03-08';

// 정규식: ISO 8601 (2026-03-08T18:30:00+09:00) / 날짜만 (2026-03-08)
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * KST 기준 오늘과 앵커일 사이의 오프셋(일)을 계산한다.
 * 서버(UTC)에서 실행되더라도 KST 기준으로 "오늘"을 판단한다.
 */
function getOffsetDays() {
  // Intl.DateTimeFormat으로 정확한 KST "오늘" 계산 (UTC 자정 경계 안전)
  const kstToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
  const todayUtc = Date.UTC(...kstToday.split('-').map((v, i) => (i === 1 ? +v - 1 : +v)));
  const anchorUtc = Date.UTC(2026, 2, 8); // month는 0-indexed
  return Math.round((todayUtc - anchorUtc) / 86_400_000);
}

/** ISO 8601 문자열의 날짜 부분만 days일 시프트. 시간·TZ 보존. */
function shiftISO(str, days) {
  const d = new Date(str.slice(0, 10) + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10) + str.slice(10);
}

/** YYYY-MM-DD 문자열을 days일 시프트. */
function shiftDateOnly(str, days) {
  const d = new Date(str + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 재귀적으로 객체 내 모든 날짜 문자열을 시프트한다. */
function walk(val, days) {
  if (typeof val === 'string') {
    if (ISO_RE.test(val)) return shiftISO(val, days);
    if (DATE_RE.test(val)) return shiftDateOnly(val, days);
    return val;
  }
  if (Array.isArray(val)) return val.map((v) => walk(v, days));
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = walk(v, days);
    return out;
  }
  return val;
}

/**
 * JSON 객체 내 모든 날짜를 오늘 기준으로 시프트한다.
 * 오프셋이 0이면 원본 그대로 반환 (복사 비용 없음).
 */
export function shiftDates(obj) {
  const days = getOffsetDays();
  if (days === 0) return obj;
  return walk(obj, days);
}
