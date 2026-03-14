'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import PinPad from '../../../_components/PinPad/PinPad';
import styles from './page.module.scss';

// 포트폴리오 목업: 고정 PIN
const MOCK_PIN = '123456';
const ADMIN_PIN = '147852';

export default function LoginPinPage() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleChange(value) {
        if (loading) return;
        setPin(value);
        setError('');

        if (value.length === 6) {
            if (value === ADMIN_PIN) {
                setLoading(true);
                try {
                    const res = await fetch('/api/eum/admin/seed', { method: 'POST' });
                    if (!res.ok) {
                        const body = await res.json().catch(() => ({}));
                        throw new Error(body.error || '시드 API 오류');
                    }
                    document.cookie =
                        'eum_patient_id=pat_admin_001; max-age=86400; path=/projects/eum; SameSite=Lax';
                    router.push('/projects/eum/patient');
                } catch {
                    setError('관리자 데이터 초기화에 실패했습니다.');
                    setTimeout(() => setPin(''), 600);
                    setLoading(false);
                }
            } else if (value === MOCK_PIN) {
                router.push('/projects/eum/patient');
            } else {
                setError('PIN 번호가 올바르지 않습니다. 다시 확인해 주세요.');
                setTimeout(() => setPin(''), 600);
            }
        }
    }

    return (
        <>
            <OnboardingAppBar variant="logo" />
            <main className={`page ${styles.page}`}>
                <section className={`content ${styles.content}`} aria-labelledby="login-pin-title">
                    <h1 id="login-pin-title" className="title">
                        PIN 번호를 입력해 주세요
                    </h1>
                    {error ? (
                        <p className={`error ${styles.error}`} role="alert" aria-live="assertive">
                            {error}
                        </p>
                    ) : (
                        <p className={`subtitle ${styles.subtitle}`}>등록된 6자리 PIN을 입력해 주세요.</p>
                    )}
                </section>

                <PinPad value={pin} onChange={handleChange} maxLength={6} />
            </main>
        </>
    );
}
