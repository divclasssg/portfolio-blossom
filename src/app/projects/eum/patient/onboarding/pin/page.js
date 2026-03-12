'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import PinPad from '../../../_components/PinPad/PinPad';
import styles from './page.module.scss';

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');

  function handleChange(value) {
    setPin(value);
    // 6자리 입력 완료 시 자동으로 다음 화면 이동
    if (value.length === 6) {
      // pin-confirm 페이지로 값 전달 (sessionStorage 사용)
      sessionStorage.setItem('eum_pin_temp', value);
      router.push('/projects/eum/patient/onboarding/pin-confirm');
    }
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={5}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/phone"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="pin-title">
          <h1 id="pin-title" className={styles['title']}>
            PIN 번호를 설정해 주세요
          </h1>
          <p className={styles['subtitle']}>
            앱 잠금 해제에 사용할 6자리 PIN을 입력해 주세요.
          </p>
        </section>

        <PinPad value={pin} onChange={handleChange} maxLength={6} />
      </main>
    </>
  );
}
