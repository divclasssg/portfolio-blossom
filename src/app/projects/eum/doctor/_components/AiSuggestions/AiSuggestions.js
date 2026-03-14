'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './AiSuggestions.module.scss';
import AiWarningBanner from '../AiWarningBanner/AiWarningBanner';
import { AiIcon as AiIconSvg } from '../../../_components/icons';

function AiIcon() {
    return (
        <span className={styles['ai-icon']} aria-hidden="true">
            <AiIconSvg size={18} color="#9CA3AF" />
        </span>
    );
}

// AI Key Findings (와이어프레임 섹션명)
// "진단", "확진" 표현 금지 — 참고 키워드로 표시 (CLAUDE.md §금지사항)
export default function AiSuggestions({ suggestions, modelVersion, warnings }) {
    const [orderedSuggestions, setOrderedSuggestions] = useState(suggestions);
    const [disabledItems, setDisabledItems] = useState(new Set());
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const liveRef = useRef(null);
    const handleRefs = useRef([]);

    // 드래그 핸들 ref 콜백
    const setHandleRef = useCallback((el, index) => {
        handleRefs.current[index] = el;
    }, []);

    function toggleDisabled(icdCode) {
        setDisabledItems((prev) => {
            const next = new Set(prev);
            if (next.has(icdCode)) next.delete(icdCode);
            else next.add(icdCode);
            return next;
        });
    }

    // 순서 변경 (드래그앤드롭 + 키보드 공통)
    function moveItem(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= orderedSuggestions.length) return;
        const next = [...orderedSuggestions];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setOrderedSuggestions(next);

        // 스크린리더 알림
        if (liveRef.current) {
            liveRef.current.textContent = `${moved.disease_name}, ${toIndex + 1}/${next.length} 위치로 이동됨`;
        }
    }

    // 드래그 핸들 키보드 조작 — 이동 후 focus 복원
    function handleDragKeyDown(e, index) {
        if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            moveItem(index, index - 1);
            requestAnimationFrame(() => handleRefs.current[index - 1]?.focus());
        } else if (e.key === 'ArrowDown' && index < orderedSuggestions.length - 1) {
            e.preventDefault();
            moveItem(index, index + 1);
            requestAnimationFrame(() => handleRefs.current[index + 1]?.focus());
        }
    }

    function handleDragStart(e, index) {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e, index) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    }

    function handleDragEnd() {
        if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
            moveItem(dragIndex, dragOverIndex);
        }
        setDragIndex(null);
        setDragOverIndex(null);
    }

    return (
        <section className={styles.section}>
            <div className={styles['section-content']}>
                <div className={styles['section-header']}>
                    <AiIcon />
                    <h2 className={styles['section-title']}>AI Key Findings</h2>
                    <span className={styles['model-tag']}>{modelVersion}</span>
                    {/* 데이터보기 → D-F12 */}
                    <button
                        className={styles['data-link']}
                        aria-label="타임라인 차트 모달 열기 (D-F12)"
                    >
                        데이터보기 →
                    </button>
                </div>

                {/* 스크린리더 순서 변경 알림 */}
                <div ref={liveRef} aria-live="polite" className={styles['sr-only']} />

                {/* 와이어프레임: 드래그핸들 + 체크박스 + 조건명 목록 */}
                <ul
                    className={styles.items}
                    aria-label="AI 참고 키워드 목록"
                    aria-roledescription="재정렬 가능한 목록"
                >
                    {orderedSuggestions.map((item, index) => {
                        const isDisabled = disabledItems.has(item.icd_code);
                        const isDragging = dragIndex === index;
                        const isDragOver = dragOverIndex === index && dragIndex !== index;

                        const itemClasses = [
                            styles.item,
                            isDisabled ? styles['item--disabled'] : '',
                            isDragging ? styles['item--dragging'] : '',
                            isDragOver ? styles['item--drag-over'] : '',
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <li
                                key={item.icd_code}
                                className={itemClasses}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <span
                                    className={styles['drag-handle']}
                                    ref={(el) => setHandleRef(el, index)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${item.disease_name} 순서 변경, 위아래 화살표로 이동`}
                                    onKeyDown={(e) => handleDragKeyDown(e, index)}
                                    aria-roledescription="드래그 핸들"
                                >
                                    ⠿
                                </span>
                                <button
                                    className={styles['item-icon']}
                                    role="checkbox"
                                    aria-checked={!isDisabled}
                                    aria-label={`${item.disease_name} ${isDisabled ? '비활성화됨' : '활성화됨'}`}
                                    onClick={() => toggleDisabled(item.icd_code)}
                                />
                                <span className={styles['item-name']}>{item.disease_name}</span>
                            </li>
                        );
                    })}
                </ul>

                {/* AI 경고 — 닫기 불가, 영구 노출 */}
                <div className={styles['warnings-area']}>
                    <AiWarningBanner warnings={warnings} />
                </div>
            </div>
        </section>
    );
}
