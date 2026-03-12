'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

// 01_patient_profile.json 기준 기본값
const DEFAULT_HEIGHT = '163';
const DEFAULT_WEIGHT = '52';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', '모름'];

export default function HealthInfoPage() {
  const router = useRouter();
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [weight, setWeight] = useState(DEFAULT_WEIGHT);
  const [bloodType, setBloodType] = useState('');

  const isValid = height.length > 0 && weight.length > 0;

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={11}
        totalSteps={11}
        backHref="/projects/eum/patient/onboarding/wearable"
      />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="health-info-title">
          <h1 id="health-info-title" className={styles['title']}>
            기본 건강 정보를<br />입력해 주세요
          </h1>
          <p className={styles['subtitle']}>
            더 정확한 분석을 위해 활용됩니다. 언제든지 변경할 수 있어요.
          </p>

          {/* 키 */}
          <div className={styles['field-group']}>
            <label htmlFor="height-input" className={styles['label']}>
              키 (cm)
            </label>
            <div className={styles['input-unit-row']}>
              <input
                id="height-input"
                type="number"
                inputMode="decimal"
                className={styles['input']}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="예: 163"
                min={100}
                max={250}
                aria-label="키 (센티미터)"
              />
              <span className={styles['unit']} aria-hidden="true">cm</span>
            </div>
          </div>

          {/* 몸무게 */}
          <div className={styles['field-group']}>
            <label htmlFor="weight-input" className={styles['label']}>
              몸무게 (kg)
            </label>
            <div className={styles['input-unit-row']}>
              <input
                id="weight-input"
                type="number"
                inputMode="decimal"
                className={styles['input']}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 52"
                min={20}
                max={300}
                aria-label="몸무게 (킬로그램)"
              />
              <span className={styles['unit']} aria-hidden="true">kg</span>
            </div>
          </div>

          {/* 혈액형 (선택) */}
          <div className={styles['field-group']}>
            <label htmlFor="blood-type-select" className={styles['label']}>
              혈액형 <span className={styles['optional']}>(선택)</span>
            </label>
            <select
              id="blood-type-select"
              className={styles['select']}
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              aria-label="혈액형 선택"
            >
              <option value="">선택 안 함</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-primary']}
            disabled={!isValid}
            onClick={() => router.push('/projects/eum/patient/onboarding/complete')}
          >
            다음
          </button>
        </div>
      </main>
    </>
  );
}
