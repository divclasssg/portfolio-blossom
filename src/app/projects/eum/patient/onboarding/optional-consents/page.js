'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

const OPTIONAL_ITEMS = [
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의',
    detail: '이메일, 앱 알림을 통한 이음 소식 및 이벤트 안내',
  },
  {
    id: 'research',
    label: '건강 데이터 연구 활용 동의',
    detail: '익명화된 건강 데이터를 의료 연구 목적으로 활용 (개인 식별 불가)',
  },
  {
    id: 'improvement',
    label: '서비스 개선 데이터 활용 동의',
    detail: '앱 사용 패턴 분석을 통한 서비스 품질 개선',
  },
];

export default function OptionalConsentsPage() {
  const router = useRouter();
  const [checked, setChecked] = useState({
    marketing: false,
    research: false,
    improvement: false,
  });

  function handleItem(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={3}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/consents"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="opt-consent-title">
          <h1 id="opt-consent-title" className={styles['title']}>
            선택 동의 항목
          </h1>
          <p className={styles['subtitle']}>
            동의하지 않아도 서비스를 이용할 수 있습니다.
          </p>

          <ul className={styles['list']}>
            {OPTIONAL_ITEMS.map((item) => (
              <li key={item.id}>
                <label className={styles['item']}>
                  <input
                    type="checkbox"
                    className={styles['checkbox']}
                    checked={checked[item.id]}
                    onChange={() => handleItem(item.id)}
                    aria-label={item.label}
                  />
                  <div className={styles['item-text']}>
                    <span className={styles['item-label']}>
                      <span className={styles['optional-badge']} aria-label="선택">선택</span>
                      {item.label}
                    </span>
                    <span className={styles['item-detail']}>{item.detail}</span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            onClick={() => router.push('/projects/eum/patient/onboarding/phone')}
          >
            다음
          </button>
          <button
            type="button"
            className={styles['btn-skip']}
            onClick={() => router.push('/projects/eum/patient/onboarding/phone')}
          >
            건너뛰기
          </button>
        </div>
      </main>
    </>
  );
}
