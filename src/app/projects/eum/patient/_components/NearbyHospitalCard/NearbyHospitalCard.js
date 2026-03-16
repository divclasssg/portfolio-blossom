import Link from 'next/link';
import { LocationIcon } from '../../../_components/icons';
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
                    <LocationIcon size={14} />
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
