'use client';

import { useState } from 'react';
import styles from './SymptomsContent.module.scss';
import AppBar from '../AppBar/AppBar';
import SegmentedControl from '../SegmentedControl/SegmentedControl';
import ChatArea from '../ChatArea/ChatArea';
import ChatInputBar from '../ChatInputBar/ChatInputBar';
import SymptomTimeline from '../SymptomTimeline/SymptomTimeline';
import useSymptomChat from '../../_hooks/useSymptomChat';

const TABS = [
    { key: 'chat', label: '채팅' },
    { key: 'records', label: '기록' },
];

export default function SymptomsContent({
    vitals,
    records: initialRecords,
    patientId,
    patientName,
    sessionId,
    serverTimestamp,
}) {
    const [activeTab, setActiveTab] = useState('chat');
    const { messages, isStreaming, records, sendMessage, handleSeveritySelect } = useSymptomChat({
        patientId,
        patientName,
        sessionId,
        initialRecords,
        serverTimestamp,
    });

    return (
        <>
            <AppBar backHref={`/projects/eum/patient/${patientId}`} />

            <SegmentedControl tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            <div
                className={styles[activeTab === 'chat' ? 'content-chat' : 'content-records']}
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
            >
                <h1 className="sr-only">증상 기록</h1>
                {activeTab === 'chat' && (
                    <ChatArea messages={messages} onSeveritySelect={handleSeveritySelect} vitals={vitals} />
                )}
                {activeTab === 'records' && <SymptomTimeline records={records} />}
            </div>
            {activeTab === 'chat' && <ChatInputBar onSend={sendMessage} disabled={isStreaming} />}
        </>
    );
}
