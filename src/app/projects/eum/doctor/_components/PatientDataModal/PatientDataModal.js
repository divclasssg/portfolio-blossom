'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { usePatientDataModal } from './PatientDataModalContext';
import ModalHeader from './ModalHeader/ModalHeader';
import TabBar from './TabBar/TabBar';
import FilterBar from './FilterBar/FilterBar';
import ChartGrid from './ChartGrid/ChartGrid';
import VisitHistory from './VisitHistory/VisitHistory';
import styles from './PatientDataModal.module.scss';

// DB symptom_records → 차트 데이터 형식 변환
function symptomToChartItem(record) {
    const date = record.occurred_at?.slice(0, 10); // "YYYY-MM-DD"
    const rawLabel = record.description || record.voice_transcript || '';
    return {
        date,
        severity: record.severity,
        category: record.category_code,
        label: rawLabel.length > 20 ? rawLabel.slice(0, 20) + '...' : rawLabel,
        source: 'patient_input',
    };
}

export default function PatientDataModal({ patient, chartData, liveSymptoms }) {
    const { isOpen, close, initialTab } = usePatientDataModal();
    const [activeTab, setActiveTab] = useState(initialTab);

    // 모달 열릴 때마다 initialTab으로 리셋
    useEffect(() => {
        if (isOpen) setActiveTab(initialTab);
    }, [isOpen, initialTab]);

    // 필터 상태 — FilterBar → ChartGrid 연결
    const [activePeriod, setActivePeriod] = useState('1month');
    const [activeCategory, setActiveCategory] = useState('all');
    const [customRange, setCustomRange] = useState(null); // { startDate, endDate }

    // DB 증상이 있으면 차트 데이터의 symptoms 탭을 동적으로 교체, 없으면 정적 JSON 폴백
    const mergedChartData = useMemo(() => {
        if (!liveSymptoms || liveSymptoms.length === 0) return chartData;

        return {
            ...chartData,
            tabs: {
                ...chartData.tabs,
                symptoms: {
                    ...chartData.tabs.symptoms,
                    data: liveSymptoms.map(symptomToChartItem),
                },
            },
        };
    }, [chartData, liveSymptoms]);

    const modalRef = useRef(null);

    // ESC 닫기 + Tab focus trap 통합 핸들러
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                close();
                return;
            }
            if (e.key !== 'Tab') return;

            const focusableEls = Array.from(
                modalRef.current.querySelectorAll(
                    'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
            if (!focusableEls.length) return;

            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];
            const active = document.activeElement;

            if (e.shiftKey) {
                // Shift+Tab: 첫 요소에서 마지막으로 순환
                if (active === first || !modalRef.current.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab: 마지막 요소에서 첫 요소로 순환
                if (active === last || !modalRef.current.contains(active)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, close]);

    // 모달 열릴 때 포커스 이동
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    // 탭 전환 시 필터 초기화
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActivePeriod('1month');
        setActiveCategory('all');
        setCustomRange(null);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* dim overlay — 클릭으로 닫기 */}
            <div className={styles.overlay} onClick={close} aria-hidden="true" />

            {/* modal */}
            <div
                ref={modalRef}
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-label="환자 데이터 — 증상 타임라인"
                tabIndex={-1}
            >
                <ModalHeader patient={patient} onClose={close} />
                <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

                {/* 필터 — 증상: 기간+카테고리, 진료이력: 기간만 */}
                {(activeTab === 'symptoms' || activeTab === 'visit-history') && (
                    <FilterBar
                        activePeriod={activePeriod}
                        onPeriodChange={setActivePeriod}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                        onCustomRange={setCustomRange}
                        showCategory={activeTab === 'symptoms'}
                    />
                )}

                {/* 콘텐츠 영역 */}
                <div className={styles.content}>
                    {/* 증상 탭 — ChartGrid는 스크롤 래퍼 필요 */}
                    {activeTab === 'symptoms' && (
                        <div className={styles['chart-scroll']}>
                            <ChartGrid
                                chartData={mergedChartData}
                                activePeriod={activePeriod}
                                activeCategory={activeCategory}
                                customRange={customRange}
                            />
                        </div>
                    )}
                    {/* 진료이력 탭 — VisitHistory가 자체 스크롤 관리 */}
                    {activeTab === 'visit-history' && (
                        <VisitHistory data={mergedChartData.tabs.visit_history.data} />
                    )}
                </div>
            </div>
        </>
    );
}
