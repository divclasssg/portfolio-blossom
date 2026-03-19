'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CtaButton from '../CtaButton/CtaButton';
import styles from './CheckinActions.module.scss';

export default function CheckinActions({ patientId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleCheckin() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/eum/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId }),
            });
            if (!res.ok) {
                const msg = await res.text();
                console.error('[CheckinActions] 체크인 실패:', msg);
                setError('체크인에 실패했습니다. 다시 시도해 주세요.');
                setLoading(false);
                return;
            }
            router.push(`/projects/eum/patient/${patientId}`);
        } catch (err) {
            console.error('[CheckinActions] 체크인 요청 오류:', err.message);
            setError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
            setLoading(false);
        }
    }

    return (
        <footer className={`footer ${styles['footer']}`}>
            {error && <p className={styles['error-msg']} role="alert">{error}</p>}
            <CtaButton onClick={handleCheckin} disabled={loading}>
                {loading ? '접수 중...' : '체크인'}
            </CtaButton>
            <CtaButton variant="tertiary" onClick={() => router.back()}>
                거절
            </CtaButton>
        </footer>
    );
}
