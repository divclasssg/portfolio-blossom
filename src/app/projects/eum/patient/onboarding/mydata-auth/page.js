'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

function validateResident(digits) {
  const mm = parseInt(digits.slice(2, 4));
  const dd = parseInt(digits.slice(4, 6));
  if (mm < 1 || mm > 12) return '유효하지 않은 날짜입니다.';
  if (dd < 1 || dd > 31) return '유효하지 않은 날짜입니다.';
  return '';
}

// 뒷자리 첫 번째 숫자로 성별 판별
// 1,3,5,7 → 남성 / 2,4,6,8 → 여성 / 0,9 → 판별 불가
function deriveGender(digit) {
  const n = parseInt(digit);
  if ([1, 3, 5, 7].includes(n)) return 'male';
  if ([2, 4, 6, 8].includes(n)) return 'female';
  return null;
}

export default function MydataAuthPage() {
  const router = useRouter();
  const [residentFront, setResidentFront] = useState('');
  const [residentBack1, setResidentBack1] = useState('');
  const [residentError, setResidentError] = useState('');
  const [authMethod, setAuthMethod] = useState('cert');
  const [loading, setLoading] = useState(false);

  function handleAuth() {
    setLoading(true);
    // 포트폴리오 목업: 1.5초 후 인증 성공 처리
    setTimeout(() => {
      setLoading(false);
      const existing = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
      sessionStorage.setItem(
        'eum_onboarding',
        JSON.stringify({
          ...existing,
          resident_front: residentFront,
          gender_code: residentBack1,
          gender: deriveGender(residentBack1),
        }),
      );
      router.push('/projects/eum/patient/onboarding/wearable');
    }, 1500);
  }

  function handleResidentChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setResidentFront(digits);
    if (digits.length === 6) {
      setResidentError(validateResident(digits));
    } else {
      setResidentError('');
    }
  }

  const isValid = residentFront.replace(/\D/g, '').length === 6 && residentBack1.length === 1 && !residentError;

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={8}
        totalSteps={10}
        backHref="/projects/eum/patient/onboarding/mydata-items"
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

          {/* 주민등록번호 */}
          <div className={styles['field-group']}>
            <span className={styles['label']} id="resident-label">주민등록번호</span>
            <div className={styles['resident-row']} role="group" aria-labelledby="resident-label">
              <input
                id="resident-input"
                type="text"
                inputMode="numeric"
                className={[styles['input'], residentError ? styles['input-error'] : ''].filter(Boolean).join(' ')}
                value={residentFront}
                onChange={handleResidentChange}
                placeholder="생년월일 6자리"
                maxLength={6}
                aria-label="주민등록번호 앞 6자리"
                aria-invalid={!!residentError}
              />
              <span className={styles['resident-sep']} aria-hidden="true">-</span>
              <div className={styles['resident-back']}>
                <input
                  type="text"
                  inputMode="numeric"
                  className={styles['input-back1']}
                  value={residentBack1}
                  onChange={(e) => setResidentBack1(e.target.value.replace(/\D/g, '').slice(0, 1))}
                  placeholder="0"
                  maxLength={1}
                  aria-label="주민등록번호 뒤 첫 번째 자리 (성별 구분)"
                />
                <span className={styles['resident-mask']} aria-hidden="true">●●●●●●</span>
              </div>
            </div>
            {residentError ? (
              <span id="resident-error" className={styles['error']} role="alert">{residentError}</span>
            ) : (
              <span id="resident-hint" className={styles['hint']}>
                예: 920514 – 1 (1992년생 남성)
              </span>
            )}
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
