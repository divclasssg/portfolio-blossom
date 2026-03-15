'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './AiSuggestions.module.scss';
import ActionButton from '../ActionButton/ActionButton';
import { ArrowIcon, DragHandleIcon } from '../../../_components/icons';
import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';

const CONFIDENCE_MAP = {
    high: { icon: '●', label: '높음', className: 'confidence-high' },
    medium: { icon: '◐', label: '중간', className: 'confidence-medium' },
    low: { icon: '○', label: '낮음', className: 'confidence-low' },
};

const JUDGMENT_OPTIONS = [
    { value: null, label: '미결' },
    { value: 'agree', label: '동의' },
    { value: 'hold', label: '보류' },
    { value: 'exclude', label: '제외' },
];

// AI Key Findings (와이어프레임 섹션명)
// "진단", "확진" 표현 금지 — 참고 키워드로 표시 (CLAUDE.md §금지사항)
export default function AiSuggestions({ suggestions, modelVersion }) {
    const { open: openDataModal } = usePatientDataModal();
    const [orderedSuggestions, setOrderedSuggestions] = useState(suggestions || []);

    // prop 변경 시 동기화 (파이프라인 완료 후 suggestions가 뒤늦게 도착하는 경우)
    useEffect(() => {
        if (suggestions) setOrderedSuggestions(suggestions);
    }, [suggestions]);
    const [judgments, setJudgments] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);
    const [expandedItem, setExpandedItem] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const liveRef = useRef(null);
    const handleRefs = useRef([]);

    const setHandleRef = useCallback((el, index) => {
        handleRefs.current[index] = el;
    }, []);

    function setJudgment(icdCode, value) {
        setJudgments((prev) => ({ ...prev, [icdCode]: value }));
        setOpenDropdown(null);
    }

    // 드롭다운 외부 클릭 닫기
    useEffect(() => {
        if (!openDropdown) return;
        function handleClickOutside() { setOpenDropdown(null); }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdown]);

    function toggleExpand(icdCode) {
        setExpandedItem((prev) => (prev === icdCode ? null : icdCode));
    }

    function moveItem(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= orderedSuggestions.length) return;
        const next = [...orderedSuggestions];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setOrderedSuggestions(next);

        if (liveRef.current) {
            liveRef.current.textContent = `${moved.disease_name}, ${toIndex + 1}/${next.length} 위치로 이동됨`;
        }
    }

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
        <div className={styles['subsection']}>
            <div className={styles['subsection-header']}>
                <h3 className={styles['subsection-title']}>Key Findings</h3>
                <ActionButton
                    variant="text"
                    aria-label="타임라인 차트 모달 열기 (D-F12)"
                    onClick={openDataModal}
                >
                    데이터보기
                </ActionButton>
            </div>

            <span className="model-tag">{modelVersion}</span>

                <div ref={liveRef} aria-live="polite" className="sr-only" />

                <p className={styles['list-guide']}>
                    드래그하여 순서를 조정하고, 각 항목에 의사 판단을 표시할 수 있습니다
                </p>

                <p className={styles['confidence-legend']}>
                    <span className={styles['confidence-high']}>● 높음</span> 주요 근거 충분
                    <span>|</span>
                    <span className={styles['confidence-medium']}>◐ 중간</span> 추가 검사 권장
                    <span>|</span>
                    <span className={styles['confidence-low']}>○ 낮음</span> AI 감별 판단
                </p>

                <ul
                    className={styles.items}
                    aria-label="AI 참고 키워드 목록"
                    aria-roledescription="재정렬 가능한 목록"
                >
                    {orderedSuggestions.map((item, index) => {
                        const judgment = judgments[item.icd_code] ?? null;
                        const isDisabled = judgment === 'exclude';
                        const isDragging = dragIndex === index;
                        const isDragOver = dragOverIndex === index && dragIndex !== index;
                        const conf = CONFIDENCE_MAP[item.confidence] ?? CONFIDENCE_MAP.low;
                        const isOpen = expandedItem === item.icd_code;
                        const currentLabel = JUDGMENT_OPTIONS.find((o) => o.value === judgment).label;

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
                                {/* 헤더 행: 드래그핸들 + 질환명 + ICD + confidence + 판단 드롭다운 + 아코디언 토글 */}
                                <div className={styles['item-header']}>
                                    <span
                                        className={styles['drag-handle']}
                                        ref={(el) => setHandleRef(el, index)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`${item.disease_name} 순서 변경, 위아래 화살표로 이동`}
                                        onKeyDown={(e) => handleDragKeyDown(e, index)}
                                        aria-roledescription="드래그 핸들"
                                    >
                                        <DragHandleIcon size={14} color="currentColor" />
                                    </span>
                                    <button
                                        className={styles['item-name']}
                                        onClick={() => toggleExpand(item.icd_code)}
                                        aria-expanded={isOpen}
                                    >
                                        {item.disease_name}
                                    </button>
                                    {/* icd_code가 순수 숫자면 entity ID → 표시하지 않음 */}
                                    {item.icd_code && !/^\d+$/.test(item.icd_code) && (
                                        <span className={styles['icd-tag']}>{item.icd_code}</span>
                                    )}
                                    <span className={styles[conf.className]} aria-label={`신뢰도: ${conf.label}`}>
                                        {conf.icon} {conf.label}
                                    </span>
                                    <div className={styles['judgment-wrapper']}>
                                        <button
                                            className={`${styles['judgment-trigger']} ${styles[`judgment--${judgment ?? 'pending'}`]}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDropdown((prev) => prev === item.icd_code ? null : item.icd_code);
                                            }}
                                            aria-haspopup="listbox"
                                            aria-expanded={openDropdown === item.icd_code}
                                            aria-label={`${item.disease_name} 의사 판단: ${currentLabel}`}
                                        >
                                            {currentLabel} ▾
                                        </button>
                                        {openDropdown === item.icd_code && (
                                            <ul className={styles['judgment-menu']} role="listbox">
                                                {JUDGMENT_OPTIONS.map((opt) => (
                                                    <li
                                                        key={opt.value ?? 'pending'}
                                                        role="option"
                                                        aria-selected={judgment === opt.value}
                                                        className={styles['judgment-option']}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setJudgment(item.icd_code, opt.value);
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <button
                                        className={styles.chevron}
                                        onClick={() => toggleExpand(item.icd_code)}
                                        aria-expanded={isOpen}
                                        aria-label={`${item.disease_name} 상세 ${isOpen ? '닫기' : '열기'}`}
                                    >
                                        <ArrowIcon
                                            variant={isOpen ? 'up' : 'down'}
                                            size={12}
                                            color="currentColor"
                                        />
                                    </button>
                                </div>

                                {/* 아코디언 상세 영역 */}
                                {isOpen && (
                                    <div className={styles['item-detail']}>
                                        {item.evidence_symptoms?.length > 0 && (
                                            <ul className={styles['evidence-list']} aria-label="근거 증상">
                                                {item.evidence_symptoms.map((ev) => (
                                                    <li key={ev} className={styles['evidence-chip']}>{ev}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {item.clinical_note && (
                                            <p className={styles['clinical-note']}>{item.clinical_note}</p>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

        </div>
    );
}
