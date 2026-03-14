'use client';

import { useState } from 'react';
import styles from './DateRangePicker.module.scss';

// 오늘 날짜 (max 제약용) — YYYY-MM-DD 형식
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

export default function DateRangePicker({ onApply, onCancel }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const today = getTodayStr();

    const isApplyDisabled = !startDate || !endDate || startDate > endDate;

    return (
        <div className={styles.dropdown} role="group" aria-label="기간 직접 입력">
            <div className={styles.inputs}>
                <label className={styles.label}>
                    <span className={styles['label-text']}>시작일</span>
                    <input
                        type="date"
                        className={styles.input}
                        value={startDate}
                        max={endDate || today}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <span className={styles.separator} aria-hidden="true">
                    –
                </span>
                <label className={styles.label}>
                    <span className={styles['label-text']}>종료일</span>
                    <input
                        type="date"
                        className={styles.input}
                        value={endDate}
                        min={startDate}
                        max={today}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.actions}>
                <button className={styles['btn-cancel']} onClick={onCancel} type="button">
                    취소
                </button>
                <button
                    className={styles['btn-apply']}
                    onClick={() => onApply?.({ startDate, endDate })}
                    disabled={isApplyDisabled}
                    type="button"
                    aria-disabled={isApplyDisabled}
                >
                    적용
                </button>
            </div>
        </div>
    );
}
