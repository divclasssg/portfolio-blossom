'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../Toast/Toast';
import { getSupabaseBrowser } from '../../_lib/supabaseBrowser';

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
export default function NewResultToast({ transmittedResults, patientId }) {
    const router = useRouter();
    const [unseenResult, setUnseenResult] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    // Realtime 구독: 의사가 결과 전송 시 해당 환자만 서버 컴포넌트 재실행
    useEffect(() => {
        const supabase = getSupabaseBrowser();
        if (!supabase) return; // 환경 변수 누락 시 Realtime 구독 스킵
        const channel = supabase
            .channel('new-results')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'consultation_results' },
                async (payload) => {
                    // session_id로 해당 세션의 patient_id 확인
                    const sessionId = payload.new?.session_id;
                    if (!sessionId) { router.refresh(); return; }
                    try {
                        const { data } = await supabase
                            .from('sessions')
                            .select('patient_id')
                            .eq('id', sessionId)
                            .maybeSingle();
                        if (data?.patient_id === patientId) {
                            router.refresh();
                        }
                    } catch {
                        // 조회 실패 시 안전하게 새로고침
                        router.refresh();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router, patientId]);

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
            href={`/projects/eum/patient/${patientId}/summary/${unseenResult.session_id}`}
            onDismiss={handleDismiss}
            isVisible={isVisible}
        />
    );
}
