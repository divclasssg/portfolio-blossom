'use client';

import { useEffect, useRef } from 'react';
import styles from './ChatArea.module.scss';
import SeverityChips from '../SeverityChips/SeverityChips';

// messages: [{
//   type: 'bot'|'user',
//   text: string,
//   showSeverityChips?: boolean,
//   selectedSeverity?: number,   // 선택 완료 시
//   streaming?: boolean,         // 스트리밍 중 커서 표시
// }]
export default function ChatArea({ messages = [], onSeveritySelect }) {
    const bottomRef = useRef(null);

    // 새 메시지 추가 시 자동 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages.at(-1)?.text]);

    return (
        <div className={styles['chat-area']} aria-label="증상 기록 대화" aria-live="polite">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={styles[msg.type === 'bot' ? 'message-bot' : 'message-user']}
                >
                    {msg.type === 'bot' && (
                        <span className={styles['bot-label']} aria-hidden="true">
                            Eum
                        </span>
                    )}
                    <div className={styles[msg.type === 'bot' ? 'bubble-bot' : 'bubble-user']}>
                        {msg.text.split('\n').map((line, j, arr) => (
                            <span key={j}>
                                {line}
                                {j < arr.length - 1 && <br />}
                            </span>
                        ))}
                        {/* 스트리밍 중 커서 깜빡임 */}
                        {msg.streaming && <span className={styles['cursor']} aria-hidden="true" />}
                    </div>
                    {msg.showSeverityChips && (
                        <SeverityChips
                            onSelect={onSeveritySelect}
                            selected={msg.selectedSeverity ?? null}
                        />
                    )}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
