// "2026-03-09" → "2026.03.09" (UX writing 가이드 YYYY.MM.DD)
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${year}.${month}.${day}`;
}
