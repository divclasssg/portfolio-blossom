'use client';

import { useState } from 'react';
import styles from './PatientOverview.module.scss';
import { ArrowIcon } from '../../../_components/icons';

export default function PatientOverview({ basicInfo, medications }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const { chronic_conditions, height, weight, medications_count, last_screening, blood_type, wearable_device } = basicInfo;

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const bmi = (w / (h / 100) ** 2).toFixed(1);

    const conditions = chronic_conditions.length > 0 ? chronic_conditions.join(' · ') : '정보 없음';

    // 혈액형: 값이 있고 '모름'이 아닐 때만 표시
    const showBloodType = blood_type && blood_type !== '모름';

    // 웨어러블: DB 값 → 표시명 변환
    const wearableLabel = wearable_device === 'apple' ? 'Apple Watch' : wearable_device === 'galaxy' ? 'Galaxy Watch' : null;

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <h2 className={styles['section-title']}>Patient Overview</h2>
                <div className={styles['overview-card']}>
                    <p className={styles.summary}>
                        {conditions} · {height} / {weight} / BMI {bmi}
                        {showBloodType && ` · 혈액형 ${blood_type}`} · {medications_count} Active
                        Medications
                    </p>

                    {isExpanded && (
                        <div className={styles['expanded-detail']}>
                            {/* 복용약 목록 */}
                            <div className={styles['detail-group']}>
                                <span className={styles['detail-label']}>복용약</span>
                                <ul className={styles['med-list']}>
                                    {medications.map((med, i) => (
                                        <li key={i}>{med}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* 연동 웨어러블 */}
                            {wearableLabel && (
                                <div className={styles['detail-group']}>
                                    <span className={styles['detail-label']}>웨어러블 기기</span>
                                    <p>{wearableLabel}</p>
                                </div>
                            )}

                            {/* 최근 검진 */}
                            {last_screening && (
                                <div className={styles['detail-group']}>
                                    <span className={styles['detail-label']}>
                                        최근 검진 ({last_screening.date})
                                    </span>
                                    <ul className={styles['med-list']}>
                                        {last_screening.flags.map((flag, i) => (
                                            <li key={i}>{flag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className={styles['more-btn']}
                        onClick={() => setIsExpanded((prev) => !prev)}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? (
                            <>
                                접기 <ArrowIcon variant="up" size={18} />
                            </>
                        ) : (
                            <>
                                더보기 <ArrowIcon variant="down" size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}
