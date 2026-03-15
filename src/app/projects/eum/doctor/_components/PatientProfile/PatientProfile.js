'use client';

import { useState } from 'react';
import { HeartPulseIcon, WarningIcon, ArrowIcon } from '../../../_components/icons';
import Badge from '../Badge/Badge';
import Chip from '../Chip/Chip';
import styles from './PatientProfile.module.scss';

// chronic_conditions 문자열에서 ICD 코드 추출 — "역류성 식도염 (K21.0)" → "K21.0"
function extractIcdCode(condition) {
    const match = typeof condition === 'string' ? condition.match(/\(([A-Z]\d[\d.]*)\)/) : null;
    return match ? match[1] : null;
}

export default function PatientProfile({
    patientSummary,
    allergies,
    chronicConditions,
    basicInfo,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const genderLabel =
        patientSummary.gender === 'F' ? '여' : patientSummary.gender === 'M' ? '남' : null;

    // ICD-10 코드: 첫 번째 기저질환에서 추출
    const firstIcdCode = chronicConditions?.length > 0 ? extractIcdCode(chronicConditions[0]) : null;

    // 펼침 영역 데이터 (basicInfo가 있을 때만)
    const h = basicInfo ? parseFloat(basicInfo.height) : 0;
    const w = basicInfo ? parseFloat(basicInfo.weight) : 0;
    const bmi = h > 0 ? (w / (h / 100) ** 2).toFixed(1) : null;

    const conditions = chronicConditions?.length > 0 ? chronicConditions.join(' · ') : null;
    const showBloodType = basicInfo?.blood_type && basicInfo.blood_type !== '모름';

    // 웨어러블: DB 값 → 표시명 변환
    const wearableLabel =
        basicInfo?.wearable_device === 'apple' ? 'Apple Watch'
        : basicInfo?.wearable_device === 'galaxy' ? 'Galaxy Watch'
        : null;

    const lastScreening = basicInfo?.last_screening;

    return (
        <section className={`section ${styles.section}`}>
            <h2 className="sr-only">Patient Profile</h2>

            <div className={styles['identity-row']}>
                <span className={styles['patient-name']}>{patientSummary.name}</span>
                {genderLabel && <Chip className={styles['gender-chip']}>{genderLabel}</Chip>}
                {patientSummary.age != null && (
                    <span className={styles.age}>만 {patientSummary.age}세</span>
                )}
                {firstIcdCode && (
                    <Badge className={styles['icd-code']}>{firstIcdCode}</Badge>
                )}

                <div className={styles.chips}>
                    {/* 기저질환 칩 — 0건이면 미표시 */}
                    {chronicConditions?.length > 0 && (
                        <div className={styles['chip-wrapper']}>
                            <Chip aria-describedby="cond-tooltip" tabIndex={0}>
                                <HeartPulseIcon size={14} />
                                <span>{chronicConditions.length}</span>
                            </Chip>
                            <ul className={styles.tooltip} id="cond-tooltip" role="tooltip" aria-label="기저질환 목록">
                                {chronicConditions.map((name) => <li key={name}>{name}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* 알레르기 칩 — 0건이면 미표시 */}
                    {allergies?.length > 0 && (
                        <div className={styles['chip-wrapper']}>
                            <Chip variant="danger" aria-describedby="allergy-tooltip" tabIndex={0}>
                                <WarningIcon size={14} variant="triangle-fill" />
                                <span>{allergies.length}</span>
                            </Chip>
                            <ul className={styles['tooltip-danger']} id="allergy-tooltip" role="tooltip" aria-label="알레르기 목록">
                                {allergies.map((item) => (
                                    <li key={item.allergen}>
                                        <strong>{item.allergen}</strong> — {item.reaction}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 펼치기/접기 버튼 */}
                    {basicInfo && (
                        <button
                            className={styles['toggle-btn']}
                            onClick={() => setIsExpanded((prev) => !prev)}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? '환자 상세정보 접기' : '환자 상세정보 펼치기'}
                        >
                            <ArrowIcon variant={isExpanded ? 'up' : 'down'} size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* 펼침 영역: 요약 + 상세 — grid 0fr→1fr 슬라이드 트랜지션 */}
            {basicInfo && (
                <div className={`${styles['expand-area']} ${isExpanded ? styles['expand-area--open'] : ''}`}>
                    <div className={styles['expanded-content']}>
                        <p className={styles.summary}>
                            {conditions && <>{conditions} · </>}
                            {basicInfo.height} / {basicInfo.weight}
                            {bmi && <> / BMI {bmi}</>}
                            {showBloodType && ` · 혈액형 ${basicInfo.blood_type}`}
                        </p>

                        {/* 웨어러블 기기 */}
                        {wearableLabel && (
                            <div className={styles['detail-group']}>
                                <span className={styles['detail-label']}>웨어러블 기기</span>
                                <p>{wearableLabel}</p>
                            </div>
                        )}

                        {/* 최근 검진 */}
                        {lastScreening && (
                            <div className={styles['detail-group']}>
                                <span className={styles['detail-label']}>
                                    최근 검진 ({lastScreening.date})
                                </span>
                                <ul className={styles['detail-list']}>
                                    {lastScreening.flags.map((flag, i) => (
                                        <li key={i}>{flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
