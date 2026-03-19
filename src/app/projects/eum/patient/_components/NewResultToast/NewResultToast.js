'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../Toast/Toast';
import { getSupabaseBrowser } from '../../_lib/supabaseBrowser';

const STORAGE_KEY = 'eum_seen_results';

// 복합키: session_id + transmitted_at (재전송 시 새 토스트 표시용)
function unseenKey(result) {
    return `${result.session_id}:${result.transmitted_at}`;
}

// localStorage에서 이미 확인한 결과 키 목록 조회
function getSeenResults() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// 결과를 확인 목록에 추가 (복합키: session_id:transmitted_at)
export function markResultAsSeen(sessionId, transmittedAt) {
    try {
        const seen = getSeenResults();
        const key = transmittedAt ? `${sessionId}:${transmittedAt}` : sessionId;
        if (!seen.includes(key)) {
            seen.push(key);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
        }
    } catch {
        // localStorage 불가 시 무시
    }
}

// 서버에서 전달받은 전송 완료된 결과 목록 중
// localStorage에 없는 가장 최신 1건만 토스트로 표시
export default function NewResultToast({ transmittedResults, patientId }) {
    const router = useRouter();
    const [unseenResult, setUnseenResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    // Realtime 구독: 의사가 결과 전송 시 서버 컴포넌트 재실행
    // 환자 필터링은 서버 사이드 fetchTransmittedResults에서 처리
    useEffect(() => {
        const supabase = getSupabaseBrowser();
        if (!supabase) return;
        const channel = supabase
            .channel('new-results')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'consultation_results' },
                () => router.refresh()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);

    // Polling fallback: Realtime이 RLS/publication 미설정으로 실패할 경우 대비
    // 미확인 결과가 없을 때만 8초 간격으로 서버 데이터 새로고침
    useEffect(() => {
        if (unseenResult) return;
        const id = setInterval(() => router.refresh(), 8000);
        return () => clearInterval(id);
    }, [unseenResult, router]);

    useEffect(() => {
        if (!transmittedResults || transmittedResults.length === 0) return;

        const seen = getSeenResults();
        // transmitted_at 기준 최신순 정렬된 상태로 전달됨 → 첫 번째 미확인 결과
        const unseen = transmittedResults.find((r) => !seen.includes(unseenKey(r)));

        if (unseen) {
            setUnseenResult(unseen);
            setIsVisible(true);
        }
    }, [transmittedResults]);

    function handleDismiss() {
        setIsVisible(false);
        if (unseenResult) {
            markResultAsSeen(unseenResult.session_id, unseenResult.transmitted_at);
        }
    }

    if (!unseenResult) return null;

    return (
        <Toast
            message="진료 결과가 도착했습니다"
            subMessage={`${unseenResult.hospital_name} · ${unseenResult.doctor_name}`}
            href={`/projects/eum/patient/${patientId}/summary/${unseenResult.session_id}`}
            onDismiss={handleDismiss}
            isVisible={isVisible}
        />
    );
}
