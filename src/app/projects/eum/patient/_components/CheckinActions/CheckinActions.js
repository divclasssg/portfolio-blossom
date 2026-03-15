'use client';

import { useRouter } from 'next/navigation';
import CtaButton from '../CtaButton/CtaButton';
import styles from './CheckinActions.module.scss';

export default function CheckinActions() {
    const router = useRouter();

    return (
        <div className={`footer ${styles['footer']}`}>
            <CtaButton onClick={() => router.push('/projects/eum/patient')}>
                체크인
            </CtaButton>
            <CtaButton variant="tertiary" onClick={() => router.back()}>
                거절
            </CtaButton>
        </div>
    );
}
