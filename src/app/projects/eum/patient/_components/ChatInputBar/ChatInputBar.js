'use client';

import { useState } from 'react';
import styles from './ChatInputBar.module.scss';

// onSend: (text: string) => void
// disabled: boolean — 스트리밍 중 입력 비활성화
export default function ChatInputBar({ onSend, disabled = false }) {
    const [value, setValue] = useState('');

    function handleSubmit() {
        const text = value.trim();
        if (!text || disabled) return;
        onSend?.(text);
        setValue('');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className={styles['input-bar']} role="region" aria-label="증상 입력">
            {/* 카메라 버튼 — MVP 제외 */}
            <button
                type="button"
                className={styles['icon-btn']}
                aria-label="사진 첨부 (미구현)"
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

            {/* 텍스트 입력 */}
            <div className={styles['input-field']}>
                <input
                    type="text"
                    className={styles['input']}
                    placeholder={disabled ? '응답 중...' : '증상을 입력하세요.'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-label="증상 입력"
                />
            </div>

            {/* 마이크 버튼 — STT 구현 범위 제외 */}
            <button
                type="button"
                className={styles['icon-btn']}
                aria-label="음성 입력 (미구현)"
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

            {/* 전송 버튼 */}
            <button
                type="button"
                className={styles['send-btn']}
                aria-label="전송"
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
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
