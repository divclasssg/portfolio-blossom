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
  const [showNotice, setShowNotice] = useState(false);

  function handleNext() {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      // 마지막 슬라이드 → 실증특례 고지 모달 표시
      setShowNotice(true);
    }
  }

  const slide = SLIDES[current];

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={1}
        totalSteps={10}
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

          <p className={styles['slide-counter']} aria-hidden="true">
            {current + 1} / {SLIDES.length}
          </p>
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

      {/* 실증특례 이용자 고지 모달 */}
      {showNotice && (
        <div
          className={styles['overlay']}
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-title"
        >
          <div className={styles['notice-card']}>
            <h2 id="notice-title" className={styles['notice-title']}>
              실증특례 이용자 고지
            </h2>

            <div className={styles['notice-body']}>
              <p className={styles['notice-service']}>
                마이데이터 기반 맞춤형 만성질환 및 중증이환 예방·관리 서비스(이음)
              </p>
              <p className={styles['notice-org']}>이음 의료 컨소시엄</p>

              <p className={styles['notice-section']}>1. 규제특례 내용</p>
              <p className={styles['notice-item']}>ㅇ 주요내용: 마이데이터 기반 맞춤형 만성질환 및 중증이환 예방·관리 서비스</p>
              <p className={styles['notice-item']}>ㅇ 유효기간: 사업 개시일로부터 2026.3.13.까지</p>

              <p className={styles['notice-section']}>2. 규제특례 구역, 기간, 규모</p>
              <p className={styles['notice-item']}>ㅇ 구역: 전국</p>
              <p className={styles['notice-item']}>ㅇ 기간: 1년 내외 (사업 개시일로부터 2026.3.13.까지)</p>
              <p className={styles['notice-item']}>ㅇ 규모: 서비스 이용자 500명 내외</p>

              <p className={styles['notice-section']}>3. 법 제10조의3 제7항의 안정성 등 확보 조건</p>
              <p className={styles['notice-item']}>
                ㅇ「개인정보보호법 시행령」시행 이전에는 전송요구서가 아닌「의료법 시행규칙」서식의 동의서 및 위임장 제출 필요
              </p>
              <p className={styles['notice-subitem']}>
                - 동의서 및 위임장 서식을 법인에 맞게 변경 필요 (신청인 및 위임인 성명, 생년월일을 법인명, 사업자번호로 변경 필요)
              </p>
              <p className={styles['notice-subitem']}>
                - 해당 정보 제공 시마다 환자에게 별도 통보 필요
              </p>
              <p className={styles['notice-item']}>
                ㅇ「개인정보보호법 시행령」개정을 통해 전송요구권 관련 세부 절차 마련 시, 제도 시행일로부터 1년 이내에 법 제35조의3 제2항에 따른 지정 요건을 갖추어 개인정보관리 전문기관으로 지정받아야 하며, 해당 기간 이내에 개인정보관리 전문기관으로 지정을 받지 아니한 자는 개인정보관리 관련 업무를 중단하여야 함
              </p>

              <p className={styles['notice-section']}>4. 개인정보 처리 관련 안내</p>
              <p className={styles['notice-item']}>
                ㅇ 본 서비스는 「개인정보 보호법」제39조의3에 따른 실증특례로 운영되며, 수집된 건강 데이터는 서비스 목적 외 활용되지 않습니다.
              </p>
              <p className={styles['notice-item']}>
                ㅇ 이용자는 언제든지 데이터 제공 동의를 철회할 수 있으며, 철회 시 수집된 데이터는 즉시 파기됩니다.
              </p>
            </div>

            <div className={styles['notice-footer']}>
              <button
                type="button"
                className={styles['btn-cancel']}
                onClick={() => setShowNotice(false)}
              >
                취소
              </button>
              <button
                type="button"
                className={styles['btn-confirm']}
                onClick={() => router.push('/projects/eum/patient/onboarding/consents')}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
