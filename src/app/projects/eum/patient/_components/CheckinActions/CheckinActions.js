'use client';

import { useRouter } from 'next/navigation';
import styles from './CheckinActions.module.scss';

export default function CheckinActions() {
    const router = useRouter();

    return (
        <div className={styles['actions']}>
            <button
                className={styles['checkin-btn']}
                type="button"
                onClick={() => router.push('/projects/eum/patient')}
            >
                체크인
            </button>
            <button
                className={styles['decline-btn']}
                type="button"
                onClick={() => router.back()}
            >
                거절 &gt;
            </button>
        </div>
    );
}
