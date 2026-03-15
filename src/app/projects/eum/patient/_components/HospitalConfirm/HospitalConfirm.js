'use client';

import { useRouter } from 'next/navigation';
import { BuildingIcon } from '../../../_components/icons';
import CtaButton from '../CtaButton/CtaButton';
import styles from './HospitalConfirm.module.scss';

export default function HospitalConfirm({ hospitalName, address }) {
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
                    {/* 핀 아이콘 */}
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

            {/* CTA 영역 — 하단 고정 */}
            <div className={`footer ${styles['footer']}`}>
                <CtaButton onClick={() => router.push('/projects/eum/patient/checkin/consent')}>
                    맞아요, 체크인 할게요
                </CtaButton>
                <CtaButton
                    variant="tertiary"
                    onClick={() => router.push('/projects/eum/patient/checkin/find')}
                >
                    아니오, 다른 병원이에요
                </CtaButton>
            </div>
        </main>
    );
}
