'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

// 공공데이터 토글 항목 (기본값: 모두 ON)
const PUBLIC_ITEMS = [
  { id: 'medication',    label: '투약이력',      org: '건강보험심사평가원' },
  { id: 'checkup',      label: '건강검진정보',   org: '국민건강보험공단' },
  { id: 'treatment',    label: '진료이력',       org: '국민건강보험공단' },
  { id: 'vaccination',  label: '예방접종',       org: '질병관리청' },
  { id: 'summary',      label: '진료기록요약지',  org: '진료기록전송지원시스템 연계' },
  { id: 'drug_allergy', label: '약물알레르기',   org: '진료기록전송지원시스템 연계' },
];

// 의료데이터 필수 항목 (체크됨, 비활성)
const REQUIRED_MEDICAL = ['환자정보', '의료기관정보', '진료의정보', '진단내역'];

// 의료데이터 선택 항목
const OPTIONAL_MEDICAL = [
  { id: 'prescription', label: '약물처방내역' },
  { id: 'lab',          label: '진단검사' },
  { id: 'imaging',      label: '영상검사' },
  { id: 'pathology',    label: '병리검사' },
  { id: 'other_exam',   label: '기타검사' },
  { id: 'surgery',      label: '수술내역' },
  { id: 'allergy',      label: '알레르기 및 불내성' },
  { id: 'records',      label: '진료기록' },
];

const INITIAL_PUBLIC = Object.fromEntries(PUBLIC_ITEMS.map((i) => [i.id, true]));
const INITIAL_OPTIONAL = Object.fromEntries(OPTIONAL_MEDICAL.map((i) => [i.id, false]));

export default function MydataItemsPage() {
  const router = useRouter();
  const [publicToggles, setPublicToggles] = useState(INITIAL_PUBLIC);
  const [optionalChecked, setOptionalChecked] = useState(INITIAL_OPTIONAL);
  const [allAgreed, setAllAgreed] = useState(false);

  function togglePublic(id) {
    setPublicToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleOptional(id) {
    setOptionalChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleConfirm() {
    const existing = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
    sessionStorage.setItem(
      'eum_onboarding',
      JSON.stringify({
        ...existing,
        mydata_public_items: publicToggles,
        mydata_optional_items: optionalChecked,
      }),
    );
    router.push('/projects/eum/patient/onboarding/mydata-auth');
  }

  return (
    <>
      <OnboardingAppBar
        variant="progress"
        step={7}
        totalSteps={10}
        backHref="/projects/eum/patient/onboarding/mydata"
      />
      <main className={styles['page']}>
        <h1 className={styles['page-title']}>항목 동의</h1>

        <div className={styles['content']}>
          {/* 공공데이터 섹션 */}
          <section aria-labelledby="public-section-title">
            <h2 id="public-section-title" className={styles['section-title']}>
              동의 항목(공공데이터)
            </h2>
            <div className={styles['card']}>
              {PUBLIC_ITEMS.map((item, i) => (
                <div key={item.id}>
                  <div className={styles['toggle-row']}>
                    <div className={styles['toggle-label-group']}>
                      <span className={styles['item-label']}>{item.label}</span>
                      <span className={styles['item-org']}>{item.org}</span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={publicToggles[item.id]}
                      aria-label={`${item.label} 동의`}
                      className={[styles['toggle'], publicToggles[item.id] ? styles['toggle-on'] : ''].filter(Boolean).join(' ')}
                      onClick={() => togglePublic(item.id)}
                    >
                      <span className={styles['toggle-thumb']} />
                    </button>
                  </div>
                  {i < PUBLIC_ITEMS.length - 1 && <div className={styles['row-divider']} />}
                </div>
              ))}
            </div>
          </section>

          {/* 의료데이터 섹션 */}
          <section aria-labelledby="medical-section-title">
            <h2 id="medical-section-title" className={styles['section-title']}>
              동의 항목(의료데이터)
            </h2>
            <div className={styles['card']}>
              {/* 필수 항목 */}
              <div className={styles['card-row-header']}>
                <span className={styles['card-row-label']}>의료마이데이터 필수 연계 항목</span>
                <span className={styles['badge-required']}>필수</span>
              </div>
              <div className={styles['row-divider']} />
              <div className={styles['checkbox-grid']}>
                {REQUIRED_MEDICAL.map((label) => (
                  <label key={label} className={styles['check-item']}>
                    <input
                      type="checkbox"
                      className={styles['checkbox-fixed']}
                      checked
                      disabled
                      aria-label={label}
                      readOnly
                    />
                    <span className={styles['check-label']}>{label}</span>
                  </label>
                ))}
              </div>

              <div className={styles['row-divider']} style={{ margin: '12px 0' }} />

              {/* 선택 항목 */}
              <div className={styles['card-row-header']}>
                <span className={styles['card-row-label']}>연계 동의하시는 항목을 선택하세요.</span>
                <span className={styles['badge-optional']}>선택</span>
              </div>
              <div className={styles['checkbox-grid']} style={{ marginTop: 12 }}>
                {OPTIONAL_MEDICAL.map((item) => (
                  <label key={item.id} className={styles['check-item']}>
                    <input
                      type="checkbox"
                      className={styles['checkbox-opt']}
                      checked={optionalChecked[item.id]}
                      onChange={() => toggleOptional(item.id)}
                      aria-label={item.label}
                    />
                    <span className={styles['check-label']}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 전체 동의 */}
          <label className={styles['all-agree']}>
            <input
              type="checkbox"
              className={styles['checkbox-all']}
              checked={allAgreed}
              onChange={(e) => setAllAgreed(e.target.checked)}
              aria-label="위의 전체 내용에 동의합니다"
            />
            <span className={styles['all-agree-text']}>위의 전체 내용에 동의 합니다.</span>
          </label>
        </div>

        <div className={styles['footer']}>
          <button
            type="button"
            className={styles['btn-confirm']}
            disabled={!allAgreed}
            onClick={handleConfirm}
          >
            확인
          </button>
        </div>
      </main>
    </>
  );
}
