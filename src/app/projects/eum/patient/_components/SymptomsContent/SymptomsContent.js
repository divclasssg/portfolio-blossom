'use client';

import { useState, useCallback } from 'react';
import styles from './SymptomsContent.module.scss';
import AppBar from '../AppBar/AppBar';
import VitalsBanner from '../VitalsBanner/VitalsBanner';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import ChatArea from '../ChatArea/ChatArea';
import ChatInputBar from '../ChatInputBar/ChatInputBar';
import SymptomTimeline from '../SymptomTimeline/SymptomTimeline';
import TabBar from '../TabBar/TabBar';

const TABS = [
    { key: 'chat', label: '채팅' },
    { key: 'records', label: '기록' },
];

// 초기 인사 메시지 생성 (환자 이름 동적 반영)
function makeInitialMessages(name) {
    const greeting = name ? `안녕하세요 ${name}님!` : '안녕하세요!';
    return [{ type: 'bot', text: `${greeting}\n어떤 증상이 있으신가요?`, timestamp: new Date().toISOString() }];
}

// AI에 보낼 히스토리 형식 (role/content 배열) — 첫 인사 메시지 제외
function buildChatHistory(msgs) {
    return msgs
        .slice(1)
        .map((m) => ({ role: m.type === 'bot' ? 'assistant' : 'user', content: m.text }));
}

export default function SymptomsContent({
    vitals,
    records: initialRecords,
    patientId,
    patientName,
    sessionId,
}) {
    const [activeTab, setActiveTab] = useState('chat');
    const [messages, setMessages] = useState(() => makeInitialMessages(patientName));
    const [isStreaming, setIsStreaming] = useState(false);
    const [records, setRecords] = useState(initialRecords);

    // 증상 레코드 DB 저장 후 기록 탭 갱신
    async function saveSymptomRecord(symptomRecord) {
        try {
            const res = await fetch('/api/eum/symptoms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    sessionId,
                    description: symptomRecord.description,
                    // 채팅 완료 시점의 실제 시각 사용 (GPT 생성 날짜 무시)
                    occurredAt: new Date().toISOString(),
                    severity: symptomRecord.severity,
                    categoryCode: symptomRecord.categoryCode || 'SYM-01',
                    locationType: symptomRecord.locationType || 'HOME',
                }),
            });

            const resText = await res.text();

            if (res.ok) {
                const updatedRes = await fetch(`/api/eum/symptoms?patientId=${patientId}`);
                if (updatedRes.ok) {
                    const { symptom_records } = await updatedRes.json();
                    setRecords(symptom_records);
                }
                setMessages((prev) => [
                    ...prev,
                    { type: 'bot', text: '증상이 기록됐어요.\n기록 탭에서 확인할 수 있습니다.', timestamp: new Date().toISOString() },
                ]);
            } else {
                console.error('[SymptomsContent] 증상 저장 실패:', res.status, resText);
                setMessages((prev) => [
                    ...prev,
                    { type: 'bot', text: '증상 저장에 실패했습니다. 다시 시도해 주세요.', timestamp: new Date().toISOString() },
                ]);
            }
        } catch (err) {
            console.error('[SymptomsContent] 증상 저장 오류:', err.message);
            setMessages((prev) => [
                ...prev,
                { type: 'bot', text: '증상 저장에 실패했습니다. 다시 시도해 주세요.' },
            ]);
        }
    }

    // SSE 스트리밍 처리 — 메시지 전송 후 호출
    // currentMessages: 사용자 메시지가 이미 포함된 배열
    async function startStreaming(currentMessages) {
        setIsStreaming(true);

        // 봇 슬롯 인덱스 = currentMessages.length (봇 메시지가 추가될 위치)
        const botMsgIdx = currentMessages.length;
        setMessages((prev) => [...prev, { type: 'bot', text: '', streaming: true, timestamp: new Date().toISOString() }]);

        try {
            const res = await fetch('/api/eum/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: buildChatHistory(currentMessages),
                    patientId,
                    sessionId,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let showSeverityChips = false;
            let completed = false;
            let symptomRecord = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    try {
                        const event = JSON.parse(line.slice(6));
                        if (event.type === 'token') {
                            setMessages((prev) => {
                                const next = [...prev];
                                next[botMsgIdx] = {
                                    ...next[botMsgIdx],
                                    text: next[botMsgIdx].text + event.content,
                                };
                                return next;
                            });
                        } else if (event.type === 'meta' && event.showSeverityChips) {
                            showSeverityChips = true;
                        } else if (event.type === 'done') {
                            completed = event.completed ?? false;
                            symptomRecord = event.symptomRecord ?? null;
                        }
                    } catch {}
                }
            }

            setMessages((prev) => {
                const next = [...prev];
                // 스트리밍 중 분할된 토큰으로 인해 태그가 노출될 수 있으므로 최종 정리
                const cleanText = next[botMsgIdx].text
                    .replace(/\[META:.*?\]/gs, '')
                    .replace(/\[DONE:.*?\]/gs, '')
                    .trim();
                next[botMsgIdx] = {
                    ...next[botMsgIdx],
                    text: cleanText,
                    streaming: false,
                    showSeverityChips,
                };
                return next;
            });

            if (completed && symptomRecord) {
                await saveSymptomRecord(symptomRecord);
            }
        } catch (err) {
            console.error('[SymptomsContent] 스트리밍 오류:', err.message);
            setMessages((prev) => {
                const next = [...prev];
                next[botMsgIdx] = {
                    ...next[botMsgIdx],
                    text: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
                    streaming: false,
                };
                return next;
            });
        } finally {
            setIsStreaming(false);
        }
    }

    // 메시지 전송: isStreaming=true 시 재진입 불가 → stale closure 문제 없음
    const sendMessage = useCallback(
        async (text) => {
            if (isStreaming) return;
            const userMsg = { type: 'user', text, timestamp: new Date().toISOString() };
            const nextMessages = [...messages, userMsg];
            setMessages(nextMessages);
            startStreaming(nextMessages);
        },
        [isStreaming, messages]
    ); // eslint-disable-line react-hooks/exhaustive-deps

    // 심각도 칩 선택 → 메시지로 변환 후 전송
    const handleSeveritySelect = useCallback(
        async (severity) => {
            setMessages((prev) =>
                prev.map((m, i) =>
                    i === prev.length - 1 && m.showSeverityChips
                        ? { ...m, selectedSeverity: severity }
                        : m
                )
            );
            const severityText = ['', '약함(1-3)', '보통(4-6)', '심함(7-8)', '극심(9-10)'][
                severity
            ] ?? '';
            await sendMessage(`증상 강도: ${severityText}`);
        },
        [sendMessage]
    );

    return (
        <>
            <AppBar backHref="/projects/eum/patient" />
            <VitalsBanner vitals={vitals} />
            <SegmentedControl tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            <main
                className={styles[activeTab === 'chat' ? 'content-chat' : 'content-records']}
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
            >
                <h1 className="sr-only">증상 기록</h1>
                {activeTab === 'chat' && (
                    <ChatArea messages={messages} onSeveritySelect={handleSeveritySelect} />
                )}
                {activeTab === 'records' && <SymptomTimeline records={records} />}
            </main>
            {activeTab === 'chat' && <ChatInputBar onSend={sendMessage} disabled={isStreaming} />}
            <TabBar activePath="symptoms" />
        </>
    );
}
