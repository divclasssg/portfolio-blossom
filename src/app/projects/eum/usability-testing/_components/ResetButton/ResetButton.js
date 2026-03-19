'use client';

import { useState } from 'react';
import styles from './ResetButton.module.scss';

export default function ResetButton() {
    const [status, setStatus] = useState('idle'); // 'idle' | 'resetting' | 'done' | 'error'

    async function handleReset() {
        if (!confirm('이전 UT 데이터를 모두 삭제하고 초기화합니다. 계속할까요?')) return;

        setStatus('resetting');
        try {
            const res = await fetch('/api/eum/reset', { method: 'POST' });
            if (!res.ok) throw new Error('리셋 실패');

            // 클라이언트 쿠키 정리
            document.cookie = 'eum_patient_id=; path=/projects/eum; max-age=0; SameSite=Lax';
            sessionStorage.removeItem('eum_patient_id');
            sessionStorage.removeItem('eum_onboarding');

            setStatus('done');
            // 페이지 새로고침으로 서버 컴포넌트 재렌더
            window.location.reload();
        } catch {
            setStatus('error');
        }
    }

    return (
        <button
            className={styles['reset-button']}
            onClick={handleReset}
            disabled={status === 'resetting'}
            type="button"
        >
            {status === 'resetting' ? '초기화 중...' : 'UT 데이터 초기화'}
        </button>
    );
}
