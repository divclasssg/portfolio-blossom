import styles from './SeverityChips.module.scss';

// NRS 3중 인코딩: 텍스트 + 이모지 + 색상 (CLAUDE_ux_writing.md 필수 준수)
const CHIPS = [
  { label: '약함(1-3)', emoji: '😊', colorClass: 'chip-mild' },
  { label: '보통(4-6)', emoji: '😐', colorClass: 'chip-moderate' },
  { label: '심함(7-8)', emoji: '😣', colorClass: 'chip-severe' },
  { label: '극심(9-10)', emoji: '😭', colorClass: 'chip-extreme' },
];

// 포트폴리오 데모 — 선택 상태 없음 (정적 표시)
export default function SeverityChips() {
  return (
    <div className={styles['chips-row']} role="list" aria-label="증상 강도 옵션 (포트폴리오 데모)">
      {CHIPS.map((chip) => (
        <span
          key={chip.label}
          className={`${styles['chip']} ${styles[chip.colorClass]}`}
          role="listitem"
          aria-label={`${chip.emoji} ${chip.label}`}
        >
          {chip.emoji} {chip.label}
        </span>
      ))}
    </div>
  );
}
