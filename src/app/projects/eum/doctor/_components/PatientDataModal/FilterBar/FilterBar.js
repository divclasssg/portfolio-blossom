'use client';

import DateRangePicker from '../DateRangePicker/DateRangePicker';
import styles from './FilterBar.module.scss';

const PERIODS = [
    { id: '1day', label: '1일' },
    { id: '1week', label: '1주' },
    { id: '1month', label: '1개월' },
    { id: '6months', label: '6개월' },
    { id: '1year', label: '1년' },
    { id: 'custom', label: '직접입력' },
];

const CATEGORIES = [
    { id: 'all', label: '전체' },
    { id: 'digestive', label: '#소화기' },
    { id: 'autonomic', label: '#심리/자율' },
];

// showCategory=false 시 카테고리 칩 + 범례 숨김 (진료이력 탭 전용)
export default function FilterBar({
    activePeriod,
    onPeriodChange,
    activeCategory,
    onCategoryChange,
    onCustomRange,
    showCategory = true,
}) {
    return (
        <div className={styles['filter-bar']}>
            {/* 기간 필터 */}
            <div className={styles['period-row']}>
                <div className={styles['period-group']} role="group" aria-label="기간 선택">
                    {PERIODS.map((period) => (
                        <button
                            key={period.id}
                            className={`${styles['period-btn']} ${activePeriod === period.id ? styles['period-btn--active'] : ''}`}
                            onClick={() => onPeriodChange(period.id)}
                            aria-pressed={activePeriod === period.id}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>

                {/* 직접입력 선택 시 드롭다운 */}
                {activePeriod === 'custom' && (
                    <DateRangePicker
                        onApply={(range) => onCustomRange(range)}
                        onCancel={() => onPeriodChange('1month')}
                    />
                )}
            </div>

            {/* 카테고리 칩 — 증상 탭 전용 */}
            {showCategory && (
                <div
                    className={styles['category-group']}
                    role="group"
                    aria-label="증상 카테고리 필터"
                >
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles['category-chip']} ${activeCategory === cat.id ? styles['category-chip--active'] : ''}`}
                            onClick={() => onCategoryChange(cat.id)}
                            aria-pressed={activeCategory === cat.id}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
