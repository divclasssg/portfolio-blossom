'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

// 포트폴리오 목업: 고정 인증번호
const MOCK_CODE = '123456';

function formatDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function isValidDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function PersonalInfoPage() {
  const router = useRouter();
  // phase 0: 이름만, phase 1: +생년월일, phase 2: +휴대폰 인증
  const [phase, setPhase] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthError, setBirthError] = useState('');
  const [phone, setPhone] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  // 이름 blur → phase 1 진입
  function handleNameBlur() {
    if (name.trim().length > 0 && phase === 0) {
      setPhase(1);
    }
  }

  // 이름 Enter → phase 1 진입
  function handleNameKeyDown(e) {
    if (e.key === 'Enter' && name.trim().length > 0 && phase === 0) {
      setPhase(1);
    }
  }

  function handleBirthDateChange(e) {
    const formatted = formatDate(e.target.value);
    setBirthDate(formatted);
    setBirthError('');
    if (formatted.length === 10 && phase === 1) {
      if (!isValidDate(formatted)) {
        setBirthError('유효하지 않은 날짜입니다. YYYY-MM-DD 형식으로 입력해 주세요.');
        return;
      }
      setPhase(2);
    }
  }

  // 생년월일 Enter → phase 2 진입
  function handleBirthDateKeyDown(e) {
    if (e.key === 'Enter' && birthDate.length === 10 && phase === 1) {
      if (!isValidDate(birthDate)) {
        setBirthError('유효하지 않은 날짜입니다. YYYY-MM-DD 형식으로 입력해 주세요.');
        return;
      }
      setPhase(2);
    }
  }

  const [phoneError, setPhoneError] = useState('');

  function handlePhoneChange(e) {
    setPhone(formatPhone(e.target.value));
    setCodeSent(false);
    setCode('');
    setCodeError('');
    setPhoneError('');
  }

  function handlePhoneBlur() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 0) return;
    if (digits.length < 11 || !/^01[016789]/.test(digits)) {
      setPhoneError('유효한 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)');
    }
  }

  function handleSendCode() {
    setCodeSent(true);
    setCode('');
    setCodeError('');
    setCooldown(30);
  }

  // 인증 성공 시 저장 후 pin으로 자동 이동
  function handleVerify() {
    if (code === MOCK_CODE) {
      const existing = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
      sessionStorage.setItem(
        'eum_onboarding',
        JSON.stringify({ ...existing, name: name.trim(), birth_date: birthDate, phone }),
      );
      router.push('/projects/eum/patient/onboarding/pin');
    } else {
      setCodeError('인증번호가 올바르지 않습니다. 다시 확인해 주세요.');
    }
  }

  // 한국 휴대폰 번호: 11자리 + 010/011/016/017/018/019 접두사
  const isPhoneValid =
    phone.replace(/\D/g, '').length === 11 &&
    /^01[016789]/.test(phone.replace(/\D/g, ''));

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={3}
        totalSteps={10}
        backHref="/projects/eum/patient/onboarding/consents"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="personal-info-title">
          <h1 id="personal-info-title" className={styles['title']}>
            기본 정보를<br />입력해 주세요
          </h1>
          <p className={styles['subtitle']}>
            서비스 이용 및 의료진 소통에 사용됩니다. 언제든지 변경할 수 있어요.
          </p>

          {/* 이름 */}
          <div className={styles['field-group']}>
            <label htmlFor="name-input" className={styles['label']}>
              이름
            </label>
            <input
              id="name-input"
              type="text"
              className={styles['input']}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              placeholder="이름을 입력해 주세요"
              autoComplete="name"
              aria-required="true"
            />
          </div>

          {/* 생년월일 — phase 1 이상에서 표시 */}
          {phase >= 1 && (
            <div className={[styles['field-group'], styles['field-animated']].join(' ')}>
              <label htmlFor="birth-date-input" className={styles['label']}>
                생년월일
              </label>
              <input
                id="birth-date-input"
                type="text"
                inputMode="numeric"
                className={[styles['input'], birthError ? styles['input-error'] : ''].filter(Boolean).join(' ')}
                value={birthDate}
                onChange={handleBirthDateChange}
                onKeyDown={handleBirthDateKeyDown}
                placeholder="YYYY-MM-DD"
                aria-required="true"
                aria-invalid={!!birthError}
                aria-describedby={birthError ? 'birth-error' : undefined}
                autoFocus
              />
              {birthError && (
                <span id="birth-error" className={styles['error']} role="alert">{birthError}</span>
              )}
            </div>
          )}

          {/* 휴대폰 인증 — phase 2 이상에서 표시 */}
          {phase >= 2 && (
            <div className={styles['field-animated']}>
              {/* 휴대폰 번호 */}
              <div className={styles['field-group']}>
                <label htmlFor="phone-input" className={styles['label']}>
                  휴대폰 번호
                </label>
                <div className={styles['input-row']}>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    className={[styles['input'], phoneError ? styles['input-error'] : ''].filter(Boolean).join(' ')}
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isPhoneValid) handleSendCode();
                    }}
                    placeholder="010-0000-0000"
                    autoComplete="tel"
                    autoFocus
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? 'phone-error' : 'phone-hint'}
                  />
                  <button
                    type="button"
                    className={styles['btn-send']}
                    disabled={!isPhoneValid || cooldown > 0}
                    onClick={handleSendCode}
                  >
                    {cooldown > 0 ? `재발송 (${cooldown}초)` : codeSent ? '재발송' : '인증번호 발송'}
                  </button>
                </div>
                {phoneError ? (
                  <span id="phone-error" className={styles['error']} role="alert">{phoneError}</span>
                ) : (
                  <span id="phone-hint" className={styles['hint']}>
                    {codeSent
                      ? '인증번호가 발송되었습니다. (포트폴리오 목업: 123456)'
                      : '가입 및 본인 확인에 사용됩니다.'}
                  </span>
                )}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && code.length === 6) handleVerify();
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

              {/* 인증 확인 */}
              {codeSent && (
                <button
                  type="button"
                  className={styles['btn-primary']}
                  disabled={code.length !== 6}
                  onClick={handleVerify}
                >
                  확인
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
