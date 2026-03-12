'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

// 목업: 테스트용 인증번호 고정
const MOCK_CODE = '123456';

export default function PhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  function formatPhone(value) {
    // 숫자만 추출 후 010-XXXX-XXXX 포맷
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(e) {
    setPhone(formatPhone(e.target.value));
    setCodeSent(false);
    setCode('');
    setCodeError('');
  }

  function handleSendCode() {
    setCodeSent(true);
    setCode('');
    setCodeError('');
  }

  function handleVerify() {
    if (code === MOCK_CODE) {
      router.push('/projects/eum/patient/onboarding/pin');
    } else {
      setCodeError('인증번호가 올바르지 않습니다. 다시 확인해 주세요.');
    }
  }

  const isPhoneValid = phone.replace(/\D/g, '').length === 11;

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={4}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/optional-consents"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="phone-title">
          <h1 id="phone-title" className={styles['title']}>
            휴대폰 번호를<br />입력해 주세요
          </h1>

          {/* 휴대폰 번호 입력 */}
          <div className={styles['field-group']}>
            <label htmlFor="phone-input" className={styles['label']}>
              휴대폰 번호
            </label>
            <div className={styles['input-row']}>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                className={styles['input']}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                aria-describedby="phone-hint"
                autoComplete="tel"
              />
              <button
                type="button"
                className={styles['btn-send']}
                disabled={!isPhoneValid}
                onClick={handleSendCode}
              >
                {codeSent ? '재발송' : '인증번호 발송'}
              </button>
            </div>
            <span id="phone-hint" className={styles['hint']}>
              {codeSent
                ? '인증번호가 발송되었습니다. (포트폴리오 목업: 123456)'
                : '가입 및 본인 확인에 사용됩니다.'}
            </span>
          </div>

          {/* 인증번호 입력 */}
          {codeSent && (
            <div className={styles['field-group']}>
              <label htmlFor="code-input" className={styles['label']}>
                인증번호
              </label>
              <input
                id="code-input"
                type="text"
                inputMode="numeric"
                className={[
                  styles['input'],
                  codeError ? styles['input-error'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setCodeError('');
                }}
                placeholder="인증번호 6자리"
                maxLength={6}
                aria-describedby={codeError ? 'code-error' : undefined}
                aria-invalid={!!codeError}
              />
              {codeError && (
                <span id="code-error" className={styles['error']} role="alert">
                  {codeError}
                </span>
              )}
            </div>
          )}
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            disabled={!codeSent || code.length !== 6}
            onClick={handleVerify}
          >
            확인
          </button>
        </div>
      </main>
    </>
  );
}
