'use client';

import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      <OnboardingAppBar variant="logo" />
      <main className={styles['page']}>
        <section className={styles['hero']} aria-labelledby="welcome-title">
          <div className={styles['logo-mark']} aria-hidden="true">
            <span className={styles['logo-text']}>이음</span>
          </div>
          <h1 id="welcome-title" className={styles['title']}>
            나의 건강 이야기를<br />의료진에게 이어줍니다
          </h1>
          <ul className={styles['features']} aria-label="주요 기능">
            <li className={styles['feature-item']}>
              <span className={styles['feature-icon']} aria-hidden="true">📋</span>
              <span>증상을 기록하고 패턴을 파악해요</span>
            </li>
            <li className={styles['feature-item']}>
              <span className={styles['feature-icon']} aria-hidden="true">🏥</span>
              <span>의료진에게 건강 정보를 안전하게 전달해요</span>
            </li>
            <li className={styles['feature-item']}>
              <span className={styles['feature-icon']} aria-hidden="true">🤝</span>
              <span>더 나은 진료를 위한 소통을 도와드려요</span>
            </li>
          </ul>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => router.push('/projects/eum/patient/onboarding/sandbox')}
          >
            시작하기
          </button>
        </div>
      </main>
    </>
  );
}
