'use client';

import { useEffect } from 'react';
import { markResultAsSeen } from '../NewResultToast/NewResultToast';

// 상세 페이지 마운트 시 해당 결과를 확인 목록에 기록
export default function MarkResultSeen({ sessionId, transmittedAt }) {
    useEffect(() => {
        markResultAsSeen(sessionId, transmittedAt);
    }, [sessionId, transmittedAt]);

    return null;
}
