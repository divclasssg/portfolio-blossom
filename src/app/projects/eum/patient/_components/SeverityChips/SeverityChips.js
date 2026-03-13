'use client';

import styles from './SeverityChips.module.scss';

// NRS 3중 인코딩: 텍스트 + 이모지 + 색상 (CLAUDE_ux_writing.md 필수 준수)
// severity: DB 저장값 1-4 (1=약함, 2=보통, 3=심함, 4=극심)
const CHIPS = [
  { label: '약함(1-3)', emoji: '😊', colorClass: 'chip-mild',     severity: 1 },
  { label: '보통(4-6)', emoji: '😐', colorClass: 'chip-moderate', severity: 2 },
  { label: '심함(7-8)', emoji: '😣', colorClass: 'chip-severe',   severity: 3 },
  { label: '극심(9-10)', emoji: '😭', colorClass: 'chip-extreme', severity: 4 },
];

// onSelect: (severity: number) => void
// selected: number | null — 선택된 severity (선택 후 비활성화)
export default function SeverityChips({ onSelect, selected = null }) {
  return (
    <div className={styles['chips-row']} role="list" aria-label="증상 강도 선택">
      {CHIPS.map((chip) => {
        const isSelected = selected === chip.severity;
        const isDisabled = selected !== null;

        return (
          <button
            key={chip.label}
            type="button"
            className={`${styles['chip']} ${styles[chip.colorClass]} ${isSelected ? styles['chip-selected'] : ''}`}
            role="listitem"
            aria-label={`${chip.emoji} ${chip.label}`}
            aria-pressed={isSelected}
            aria-disabled={isDisabled && !isSelected}
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect?.(chip.severity)}
          >
            {chip.emoji} {chip.label}
          </button>
        );
      })}
    </div>
  );
}
