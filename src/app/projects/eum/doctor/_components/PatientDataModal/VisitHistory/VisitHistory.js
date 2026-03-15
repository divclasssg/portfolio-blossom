'use client';

import { useState } from 'react';
import styles from './VisitHistory.module.scss';

// "2025-11-28" → "2025. 11. 28."
const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${y}. ${m}. ${d}.`;
};

// 병원별 상세 데이터 — JSON에 없는 필드 보완 (포트폴리오 목업)
const HOSPITAL_DETAIL = {
    서현내과의원: {
        shortName: '서현내과',
        visitType: '방문외래',
        address: '경기도 성남시 분당구 서현 264-1',
        prescriptions: [
            '에소메프라졸 40mg — 28일',
            '돔페리돈 10mg — 28일',
            '알긴산나트륨 10mL — 14일',
        ],
    },
};

const DEFAULT_DETAIL = {
    shortName: '-',
    visitType: '방문외래',
    address: '',
    prescriptions: [],
};

function getDetail(hospital) {
    return HOSPITAL_DETAIL[hospital] ?? DEFAULT_DETAIL;
}

export default function VisitHistory({ data }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [sortAsc, setSortAsc] = useState(false); // 기본: 최신순

    const handleSortToggle = () => {
        setSortAsc(!sortAsc);
        setSelectedIdx(null); // 정렬 변경 시 상세 패널 닫기
    };

    const sorted = [...data].sort((a, b) =>
        sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );

    const selectedVisit = selectedIdx !== null ? sorted[selectedIdx] : null;
    const detail = selectedVisit ? getDetail(selectedVisit.hospital) : null;

    const handleRowClick = (idx) => {
        setSelectedIdx(selectedIdx === idx ? null : idx); // 같은 행 재클릭 → 닫기
    };

    return (
        <div className={styles['visit-history']}>
            {/* 테이블 + 상세 패널 분할 */}
            <div className={styles.body}>
                {/* 테이블 */}
                <div className={styles['table-area']}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col" className={styles['col-date']}>
                                    <button
                                        className={styles['sort-btn']}
                                        onClick={handleSortToggle}
                                        aria-label={`날짜 ${sortAsc ? '내림차순으로 변경' : '오름차순으로 변경'}`}
                                    >
                                        날짜
                                        <span className={styles['sort-icon']} aria-hidden="true">
                                            {sortAsc ? '↑' : '↓'}
                                        </span>
                                    </button>
                                </th>
                                <th scope="col" className={styles['col-diagnosis']}>
                                    진단명
                                </th>
                                <th scope="col" className={styles['col-hospital']}>
                                    진료기관
                                </th>
                                <th scope="col" className={styles['col-type']}>
                                    진료 유형
                                </th>
                                <th
                                    scope="col"
                                    className={styles['col-action']}
                                    aria-label="상세 보기"
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((visit, i) => {
                                const d = getDetail(visit.hospital);
                                return (
                                    <tr
                                        key={i}
                                        className={`${styles.row} ${selectedIdx === i ? styles['row--selected'] : ''}`}
                                        onClick={() => handleRowClick(i)}
                                        aria-expanded={selectedIdx === i}
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRowClick(i)}
                                    >
                                        <td className={styles['col-date']}>
                                            {formatDate(visit.date)}
                                        </td>
                                        <td className={styles['col-diagnosis']}>
                                            {visit.diagnosis}
                                        </td>
                                        <td className={styles['col-hospital']}>{visit.hospital}</td>
                                        <td className={styles['col-type']}>
                                            <span className={styles['type-badge']}>
                                                {d.visitType}
                                            </span>
                                        </td>
                                        <td className={styles['col-action']} aria-hidden="true">
                                            <span
                                                className={`${styles.chevron} ${selectedIdx === i ? styles['chevron--open'] : ''}`}
                                            >
                                                ›
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 상세 패널 — 행 선택 시 표시 */}
                {selectedVisit && detail && (
                    <div
                        className={styles['detail-panel']}
                        role="complementary"
                        aria-label="진료 상세 정보"
                    >
                        <h3 className={styles['detail-name']}>{detail.shortName}</h3>
                        {/* 주호소 — 있을 때만 표시 */}
                        {selectedVisit.chief_complaint && (
                            <p className={styles['detail-complaint']}>{selectedVisit.chief_complaint}</p>
                        )}
                        {detail.address && (
                            <p className={styles['detail-address']}>
                                <span className={styles['address-pin']} aria-hidden="true" />
                                {detail.address}
                            </p>
                        )}
                        {detail.prescriptions.length > 0 && (
                            <ul className={styles['prescription-list']}>
                                {detail.prescriptions.map((p, i) => (
                                    <li key={i} className={styles['prescription-item']}>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* 검사 결과 — 있을 때만 표시 */}
                        {selectedVisit.lab_results?.length > 0 && (
                            <>
                                <h4 className={styles['detail-subtitle']}>검사 결과</h4>
                                <ul className={styles['lab-list']}>
                                    {selectedVisit.lab_results.map((lab, i) => (
                                        <li key={i} className={styles['lab-item']}>
                                            <span className={styles['lab-name']}>{lab.test_name}</span>
                                            <span className={styles['lab-value']}>{lab.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 데이터 출처 푸터 */}
            <div className={styles.footer}>
                <span className={styles['footer-dot']} aria-hidden="true" />
                <span>의료 마이데이터</span>
            </div>
        </div>
    );
}
