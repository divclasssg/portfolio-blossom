'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

const SLIDES = [
  {
    icon: '📝',
    title: '증상을 기록해요',
    desc: '매일의 증상을 텍스트로 기록하면 AI가 패턴을 분석합니다. 언제, 어떤 상황에서 증상이 생기는지 파악할 수 있어요.',
  },
  {
    icon: '📊',
    title: '건강 데이터를 연결해요',
    desc: '건강보험공단 의료 마이데이터와 웨어러블 기기를 연동해 더 풍부한 건강 정보를 관리할 수 있어요.',
  },
  {
    icon: '🏥',
    title: '의료진에게 전달해요',
    desc: '분석된 건강 정보를 담당 의료진에게 안전하게 전달합니다. 진료 시간을 더 효율적으로 활용할 수 있어요.',
  },
];

export default function SandboxPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  function handleNext() {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      router.push('/projects/eum/patient/onboarding/consents');
    }
  }

  const slide = SLIDES[current];

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={1}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/welcome"
      />
      <main className={styles['page']}>
        {/* 캐러셀 */}
        <section
          className={styles['carousel']}
          aria-label={`기능 소개 ${current + 1}/${SLIDES.length}`}
          aria-live="polite"
        >
          <div className={styles['slide']}>
            <div className={styles['slide-icon']} aria-hidden="true">
              {slide.icon}
            </div>
            <h1 className={styles['slide-title']}>{slide.title}</h1>
            <p className={styles['slide-desc']}>{slide.desc}</p>
          </div>

          {/* 페이지 인디케이터 */}
          <div className={styles['indicators']} role="tablist" aria-label="슬라이드 위치">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`${i + 1}번째 슬라이드`}
                className={[
                  styles['dot'],
                  i === current ? styles['dot-active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={handleNext}
          >
            {current < SLIDES.length - 1 ? '다음' : '시작할게요'}
          </button>
        </div>
      </main>
    </>
  );
}
