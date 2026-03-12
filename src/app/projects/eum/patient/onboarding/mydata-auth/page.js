'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function MydataAuthPage() {
  const router = useRouter();
  const [residentFront, setResidentFront] = useState('');
  const [authMethod, setAuthMethod] = useState('cert');
  const [loading, setLoading] = useState(false);

  function handleAuth() {
    setLoading(true);
    // 포트폴리오 목업: 1.5초 후 인증 성공 처리
    setTimeout(() => {
      setLoading(false);
      router.push('/projects/eum/patient/onboarding/wearable');
    }, 1500);
  }

  const isValid = residentFront.replace(/\D/g, '').length === 6;

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={9}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/mydata"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="mydata-auth-title">
          <div className={styles['org-badge']} aria-hidden="true">
            <span className={styles['org-text']}>건강보험공단</span>
          </div>
          <h1 id="mydata-auth-title" className={styles['title']}>
            건강보험공단 인증
          </h1>
          <p className={styles['subtitle']}>
            본인 확인 후 의료 마이데이터를 연동합니다.
          </p>

          {/* 주민번호 앞자리 */}
          <div className={styles['field-group']}>
            <label htmlFor="resident-input" className={styles['label']}>
              주민등록번호 앞 6자리
            </label>
            <input
              id="resident-input"
              type="text"
              inputMode="numeric"
              className={styles['input']}
              value={residentFront}
              onChange={(e) =>
                setResidentFront(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="생년월일 6자리"
              maxLength={6}
              aria-describedby="resident-hint"
            />
            <span id="resident-hint" className={styles['hint']}>
              예: 920514 (1992년 5월 14일생)
            </span>
          </div>

          {/* 인증 방법 선택 */}
          <div className={styles['field-group']}>
            <span className={styles['label']} id="auth-method-label">
              인증 방법
            </span>
            <div
              className={styles['auth-methods']}
              role="radiogroup"
              aria-labelledby="auth-method-label"
            >
              {[
                { value: 'cert', label: '공동인증서' },
                { value: 'pass', label: 'PASS 앱 인증' },
                { value: 'kakao', label: '카카오 인증' },
              ].map((method) => (
                <label key={method.value} className={styles['auth-option']}>
                  <input
                    type="radio"
                    name="auth-method"
                    value={method.value}
                    checked={authMethod === method.value}
                    onChange={() => setAuthMethod(method.value)}
                    className={styles['radio']}
                  />
                  <span className={styles['auth-option-label']}>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <p className={styles['mock-note']}>
            포트폴리오 목업: 실제 인증 없이 진행됩니다.
          </p>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            disabled={!isValid || loading}
            onClick={handleAuth}
            aria-busy={loading}
          >
            {loading ? '인증 중...' : '인증하기'}
          </button>
        </div>
      </main>
    </>
  );
}
