'use client';

import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function CompletePage() {
  const router = useRouter();

  return (
    <>
      <OnboardingAppBar variant="logo" />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="complete-title">
          <div className={styles['check-icon']} aria-hidden="true">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="36" cy="36" r="36" fill="#007AFF" />
              <path
                d="M22 36l10 10 18-20"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 id="complete-title" className={styles['title']}>
            준비가 완료되었어요!
          </h1>
          <p className={styles['desc']}>
            이음과 함께 건강한 하루를 시작해 보세요.
            증상을 기록하고, 담당 의료진과 더 잘 소통할 수 있어요.
          </p>

          {/* 요약 카드 */}
          <div className={styles['summary-card']}>
            <ul className={styles['summary-list']} aria-label="설정 완료 항목">
              <li className={styles['summary-item']}>
                <span className={styles['summary-icon']} aria-hidden="true">✓</span>
                <span>서비스 약관 및 개인정보 처리 동의</span>
              </li>
              <li className={styles['summary-item']}>
                <span className={styles['summary-icon']} aria-hidden="true">✓</span>
                <span>본인 인증 완료</span>
              </li>
              <li className={styles['summary-item']}>
                <span className={styles['summary-icon']} aria-hidden="true">✓</span>
                <span>PIN 번호 설정</span>
              </li>
              <li className={styles['summary-item']}>
                <span className={styles['summary-icon']} aria-hidden="true">✓</span>
                <span>기본 건강 정보 입력</span>
              </li>
            </ul>
          </div>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => router.push('/projects/eum/patient')}
          >
            이음 시작하기
          </button>
        </div>
      </main>
    </>
  );
}
