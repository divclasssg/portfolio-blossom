import Link from 'next/link';
import styles from './SummaryListItem.module.scss';

export default function SummaryListItem({
    sessionId,
    visitDate,
    hospitalName,
    doctorName,
    diagnosisName,
}) {
    return (
        <Link href={`/projects/eum/patient/summary/${sessionId}`} className={styles['item']}>
            <p className={styles['meta']}>
                {visitDate} · {hospitalName} · {doctorName}
            </p>
            <p className={styles['diagnosis']}>{diagnosisName}</p>
            <svg
                className={styles['chevron']}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M9 18l6-6-6-6" />
            </svg>
        </Link>
    );
}
