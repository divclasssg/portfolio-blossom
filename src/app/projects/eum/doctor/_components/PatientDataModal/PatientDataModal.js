'use client';

import { useEffect, useRef, useState } from 'react';
import { usePatientDataModal } from './PatientDataModalContext';
import ModalHeader from './ModalHeader/ModalHeader';
import TabBar from './TabBar/TabBar';
import FilterBar from './FilterBar/FilterBar';
import ChartGrid from './ChartGrid/ChartGrid';
import VisitHistory from './VisitHistory/VisitHistory';
import styles from './PatientDataModal.module.scss';

export default function PatientDataModal({ patient, chartData }) {
    const { isOpen, close } = usePatientDataModal();
    const [activeTab, setActiveTab] = useState('symptoms');

    // 필터 상태 — FilterBar → ChartGrid 연결
    const [activePeriod, setActivePeriod] = useState('1month');
    const [activeCategory, setActiveCategory] = useState('all');
    const [customRange, setCustomRange] = useState(null); // { startDate, endDate }

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
                                chartData={chartData}
                                activePeriod={activePeriod}
                                activeCategory={activeCategory}
                                customRange={customRange}
                            />
                        </div>
                    )}
                    {/* 진료이력 탭 — VisitHistory가 자체 스크롤 관리 */}
                    {activeTab === 'visit-history' && (
                        <VisitHistory data={chartData.tabs.visit_history.data} />
                    )}
                </div>
            </div>
        </>
    );
}
