'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import { getPatientIdFromCookie } from '../../../_lib/getPatientIdClient';
import styles from './page.module.scss';

// sessionStorage 데이터를 기반으로 요약 항목 생성
function buildSummaryItems(data) {
  const items = [];

  // 항상 표시 (여기까지 왔으면 필수 동의 완료)
  items.push('서비스 약관 및 개인정보 처리 동의');

  // 선택 동의 (체크한 것만)
  if (data?.consent_marketing) items.push('마케팅 정보 수신 동의');
  if (data?.consent_research) items.push('건강 데이터 연구 활용 동의');
  if (data?.consent_improvement) items.push('서비스 개선 데이터 활용 동의');

  // 항상 표시
  items.push('본인 인증 완료');
  items.push('PIN 번호 설정');

  // 완료한 것만
  if (data?.biometrics_enabled) items.push('생체 인증 등록');
  if (data?.consent_mydata) items.push('의료 마이데이터 연동');
  if (data?.wearable_device) items.push('웨어러블 기기 연동');

  // 항상 표시
  items.push('기본 건강 정보 입력');

  // 입력된 경우만
  if (data?.chronic_conditions?.length > 0) items.push('기저질환 정보 입력');
  if (data?.allergies?.length > 0) items.push('알레르기 정보 입력');

  return items;
}

export default function CompletePage() {
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState('idle'); // 'saving' | 'done' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [summaryItems, setSummaryItems] = useState([]);

  async function saveOnboarding() {
    const raw = sessionStorage.getItem('eum_onboarding');
    const patientId = sessionStorage.getItem('eum_patient_id') || getPatientIdFromCookie();
    // 직접 접근이나 이미 저장 완료된 경우
    if (!raw || !patientId) { setSaveStatus('done'); return; }

    setSaveStatus('saving');
    try {
      const onboardingData = JSON.parse(raw);
      const res = await fetch('/api/eum/patients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          ...onboardingData,
          onboarded_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || '저장에 실패했습니다');
      }

      // 데모 환자에 윤서진 시나리오 임상 데이터 시드 (실패해도 진행)
      if (patientId.startsWith('pat_demo_')) {
        try {
          await fetch('/api/eum/patients/seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId }),
          });
        } catch (e) {
          console.warn('[complete] 시드 실패 (정적 JSON 폴백 유지):', e.message);
        }
      }

      sessionStorage.removeItem('eum_onboarding');
      sessionStorage.removeItem('eum_patient_id');
      setSaveStatus('done');
    } catch (err) {
      setErrorMsg(err.message);
      setSaveStatus('error');
    }
  }

  useEffect(() => {
    // 요약 표시용 데이터 먼저 읽기 (saveOnboarding이 sessionStorage를 지우기 전에)
    const raw = sessionStorage.getItem('eum_onboarding');
    const data = raw ? JSON.parse(raw) : null;
    setSummaryItems(buildSummaryItems(data));
    saveOnboarding();
  }, []);

  return (
    <>
      <OnboardingAppBar variant="logo" />
      <main className={styles['page']}>
        <section className={styles['content']} aria-labelledby="complete-title">
          <div className={styles['check-icon']} aria-hidden="true">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="36" cy="36" r="36" fill="#007AFF" />
              <path
                d="M22 36l10 10 18-20"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 id="complete-title" className={styles['title']}>
            준비가 완료되었어요!
          </h1>
          <p className={styles['desc']}>
            이음과 함께 건강한 하루를 시작해 보세요.
            증상을 기록하고, 담당 의료진과 더 잘 소통할 수 있어요.
          </p>

          {/* 요약 카드 */}
          <div className={styles['summary-card']}>
            <ul className={styles['summary-list']} aria-label="설정 완료 항목">
              {summaryItems.map((item) => (
                <li key={item} className={styles['summary-item']}>
                  <span className={styles['summary-icon']} aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={styles['footer']}>
          {saveStatus === 'error' && (
            <p className={styles['error-msg']} role="alert">
              {errorMsg} — 잠시 후 다시 시도해 주세요.
            </p>
          )}
          {saveStatus === 'error' ? (
            <button
              type="button"
              className={styles['btn-primary']}
              onClick={() => {
                setErrorMsg('');
                saveOnboarding();
              }}
            >
              다시 시도
            </button>
          ) : (
            <button
              type="button"
              className={styles['btn-primary']}
              disabled={saveStatus === 'saving'}
              onClick={() => router.push('/projects/eum/patient')}
            >
              {saveStatus === 'saving' ? '저장 중...' : '이음 시작하기'}
            </button>
          )}
        </div>
      </main>
    </>
  );
}
