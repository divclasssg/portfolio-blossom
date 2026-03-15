'use client';

import { useState } from 'react';
import styles from './ChatInputBar.module.scss';
import { CameraIcon, MicIcon, SendIcon } from '../../../_components/icons';

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
        <form
            className={styles['input-bar']}
            role="region"
            aria-label="증상 입력"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
            <div className={styles['input-bar-container']}>                

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

                <div className={styles['icon-btn-container']}>
                    {/* 카메라 버튼 — MVP 제외 */}
                    <button
                        type="button"
                        className={styles['icon-btn']}
                        aria-label="사진 첨부 (미구현)"
                        aria-disabled="true"
                        tabIndex={-1}
                    >
                        <CameraIcon size={24} />
                    </button>

                    {/* 마이크 버튼 — STT 구현 범위 제외 */}
                    <button
                        type="button"
                        className={styles['icon-btn']}
                        aria-label="음성 입력 (미구현)"
                        aria-disabled="true"
                        tabIndex={-1}
                    >
                        <MicIcon size={24} />
                    </button>

                    {/* 전송 버튼 */}
                    <button
                        type="submit"
                        className={styles['send-btn']}
                        aria-label="전송"
                        disabled={disabled || !value.trim()}
                    >
                        <SendIcon size={36} />
                    </button>
                </div>                
            </div>            
        </form>
    );
}
