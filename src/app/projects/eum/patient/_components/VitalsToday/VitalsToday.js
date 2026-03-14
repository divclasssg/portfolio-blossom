import styles from './VitalsToday.module.scss';

export default function VitalsToday({ vitals, wearableDevice }) {
    const { heart_rate_bpm, bp_systolic, bp_diastolic, sleep_hours, step_count } = vitals;

    // 웨어러블 기기 → 출처 라벨 변환
    const sourceLabel = wearableDevice === 'apple' ? '출처: Apple Health' : wearableDevice === 'galaxy' ? '출처: Samsung Health' : '출처: 건강 데이터';

    const rows = [
        { label: '심박수', value: `${heart_rate_bpm ?? '—'} bpm` },
        { label: '혈압', value: `${bp_systolic ?? '—'}/${bp_diastolic ?? '—'} mmHg` },
        { label: '수면', value: `${sleep_hours ?? '—'}시간` },
        { label: '걸음 수', value: `${step_count?.toLocaleString('ko-KR') ?? '—'}보` },
    ];

    return (
        <section className={styles['section']} aria-labelledby="vitals-title">
            <h2 id="vitals-title" className={styles['section-title']}>
                오늘의 건강
            </h2>
            <div className={`home-card ${styles.card}`}>
                <ul className={styles['list']}>
                    {rows.map(({ label, value }) => (
                        <li key={label} className={styles['row']}>
                            <span className={styles['label']}>{label}</span>
                            <span className={styles['value']}>{value}</span>
                        </li>
                    ))}
                </ul>
                <p className={styles['source']}>{sourceLabel}</p>
            </div>
        </section>
    );
}
