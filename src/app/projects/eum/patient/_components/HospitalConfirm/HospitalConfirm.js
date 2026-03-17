'use client';

import { useRouter } from 'next/navigation';
import { BuildingIcon, LocationIcon } from '../../../_components/icons';
import CtaButton from '../CtaButton/CtaButton';
import styles from './HospitalConfirm.module.scss';

export default function HospitalConfirm({ hospitalName, address, patientId }) {
    const router = useRouter();

    return (
        <main className="page">
            {/* 콘텐츠 영역 — 수직 중앙 */}
            <div className={styles['content']}>
                <h1 className="title">이 병원에 오셨나요?</h1>

                <div className={styles['icon-circle']}>
                    <BuildingIcon size={48} color="#007aff" />
                </div>

                <p className={styles['hospital-name']}>{hospitalName}</p>
                <p className={styles['address']}>
                    <LocationIcon size={14} />
                    {address}
                </p>
            </div>

            {/* CTA 영역 — 하단 고정 */}
            <div className={`footer ${styles['footer']}`}>
                <CtaButton onClick={() => router.push(`/projects/eum/patient/${patientId}/checkin/consent`)}>
                    맞아요, 체크인 할게요
                </CtaButton>
                <CtaButton
                    variant="tertiary"
                    onClick={() => router.push(`/projects/eum/patient/${patientId}/checkin/find`)}
                >
                    아니오, 다른 병원이에요
                </CtaButton>
            </div>
        </main>
    );
}
