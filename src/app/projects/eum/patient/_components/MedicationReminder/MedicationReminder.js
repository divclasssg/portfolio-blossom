import styles from './MedicationReminder.module.scss';

// "HH:MM" → "오전/오후 H:MM"
function formatTime(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${ampm} ${displayHour}:${minuteStr}`;
}

const STATUS_KO = {
    taken: '복용 완료',
    pending: '복용 예정',
    missed: '복용 누락',
};

export default function MedicationReminder({ reminder, activeCount }) {
    const { next_medication, scheduled_time, status } = reminder;

    return (
        <section className={styles['section']} aria-labelledby="medication-title">
            <h2 id="medication-title" className={styles['section-title']}>
                복약 알림
            </h2>
            <div className={styles['card']}>
                {/* 약명 + 상태 배지 */}
                <div className={styles['top-row']}>
                    <span className={styles['med-name']}>{next_medication}</span>
                    <span
                        className={styles['badge']}
                        data-status={status}
                        aria-label={`복약 상태: ${STATUS_KO[status] ?? status}`}
                    >
                        {STATUS_KO[status] ?? status}
                    </span>
                </div>

                {/* 다음 복용 예정 */}
                <p className={styles['next-time']}>다음 복용 예정 : {formatTime(scheduled_time)}</p>

                <hr className={styles['divider']} />

                {/* 복용 중 약 수 */}
                <p className={styles['active-count']}>
                    현재 복용 중인 약 : <strong>{activeCount}종</strong>
                </p>
            </div>
        </section>
    );
}
