'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', '모름'];

export default function HealthInfoPage() {
    const router = useRouter();

    // 기본 건강 정보
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bloodType, setBloodType] = useState('');

    // 유효성 에러
    const [heightError, setHeightError] = useState('');
    const [weightError, setWeightError] = useState('');

    // 기저질환
    const [conditions, setConditions] = useState([]);
    const [conditionInput, setConditionInput] = useState('');
    const [conditionDupError, setConditionDupError] = useState('');

    // 알레르기
    const [allergies, setAllergies] = useState([]);
    const [allergenInput, setAllergenInput] = useState('');
    const [reactionInput, setReactionInput] = useState('');
    const [allergyDupError, setAllergyDupError] = useState('');

    const isValid = height.length > 0 && weight.length > 0 && !heightError && !weightError;

    function handleHeightBlur() {
        const val = parseFloat(height);
        if (height && (val < 100 || val > 250)) {
            setHeightError('키는 100~250cm 범위로 입력해 주세요.');
        } else {
            setHeightError('');
        }
    }

    function handleWeightBlur() {
        const val = parseFloat(weight);
        if (weight && (val < 20 || val > 300)) {
            setWeightError('몸무게는 20~300kg 범위로 입력해 주세요.');
        } else {
            setWeightError('');
        }
    }

    function addCondition() {
        const trimmed = conditionInput.trim();
        if (!trimmed) return;
        if (conditions.some((c) => c.name === trimmed)) {
            setConditionDupError('이미 추가된 항목입니다.');
            return;
        }
        setConditionDupError('');
        setConditions((prev) => [...prev, { name: trimmed }]);
        setConditionInput('');
    }

    function removeCondition(index) {
        setConditions((prev) => prev.filter((_, i) => i !== index));
    }

    function addAllergy() {
        const allergen = allergenInput.trim();
        if (!allergen) return;
        if (allergies.some((a) => a.allergen === allergen)) {
            setAllergyDupError('이미 추가된 항목입니다.');
            return;
        }
        setAllergyDupError('');
        setAllergies((prev) => [...prev, { allergen, reaction: reactionInput.trim() }]);
        setAllergenInput('');
        setReactionInput('');
    }

    function removeAllergy(index) {
        setAllergies((prev) => prev.filter((_, i) => i !== index));
    }

    function handleComplete() {
        const existing = JSON.parse(sessionStorage.getItem('eum_onboarding') || '{}');
        sessionStorage.setItem(
            'eum_onboarding',
            JSON.stringify({
                ...existing,
                height_cm: parseFloat(height),
                weight_kg: parseFloat(weight),
                blood_type: bloodType || null,
                chronic_conditions: conditions,
                allergies,
            })
        );
        router.push('/projects/eum/patient/onboarding/complete');
    }

    return (
        <>
            <OnboardingAppBar
                variant="progress"
                step={10}
                totalSteps={10}
                backHref="/projects/eum/patient/onboarding/wearable"
            />
            <main className={styles['page']}>
                <section className={styles['content']} aria-labelledby="health-info-title">
                    <h1 id="health-info-title" className={styles['title']}>
                        건강 정보를
                        <br />
                        입력해 주세요
                    </h1>
                    <p className={styles['subtitle']}>
                        더 정확한 분석을 위해 활용됩니다. 언제든지 변경할 수 있어요.
                    </p>

                    {/* 기본 건강 정보 섹션 */}
                    <div
                        className={[styles['section-header'], styles['section-header-first']].join(
                            ' '
                        )}
                    >
                        <span className={styles['section-title']}>기본 건강 정보</span>
                        <span className={styles['required-badge']} aria-label="필수 항목">
                            필수
                        </span>
                    </div>

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
                                className={[
                                    styles['input'],
                                    heightError ? styles['input-error'] : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                value={height}
                                onChange={(e) => {
                                    setHeight(e.target.value);
                                    setHeightError('');
                                }}
                                onBlur={handleHeightBlur}
                                placeholder="예: 163"
                                min={100}
                                max={250}
                                aria-label="키 (센티미터)"
                                aria-invalid={!!heightError}
                                aria-describedby={heightError ? 'height-error' : undefined}
                            />
                            <span className={styles['unit']} aria-hidden="true">
                                cm
                            </span>
                        </div>
                        {heightError && (
                            <span id="height-error" className={styles['error']} role="alert">
                                {heightError}
                            </span>
                        )}
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
                                className={[
                                    styles['input'],
                                    weightError ? styles['input-error'] : '',
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                                value={weight}
                                onChange={(e) => {
                                    setWeight(e.target.value);
                                    setWeightError('');
                                }}
                                onBlur={handleWeightBlur}
                                placeholder="예: 52"
                                min={20}
                                max={300}
                                aria-label="몸무게 (킬로그램)"
                                aria-invalid={!!weightError}
                                aria-describedby={weightError ? 'weight-error' : undefined}
                            />
                            <span className={styles['unit']} aria-hidden="true">
                                kg
                            </span>
                        </div>
                        {weightError && (
                            <span id="weight-error" className={styles['error']} role="alert">
                                {weightError}
                            </span>
                        )}
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

                    {/* 기저질환 및 알레르기 섹션 */}
                    <div className={styles['section-header']}>
                        <span className={styles['section-title']}>기저질환 및 알레르기</span>
                        <span className={styles['optional-badge']} aria-label="선택 항목">
                            선택
                        </span>
                    </div>

                    {/* 기저질환 */}
                    <div className={styles['field-group']}>
                        <span className={styles['label']} id="conditions-label">
                            기저질환
                        </span>
                        <div
                            className={styles['input-row']}
                            role="group"
                            aria-labelledby="conditions-label"
                        >
                            <input
                                type="text"
                                className={styles['input']}
                                value={conditionInput}
                                onChange={(e) => {
                                    setConditionInput(e.target.value);
                                    setConditionDupError('');
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                                placeholder="예: 고혈압, 당뇨"
                                aria-label="기저질환 입력"
                            />
                            <button
                                type="button"
                                className={styles['btn-add']}
                                onClick={addCondition}
                                disabled={!conditionInput.trim()}
                                aria-label="기저질환 추가"
                            >
                                추가
                            </button>
                        </div>
                        {conditionDupError && (
                            <span className={styles['error']} role="alert">
                                {conditionDupError}
                            </span>
                        )}
                        {conditions.length > 0 && (
                            <ul className={styles['chip-list']} aria-label="기저질환 목록">
                                {conditions.map((item, i) => (
                                    <li key={i} className={styles['chip']}>
                                        <span>{item.name}</span>
                                        <button
                                            type="button"
                                            className={styles['chip-remove']}
                                            onClick={() => removeCondition(i)}
                                            aria-label={`${item.name} 삭제`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 알레르기 */}
                    <div className={styles['field-group']}>
                        <span className={styles['label']} id="allergies-label">
                            알레르기
                        </span>
                        <div
                            className={styles['allergy-inputs']}
                            role="group"
                            aria-labelledby="allergies-label"
                        >
                            <input
                                type="text"
                                className={styles['input']}
                                value={allergenInput}
                                onChange={(e) => {
                                    setAllergenInput(e.target.value);
                                    setAllergyDupError('');
                                }}
                                placeholder="물질명 (예: 페니실린)"
                                aria-label="알레르기 물질명 입력"
                            />
                            <div className={styles['input-row']}>
                                <input
                                    type="text"
                                    className={styles['input']}
                                    value={reactionInput}
                                    onChange={(e) => setReactionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                                    placeholder="반응 (예: 발진, 선택)"
                                    aria-label="알레르기 반응 입력 (선택)"
                                />
                                <button
                                    type="button"
                                    className={styles['btn-add']}
                                    onClick={addAllergy}
                                    disabled={!allergenInput.trim()}
                                    aria-label="알레르기 추가"
                                >
                                    추가
                                </button>
                            </div>
                        </div>
                        {allergyDupError && (
                            <span className={styles['error']} role="alert">
                                {allergyDupError}
                            </span>
                        )}
                        {allergies.length > 0 && (
                            <ul className={styles['chip-list']} aria-label="알레르기 목록">
                                {allergies.map((item, i) => (
                                    <li key={i} className={styles['chip']}>
                                        <span>
                                            {item.allergen}
                                            {item.reaction && (
                                                <span className={styles['chip-reaction']}>
                                                    {' '}
                                                    ({item.reaction})
                                                </span>
                                            )}
                                        </span>
                                        <button
                                            type="button"
                                            className={styles['chip-remove']}
                                            onClick={() => removeAllergy(i)}
                                            aria-label={`${item.allergen} 알레르기 삭제`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <div className={styles['footer']}>
                    <button
                        type="button"
                        className={styles['btn-primary']}
                        disabled={!isValid}
                        onClick={handleComplete}
                    >
                        완료
                    </button>
                </div>
            </main>
        </>
    );
}
