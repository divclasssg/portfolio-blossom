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
  const [showBiometrics, setShowBiometrics] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('eum_pin_temp');
    if (!saved) {
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
        setShowBiometrics(true);
      } else {
        setError('PIN 번호가 일치하지 않습니다. 다시 입력해 주세요.');
        setTimeout(() => setPin(''), 600);
      }
    }
  }

  function saveBiometrics(enabled) {
    const existing = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
    sessionStorage.setItem('eum_onboarding', JSON.stringify({ ...existing, biometrics_enabled: enabled }));
    router.push('/projects/eum/patient/onboarding/mydata');
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={5}
        totalSteps={10}
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

      {/* 생체인증 등록 모달 */}
      {showBiometrics && (
        <div
          className={styles['modal-overlay']}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bio-title"
        >
          <div className={styles['modal-card']}>
            <div className={styles['modal-icon']} aria-hidden="true">
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="72" height="72" rx="20" fill="#007AFF" fillOpacity="0.1" />
                <path
                  d="M26 18h-6a2 2 0 0 0-2 2v6M46 18h6a2 2 0 0 1 2 2v6M26 54h-6a2 2 0 0 1-2-2v-6M46 54h6a2 2 0 0 0 2-2v-6"
                  stroke="#007AFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M28 30a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM44 30a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
                  fill="#007AFF"
                />
                <path
                  d="M36 32v5M36 37c-3 0-5 1.5-5 3.5"
                  stroke="#007AFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M28 44c1.5 3 4.5 5 8 5s6.5-2 8-5"
                  stroke="#007AFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 id="bio-title" className={styles['modal-title']}>
              생체 인증을 등록하시겠어요?
            </h2>
            <p className={styles['modal-desc']}>
              Face ID 또는 Touch ID를 사용하면 PIN 없이 빠르게 앱에 접근할 수 있습니다.
              언제든지 설정에서 변경할 수 있어요.
            </p>
            <p className={styles['modal-note']}>
              생체 정보는 기기에만 저장되며, 이음 서버로 전송되지 않습니다.
            </p>
            <div className={styles['modal-footer']}>
              <button
                type="button"
                className={styles['modal-btn-primary']}
                onClick={() => saveBiometrics(true)}
              >
                등록하기
              </button>
              <button
                type="button"
                className={styles['modal-btn-skip']}
                onClick={() => saveBiometrics(false)}
              >
                나중에 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
