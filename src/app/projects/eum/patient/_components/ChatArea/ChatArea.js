'use client';

import { useEffect, useRef } from 'react';
import styles from './ChatArea.module.scss';
import SeverityChips from '../SeverityChips/SeverityChips';
import VitalsBanner from '../VitalsBanner/VitalsBanner';

// 날짜 포맷: "2026년 3월 14일 토요일"
function formatDateHeader(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    }).format(date);
}

// 시간 포맷: "오전 9:05"
function formatTime(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}

// 같은 분(minute)인지 비교
function isSameMinute(a, b) {
    if (!a || !b) return false;
    const da = new Date(a);
    const db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate() &&
        da.getHours() === db.getHours() &&
        da.getMinutes() === db.getMinutes()
    );
}

// 연속된 동일 방향 + 동일 분 메시지 → 마지막 것만 시간 표시
function shouldShowTime(messages, index) {
    const msg = messages[index];
    if (!msg.timestamp || msg.streaming) return false;

    const next = messages[index + 1];
    // 다음 메시지가 같은 방향(type) + 같은 분이면 시간 숨김
    if (next && next.type === msg.type && isSameMinute(msg.timestamp, next.timestamp)) {
        return false;
    }
    return true;
}

// messages: [{
//   type: 'bot'|'user',
//   text: string,
//   timestamp?: string,          // ISO 8601
//   showSeverityChips?: boolean,
//   selectedSeverity?: number,   // 선택 완료 시
//   streaming?: boolean,         // 스트리밍 중 커서 표시
// }]
export default function ChatArea({ messages = [], onSeveritySelect, vitals }) {
    const bottomRef = useRef(null);

    // 새 메시지 추가 시 자동 스크롤
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, messages.at(-1)?.text]);

    // 첫 메시지 timestamp에서 날짜 헤더 생성
    const dateLabel = messages[0]?.timestamp ? formatDateHeader(messages[0].timestamp) : null;

    return (
        <div className={styles['chat-area']} aria-label="증상 기록 대화" aria-live="polite">
            <div className={styles['chat-area-container']}>
                {dateLabel && (
                    <time className={styles['date-header']} dateTime={messages[0].timestamp} aria-label={`대화 날짜: ${dateLabel}`}>
                        {dateLabel}
                    </time>
                )}
                <VitalsBanner vitals={vitals} />
            </div>
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
                    {shouldShowTime(messages, i) && (
                        <time className={styles['message-time']} dateTime={msg.timestamp}>
                            {formatTime(msg.timestamp)}
                        </time>
                    )}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
