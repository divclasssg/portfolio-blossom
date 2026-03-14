'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import PinPad from '../../../_components/PinPad/PinPad';
import styles from './page.module.scss';

function isWeakPin(pin) {
    // 같은 숫자 3번 이상 연속 (예: 111234, 555123)
    if (/(.)\1\1/.test(pin)) return true;
    // 연속 3자리 오름/내림차순 (예: 123456, 321098)
    for (let i = 0; i < pin.length - 2; i++) {
        const a = parseInt(pin[i]);
        const b = parseInt(pin[i + 1]);
        const c = parseInt(pin[i + 2]);
        if (b === a + 1 && c === b + 1) return true;
        if (b === a - 1 && c === b - 1) return true;
    }
    return false;
}

export default function PinPage() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');

    function handleChange(value) {
        setPin(value);
        if (value.length < 6) {
            setPinError('');
            return;
        }
        if (isWeakPin(value)) {
            setPinError('같은 숫자나 연속된 숫자를 3개 이상 사용할 수 없어요.');
            setTimeout(() => {
                setPin('');
                setPinError('');
            }, 800);
        } else {
            sessionStorage.setItem('eum_pin_temp', value);
            router.push('/projects/eum/patient/onboarding/pin-confirm');
        }
    }

    return (
        <>
            <OnboardingAppBar
                variant="progress"
                step={4}
                totalSteps={10}
                backHref="/projects/eum/patient/onboarding/personal-info"
            />
            <main className={styles['page']}>
                <section className={styles['content']} aria-labelledby="pin-title">
                    <h1 id="pin-title" className={styles['title']}>
                        PIN 번호를 설정해 주세요
                    </h1>
                    <p className={styles['subtitle']}>
                        앱 잠금 해제에 사용할 6자리 PIN을 입력해 주세요.
                    </p>
                    {pinError ? (
                        <p className={styles['error']} role="alert">
                            {pinError}
                        </p>
                    ) : (
                        <p className={styles['hint']}>
                            같은 숫자나 연속된 숫자를 3개 이상 사용할 수 없어요.
                        </p>
                    )}
                </section>

                <PinPad value={pin} onChange={handleChange} maxLength={6} />
            </main>
        </>
    );
}
