'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import CtaButton from '../../_components/CtaButton/CtaButton';
import styles from './page.module.scss';

const REQUIRED_ITEMS = [
    {
        id: 'sandbox_notice',
        label: '실증특례 이용자 고지 확인',
        detail: '마이데이터 기반 맞춤형 만성질환 및 중증이환 예방·관리 서비스(Eum)의 규제특례(실증특례) 적용에 관한 고지 내용을 확인하였습니다. 유효기간: 사업 개시일로부터 2026.3.13.까지',
    },
    {
        id: 'privacy',
        label: '개인정보 처리방침 동의',
        detail: '수집 항목: 이름, 연락처, 건강 정보 등',
    },
    {
        id: 'terms',
        label: '서비스 이용약관 동의',
        detail: 'Eum 서비스 이용에 관한 약관',
    },
    {
        id: 'sensitive',
        label: '민감정보(건강) 처리 동의',
        detail: '질환, 증상, 투약 이력 등 건강 관련 민감정보 처리',
    },
    {
        id: 'location',
        label: '위치정보 이용 동의',
        detail: '가까운 병원 찾기 기능에 활용',
    },
];

const OPTIONAL_ITEMS = [
    {
        id: 'marketing',
        label: '마케팅 정보 수신 동의',
        detail: '이메일, 앱 알림을 통한 Eum 소식 및 이벤트 안내',
    },
    {
        id: 'research',
        label: '건강 데이터 연구 활용 동의',
        detail: '익명화된 건강 데이터를 의료 연구 목적으로 활용 (개인 식별 불가)',
    },
    {
        id: 'improvement',
        label: '서비스 개선 데이터 활용 동의',
        detail: '앱 사용 패턴 분석을 통한 서비스 품질 개선',
    },
];

const ALL_ITEMS = [...REQUIRED_ITEMS, ...OPTIONAL_ITEMS];

const INITIAL_STATE = Object.fromEntries(ALL_ITEMS.map((item) => [item.id, false]));

export default function ConsentsPage() {
    const router = useRouter();
    const [checked, setChecked] = useState(INITIAL_STATE);
    const [expanded, setExpanded] = useState({});

    function toggleExpanded(id) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    const allRequiredChecked = REQUIRED_ITEMS.every((item) => checked[item.id]);
    const allChecked = ALL_ITEMS.every((item) => checked[item.id]);

    function handleAll(e) {
        const val = e.target.checked;
        setChecked(Object.fromEntries(ALL_ITEMS.map((item) => [item.id, val])));
    }

    function handleItem(id) {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <>
            <OnboardingAppBar
                variant="progress"
                step={2}
                totalSteps={10}
                backHref="/projects/eum/patient/onboarding/sandbox"
            />
            <main className="page">
                <section className="content" aria-labelledby="consent-title">
                    <h1 id="consent-title" className="title onboarding">
                        서비스 이용에
                        <br />
                        동의해 주세요
                    </h1>
                    <p className="subtitle">
                        필수 항목에 모두 동의해야 서비스를 이용할 수 있습니다.
                    </p>

                    {/* 전체 동의 */}
                    <label className={styles['all-item']}>
                        <input
                            type="checkbox"
                            className="consent-checkbox"
                            checked={allChecked}
                            onChange={handleAll}
                            aria-label="전체 동의"
                        />
                        <span className={styles['all-label']}>전체 동의</span>
                    </label>

                    <hr className={styles['divider']} />

                    {/* 필수 항목 */}
                    <ul className={styles['list']}>
                        {REQUIRED_ITEMS.map((item) => (
                            <li key={item.id}>
                                <div className={styles['item-row']}>
                                    <label className={styles['item']}>
                                        <input
                                            type="checkbox"
                                            className="consent-checkbox"
                                            checked={checked[item.id]}
                                            onChange={() => handleItem(item.id)}
                                            aria-label={item.label}
                                        />
                                        <div className={styles['item-text']}>
                                            <span className={styles['item-label']}>
                                                <span
                                                    className={styles['required-badge']}
                                                    aria-label="필수"
                                                >
                                                    필수
                                                </span>
                                                {item.label}
                                            </span>
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        className={[
                                            styles['chevron-btn'],
                                            expanded[item.id] ? styles['chevron-open'] : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onClick={() => toggleExpanded(item.id)}
                                        aria-label={`${item.label} 상세 보기`}
                                        aria-expanded={!!expanded[item.id]}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M6 4l4 4-4 4"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {expanded[item.id] && (
                                    <p className={styles['item-detail']}>{item.detail}</p>
                                )}
                            </li>
                        ))}
                    </ul>

                    <hr className={styles['divider']} />

                    {/* 선택 항목 */}
                    <ul className={styles['list']}>
                        {OPTIONAL_ITEMS.map((item) => (
                            <li key={item.id}>
                                <div className={styles['item-row']}>
                                    <label className={styles['item']}>
                                        <input
                                            type="checkbox"
                                            className="consent-checkbox"
                                            checked={checked[item.id]}
                                            onChange={() => handleItem(item.id)}
                                            aria-label={item.label}
                                        />
                                        <div className={styles['item-text']}>
                                            <span className={styles['item-label']}>
                                                <span
                                                    className={styles['optional-badge']}
                                                    aria-label="선택"
                                                >
                                                    선택
                                                </span>
                                                {item.label}
                                            </span>
                                        </div>
                                    </label>
                                    <button
                                        type="button"
                                        className={[
                                            styles['chevron-btn'],
                                            expanded[item.id] ? styles['chevron-open'] : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onClick={() => toggleExpanded(item.id)}
                                        aria-label={`${item.label} 상세 보기`}
                                        aria-expanded={!!expanded[item.id]}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M6 4l4 4-4 4"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {expanded[item.id] && (
                                    <p className={styles['item-detail']}>{item.detail}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="footer">
                    <CtaButton
                        disabled={!allRequiredChecked}
                        onClick={() => {
                            const existing = JSON.parse(
                                sessionStorage.getItem('eum_onboarding') || '{}'
                            );
                            sessionStorage.setItem(
                                'eum_onboarding',
                                JSON.stringify({
                                    ...existing,
                                    consent_sandbox_notice: checked.sandbox_notice,
                                    consent_privacy: checked.privacy,
                                    consent_terms: checked.terms,
                                    consent_sensitive: checked.sensitive,
                                    consent_location: checked.location,
                                    consent_marketing: checked.marketing,
                                    consent_research: checked.research,
                                    consent_improvement: checked.improvement,
                                })
                            );
                            router.push('/projects/eum/patient/onboarding/personal-info');
                        }}
                    >
                        동의하고 계속하기
                    </CtaButton>
                </div>
            </main>
        </>
    );
}
