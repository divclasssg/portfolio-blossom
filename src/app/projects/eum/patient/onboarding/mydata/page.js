'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function MydataPage() {
    const router = useRouter();
    const [consentMydata, setConsentMydata] = useState(false);
    const [consentOverseas, setConsentOverseas] = useState(false);

    return (
        <>
            <OnboardingAppBar
                variant="progress"
                step={6}
                totalSteps={10}
                backHref="/projects/eum/patient/onboarding/pin-confirm"
            />
            <main className="page">
                <section className={`content ${styles.content}`} aria-labelledby="mydata-title">
                    <h1 id="mydata-title" className="title">
                        의료 마이데이터
                        <br />
                        연동 동의
                    </h1>
                    <p className={`subtitle ${styles.subtitle}`}>
                        건강보험공단 진료 기록을 연동하면 더 정확한 건강 분석이 가능합니다.
                    </p>

                    {/* 마이데이터 동의 */}
                    <div className={styles['consent-card']}>
                        <label className={styles['consent-item']}>
                            <input
                                type="checkbox"
                                className={styles['checkbox']}
                                checked={consentMydata}
                                onChange={(e) => setConsentMydata(e.target.checked)}
                                aria-describedby="mydata-detail"
                            />
                            <div className={styles['consent-text']}>
                                <span className={styles['consent-label']}>
                                    <span className={styles['required-badge']} aria-label="필수">
                                        필수
                                    </span>
                                    의료 마이데이터 연동 동의
                                </span>
                                <span id="mydata-detail" className={styles['consent-detail']}>
                                    국민건강보험공단 및 의료기관의 진료 이력, 처방 이력, 건강검진
                                    결과를 이음 서비스에 제공하는 데 동의합니다.
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* 국외이전 동의 */}
                    <div className={styles['consent-card']}>
                        <label className={styles['consent-item']}>
                            <input
                                type="checkbox"
                                className={styles['checkbox']}
                                checked={consentOverseas}
                                onChange={(e) => setConsentOverseas(e.target.checked)}
                                aria-describedby="overseas-detail"
                            />
                            <div className={styles['consent-text']}>
                                <span className={styles['consent-label']}>
                                    <span className={styles['required-badge']} aria-label="필수">
                                        필수
                                    </span>
                                    개인정보 국외이전 동의
                                </span>
                                <span id="overseas-detail" className={styles['consent-detail']}>
                                    AI 분석을 위해 건강 데이터 일부가 해외 AI 서비스(OpenAI,
                                    Google)에 전송됩니다. 전송 전 개인 식별 정보는 제거됩니다.
                                </span>
                                <span className={styles['overseas-info']}>
                                    수신국: 미국 | 수신자: OpenAI Inc., Google LLC | 이전 항목: 증상
                                    기록, 진료 요약
                                </span>
                            </div>
                        </label>
                    </div>
                </section>

                <div className={`footer ${styles.footer}`}>
                    <button
                        type="button"
                        className="btn-primary"
                        disabled={!consentMydata || !consentOverseas}
                        onClick={() => {
                            const existing = JSON.parse(
                                sessionStorage.getItem('eum_onboarding') || '{}'
                            );
                            sessionStorage.setItem(
                                'eum_onboarding',
                                JSON.stringify({
                                    ...existing,
                                    consent_mydata: consentMydata,
                                    consent_overseas: consentOverseas,
                                    mydata_skipped: false,
                                })
                            );
                            router.push('/projects/eum/patient/onboarding/mydata-items');
                        }}
                    >
                        동의하고 계속하기
                    </button>
                    <button
                        type="button"
                        className={styles['btn-skip']}
                        onClick={() => {
                            const existing = JSON.parse(
                                sessionStorage.getItem('eum_onboarding') || '{}'
                            );
                            sessionStorage.setItem(
                                'eum_onboarding',
                                JSON.stringify({
                                    ...existing,
                                    consent_mydata: false,
                                    consent_overseas: false,
                                    mydata_skipped: true,
                                })
                            );
                            router.push('/projects/eum/patient/onboarding/wearable');
                        }}
                    >
                        건너뛰기
                    </button>
                </div>
            </main>
        </>
    );
}
