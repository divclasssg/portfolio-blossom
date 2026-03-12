import styles from './ChatInputBar.module.scss';

// 포트폴리오 데모 — 카메라/마이크/전송 기능 미구현
export default function ChatInputBar() {
  return (
    <div className={styles['input-bar']} role="region" aria-label="증상 입력 (포트폴리오 데모)">
      {/* 카메라 버튼 — MVP 제외 */}
      <button
        type="button"
        className={styles['icon-btn']}
        aria-label="사진 첨부 (포트폴리오 데모: 미구현)"
        aria-disabled="true"
        tabIndex={-1}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      {/* 텍스트 입력 — 데모: 정적 표시 */}
      <div className={styles['input-field']} aria-hidden="true">
        <span className={styles['placeholder']}>증상을 입력하세요.</span>
      </div>

      {/* 마이크 버튼 — STT 구현 범위 제외 */}
      <button
        type="button"
        className={styles['icon-btn']}
        aria-label="음성 입력 (포트폴리오 데모: 미구현)"
        aria-disabled="true"
        tabIndex={-1}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* 전송 버튼 — 데모: 미구현 */}
      <button
        type="button"
        className={styles['send-btn']}
        aria-label="전송 (포트폴리오 데모: 미구현)"
        aria-disabled="true"
        tabIndex={-1}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
