'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CtaButton from '../CtaButton/CtaButton';
import styles from './CheckinActions.module.scss';

export default function CheckinActions({ patientId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCheckin() {
        setLoading(true);
        try {
            const res = await fetch('/api/eum/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId }),
            });
            if (!res.ok) {
                console.error('[CheckinActions] 체크인 실패:', await res.text());
            }
        } catch (err) {
            console.error('[CheckinActions] 체크인 요청 오류:', err.message);
        }
        router.push(`/projects/eum/patient/${patientId}`);
    }

    return (
        <footer className={`footer ${styles['footer']}`}>
            <CtaButton onClick={handleCheckin} disabled={loading}>
                {loading ? '접수 중...' : '체크인'}
            </CtaButton>
            <CtaButton variant="tertiary" onClick={() => router.back()}>
                거절
            </CtaButton>
        </footer>
    );
}
