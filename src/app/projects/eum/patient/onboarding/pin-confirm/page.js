'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import PinPad from '../../../_components/PinPad/PinPad';
import styles from './page.module.scss';

export default function PinConfirmPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [originalPin, setOriginalPin] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('eum_pin_temp');
    if (!saved) {
      // 이전 화면에서 직접 접근한 경우 처음으로 돌아감
      router.replace('/projects/eum/patient/onboarding/pin');
    } else {
      setOriginalPin(saved);
    }
  }, [router]);

  function handleChange(value) {
    setPin(value);
    setError('');

    if (value.length === 6) {
      if (value === originalPin) {
        sessionStorage.removeItem('eum_pin_temp');
        router.push('/projects/eum/patient/onboarding/biometrics');
      } else {
        setError('PIN 번호가 일치하지 않습니다. 다시 입력해 주세요.');
        // 잠깐 후 입력 초기화
        setTimeout(() => setPin(''), 600);
      }
    }
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={6}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/pin"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="pin-confirm-title">
          <h1 id="pin-confirm-title" className={styles['title']}>
            PIN 번호를 한 번 더<br />입력해 주세요
          </h1>
          {error ? (
            <p className={styles['error']} role="alert" aria-live="assertive">
              {error}
            </p>
          ) : (
            <p className={styles['subtitle']}>
              앞서 입력한 PIN 번호와 동일하게 입력하세요.
            </p>
          )}
        </section>

        <PinPad value={pin} onChange={handleChange} maxLength={6} />
      </main>
    </>
  );
}
