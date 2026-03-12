'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HospitalCodeInput.module.scss';

export default function HospitalCodeInput({ validCodes }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  function handleChange(e) {
    // 숫자만 허용, 최대 6자리
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError(false);
  }

  function handleSubmit() {
    if (validCodes.includes(code)) {
      router.push('/projects/eum/patient/checkin/consent');
    } else {
      setError(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <section className={styles['code-section']} aria-labelledby="code-heading">
      <h2 id="code-heading" className={styles['code-label']}>병원 코드로 등록하기</h2>
      <input
        className={`${styles['code-input']} ${error ? styles['code-input-error'] : ''}`}
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-describedby={error ? 'code-error' : undefined}
        aria-invalid={error}
      />
      {error && (
        <p id="code-error" className={styles['error-message']} role="alert">
          {/* ⓘ 아이콘 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1" fill="currentColor" />
          </svg>
          올바른 코드를 입력해주세요.
        </p>
      )}
      <button
        className={styles['submit-btn']}
        type="button"
        onClick={handleSubmit}
      >
        등록하기
      </button>
    </section>
  );
}
