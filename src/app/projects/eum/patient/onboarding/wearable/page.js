'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import CtaButton from '../../_components/CtaButton/CtaButton';
import styles from './page.module.scss';

const WEARABLES = [
    {
        id: 'apple',
        label: 'Apple Watch',
        icon: '⌚',
        desc: 'Apple Health와 연동',
    },
    {
        id: 'galaxy',
        label: 'Galaxy Watch',
        icon: '⌚',
        desc: 'Samsung Health와 연동',
    },
];

export default function WearablePage() {
    const router = useRouter();
    const [selected, setSelected] = useState(null);
    const [backHref, setBackHref] = useState('/projects/eum/patient/onboarding/mydata-auth');

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
        if (data.mydata_skipped) {
            setBackHref('/projects/eum/patient/onboarding/mydata');
        }
    }, []);

    return (
        <>
            <OnboardingAppBar variant="progress" step={9} totalSteps={10} backHref={backHref} />
            <main className="page">
                <section className={`content ${styles.content}`} aria-labelledby="wearable-title">
                    <h1 id="wearable-title" className="title onboarding">
                        웨어러블 기기를
                        <br />
                        연동하시겠어요?
                    </h1>
                    <p className="subtitle">
                        스마트워치를 연동하면 심박수, 수면, 활동량 데이터를 자동으로 기록합니다.
                    </p>

                    <div
                        className={styles['options']}
                        role="radiogroup"
                        aria-labelledby="wearable-title"
                    >
                        {WEARABLES.map((device) => (
                            <label
                                key={device.id}
                                className={[
                                    styles['option'],
                                    selected === device.id ? styles['option-selected'] : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                <input
                                    type="radio"
                                    name="wearable"
                                    value={device.id}
                                    checked={selected === device.id}
                                    onChange={() => setSelected(device.id)}
                                    className="sr-only"
                                    aria-label={device.label}
                                />
                                <span className={styles['option-icon']} aria-hidden="true">
                                    {device.icon}
                                </span>
                                <div className={styles['option-text']}>
                                    <span className={styles['option-label']}>{device.label}</span>
                                    <span className={styles['option-desc']}>{device.desc}</span>
                                </div>
                                <div
                                    className={[
                                        styles['radio-dot'],
                                        selected === device.id ? styles['radio-dot-checked'] : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    aria-hidden="true"
                                />
                            </label>
                        ))}
                    </div>
                </section>

                <div className={`footer ${styles.footer}`}>
                    <CtaButton
                        disabled={!selected}
                        onClick={() => {
                            const existing = JSON.parse(
                                sessionStorage.getItem('eum_onboarding') || '{}'
                            );
                            sessionStorage.setItem(
                                'eum_onboarding',
                                JSON.stringify({ ...existing, wearable_device: selected })
                            );
                            router.push('/projects/eum/patient/onboarding/health-info');
                        }}
                    >
                        연동하기
                    </CtaButton>
                    <CtaButton
                        variant="tertiary"
                        onClick={() => {
                            const existing = JSON.parse(
                                sessionStorage.getItem('eum_onboarding') || '{}'
                            );
                            sessionStorage.setItem(
                                'eum_onboarding',
                                JSON.stringify({ ...existing, wearable_device: null })
                            );
                            router.push('/projects/eum/patient/onboarding/health-info');
                        }}
                    >
                        건너뛰기
                    </CtaButton>
                </div>
            </main>
        </>
    );
}
