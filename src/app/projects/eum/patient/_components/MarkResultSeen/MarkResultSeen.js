'use client';

import { useEffect } from 'react';
import { markResultAsSeen } from '../NewResultToast/NewResultToast';

// 상세 페이지 마운트 시 해당 session_id를 확인 목록에 기록
export default function MarkResultSeen({ sessionId }) {
    useEffect(() => {
        markResultAsSeen(sessionId);
    }, [sessionId]);

    return null;
}
