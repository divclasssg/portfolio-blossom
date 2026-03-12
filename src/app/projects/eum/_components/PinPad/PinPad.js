'use client';

import styles from './PinPad.module.scss';

// 키패드 배열: 빈 문자열은 빈 칸
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

export default function PinPad({ value = '', onChange, maxLength = 6 }) {
  function handlePress(digit) {
    if (value.length < maxLength) onChange(value + digit);
  }

  function handleBackspace() {
    onChange(value.slice(0, -1));
  }

  return (
    <div className={styles['pin-pad']}>
      {/* 입력 상태 표시 (dot) */}
      <div
        className={styles['dots']}
        role="status"
        aria-label={`PIN ${value.length}자리 입력됨`}
        aria-live="polite"
      >
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={[
              styles['dot'],
              i < value.length ? styles['dot-filled'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* 숫자 키패드 */}
      <div className={styles['keypad']} role="group" aria-label="숫자 키패드">
        {KEYS.map((key, i) => {
          if (key === '') return <div key={i} aria-hidden="true" />;

          if (key === 'backspace') {
            return (
              <button
                key={i}
                type="button"
                className={styles['key']}
                onClick={handleBackspace}
                aria-label="마지막 숫자 지우기"
                disabled={value.length === 0}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* 백스페이스: 왼쪽 화살표 모양 키 + X */}
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
            );
          }

          return (
            <button
              key={i}
              type="button"
              className={styles['key']}
              onClick={() => handlePress(key)}
              aria-label={key}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
