import Link from 'next/link';
import styles from './NearbyHospitalCard.module.scss';

// 거리 포맷: 1000m 미만 → "300m", 이상 → "1.2km"
function formatDistance(meters) {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
}

export default function NearbyHospitalCard({ hospitalName, address, distanceM, href }) {
    return (
        <article className={styles['card']}>
            <div className={styles['card-body']}>
                <div className={styles['card-header']}>
                    <span className={styles['hospital-name']}>{hospitalName}</span>
                    <span className={styles['distance-badge']}>{formatDistance(distanceM)}</span>
                </div>
                <p className={styles['address']}>
                    {/* 핀 아이콘 — HospitalConfirm 패턴 */}
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {address}
                </p>
            </div>
            <Link
                href={href}
                className={styles['register-btn']}
                aria-label={`${hospitalName} 체크인`}
            >
                체크인
            </Link>
        </article>
    );
}
