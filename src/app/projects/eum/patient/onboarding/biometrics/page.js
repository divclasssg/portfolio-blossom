'use client';

import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function BiometricsPage() {
  const router = useRouter();

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={7}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/pin-confirm"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="biometrics-title">
          <div className={styles['icon']} aria-hidden="true">
            {/* Face ID 아이콘 (SVG) */}
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
          <h1 id="biometrics-title" className={styles['title']}>
            생체 인증을 등록하시겠어요?
          </h1>
          <p className={styles['desc']}>
            Face ID 또는 Touch ID를 사용하면 PIN 없이 빠르게 앱에 접근할 수 있습니다.
            언제든지 설정에서 변경할 수 있어요.
          </p>
          <p className={styles['note']}>
            생체 정보는 기기에만 저장되며, 이음 서버로 전송되지 않습니다.
          </p>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => router.push('/projects/eum/patient/onboarding/mydata')}
          >
            등록하기
          </button>
          <button
            type="button"
            className={styles['btn-skip']}
            onClick={() => router.push('/projects/eum/patient/onboarding/mydata')}
          >
            나중에 하기
          </button>
        </div>
      </main>
    </>
  );
}
