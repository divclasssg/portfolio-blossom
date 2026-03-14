'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AiPatientSummary.module.scss';
import { AiIcon as AiIconSvg } from '../../../_components/icons';

function AiIcon() {
    return (
        <span className={styles['ai-icon']} aria-hidden="true">
            <AiIconSvg size={18} color="#9CA3AF" />
        </span>
    );
}

// D-001 섹션 4: AI 쉬운말 변환 결과 — 의사가 직접 편집 가능
export default function AiPatientSummary({ plainText, modelVersion }) {
    // 'generating' → 2.5초 → 'complete'
    const [generationState, setGenerationState] = useState('generating');
    const textareaRef = useRef(null);

    // 마운트 시 생성 시뮬레이션 시작
    useEffect(() => {
        const timer = setTimeout(() => {
            setGenerationState('complete');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // complete 전환 시 textarea 높이 초기화
    useEffect(() => {
        if (generationState === 'complete' && textareaRef.current) {
            const el = textareaRef.current;
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [generationState]);

    // textarea 입력 시 높이 자동 조정
    const handleInput = useCallback((e) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <div className={styles['section-header']}>
                    <AiIcon />
                    <h2 className={styles['section-title']}>AI Patient Summary</h2>
                    <span className={styles['model-tag']}>{modelVersion}</span>
                </div>

                {/* bordered 카드 — white bg, border 1px #E5E7EB, radius 16px */}
                <div className={styles.card}>
                    {generationState === 'generating' ? (
                        /* 생성 중: 스피너 + 안내 텍스트 */
                        <div
                            className={styles['generating-state']}
                            aria-live="polite"
                            aria-label="쉬운말 변환 중"
                        >
                            <span className={styles.spinner} aria-hidden="true" />
                            <span className={styles['generating-text']}>쉬운말 변환 중...</span>
                        </div>
                    ) : (
                        /* 완료: 편집 가능한 textarea */
                        <>
                            <textarea
                                ref={textareaRef}
                                className={styles.textarea}
                                defaultValue={plainText}
                                onInput={handleInput}
                                aria-label="AI 쉬운말 요약 — 직접 수정 가능"
                            />
                            <p className={styles['edit-hint']}>
                                <span className={styles['hint-icon']} aria-hidden="true">
                                    ⚠
                                </span>
                                직접 수정 가능합니다
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
