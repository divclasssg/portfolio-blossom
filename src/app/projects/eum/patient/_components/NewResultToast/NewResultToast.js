'use client';

import { useEffect, useState } from 'react';
import Toast from '../Toast/Toast';

const STORAGE_KEY = 'eum_seen_results';

// localStorage에서 이미 확인한 session_id 목록 조회
function getSeenResults() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// session_id를 확인 목록에 추가
export function markResultAsSeen(sessionId) {
    try {
        const seen = getSeenResults();
        if (!seen.includes(sessionId)) {
            seen.push(sessionId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
        }
    } catch {
        // localStorage 불가 시 무시
    }
}

// 서버에서 전달받은 전송 완료된 결과 목록 중
// localStorage에 없는 가장 최신 1건만 토스트로 표시
export default function NewResultToast({ transmittedResults }) {
    const [unseenResult, setUnseenResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!transmittedResults || transmittedResults.length === 0) return;

        const seen = getSeenResults();
        // transmitted_at 기준 최신순 정렬된 상태로 전달됨 → 첫 번째 미확인 결과
        const unseen = transmittedResults.find((r) => !seen.includes(r.session_id));

        if (unseen) {
            setUnseenResult(unseen);
            setIsVisible(true);
        }
    }, [transmittedResults]);

    function handleDismiss() {
        setIsVisible(false);
        if (unseenResult) {
            markResultAsSeen(unseenResult.session_id);
        }
    }

    if (!unseenResult) return null;

    return (
        <Toast
            message="진료 결과가 도착했습니다"
            subMessage={`${unseenResult.hospital_name} · ${unseenResult.doctor_name}`}
            href={`/projects/eum/patient/summary/${unseenResult.session_id}`}
            onDismiss={handleDismiss}
            isVisible={isVisible}
        />
    );
}
