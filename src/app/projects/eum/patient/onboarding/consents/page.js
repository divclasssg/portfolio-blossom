'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

// 필수 동의 항목
const REQUIRED_ITEMS = [
  {
    id: 'privacy',
    label: '개인정보 처리방침 동의',
    required: true,
    detail: '수집 항목: 이름, 연락처, 건강 정보 등',
  },
  {
    id: 'terms',
    label: '서비스 이용약관 동의',
    required: true,
    detail: '이음 서비스 이용에 관한 약관',
  },
  {
    id: 'sensitive',
    label: '민감정보(건강) 처리 동의',
    required: true,
    detail: '질환, 증상, 투약 이력 등 건강 관련 민감정보 처리',
  },
  {
    id: 'location',
    label: '위치정보 이용 동의',
    required: true,
    detail: '가까운 병원 찾기 기능에 활용',
  },
];

export default function ConsentsPage() {
  const router = useRouter();
  const [checked, setChecked] = useState({
    privacy: false,
    terms: false,
    sensitive: false,
    location: false,
  });

  const allChecked = Object.values(checked).every(Boolean);

  function handleAll(e) {
    const val = e.target.checked;
    setChecked({ privacy: val, terms: val, sensitive: val, location: val });
  }

  function handleItem(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={2}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/sandbox"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="consent-title">
          <h1 id="consent-title" className={styles['title']}>
            서비스 이용을 위한<br />필수 동의
          </h1>
          <p className={styles['subtitle']}>
            아래 항목에 모두 동의해야 서비스를 이용할 수 있습니다.
          </p>

          {/* 전체 동의 */}
          <label className={styles['all-item']}>
            <input
              type="checkbox"
              className={styles['checkbox']}
              checked={allChecked}
              onChange={handleAll}
              aria-label="필수 항목 전체 동의"
            />
            <span className={styles['all-label']}>전체 동의</span>
          </label>

          <hr className={styles['divider']} />

          {/* 개별 항목 */}
          <ul className={styles['list']}>
            {REQUIRED_ITEMS.map((item) => (
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
                      <span className={styles['required-badge']} aria-label="필수">필수</span>
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
            disabled={!allChecked}
            onClick={() => router.push('/projects/eum/patient/onboarding/optional-consents')}
          >
            동의하고 계속하기
          </button>
        </div>
      </main>
    </>
  );
}
