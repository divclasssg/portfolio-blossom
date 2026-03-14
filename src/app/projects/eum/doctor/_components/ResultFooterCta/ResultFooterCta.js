'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResultFooterCta.module.scss';
import TransmissionDialog from '../TransmissionDialog/TransmissionDialog';

// D-001 하단 CTA — 확인 및 전송 / 취소
export default function ResultFooterCta({
    patientName,
    sessionId,
    doctorId,
    doctorName,
    hospitalName,
    diagnosisName,
    resultData,
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTransmitted, setIsTransmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        setIsDialogOpen(false);
        setIsLoading(true);
        setIsError(false);

        try {
            const res = await fetch('/api/eum/transmit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    doctorId,
                    doctorName,
                    hospitalName,
                    diagnosisName,
                    content: resultData,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '전송 실패');
            }

            setIsTransmitted(true);
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isTransmitted) {
        return (
            <footer className={styles.footer}>
                <p className={styles['transmitted-msg']} role="status">
                    전송이 완료되었습니다.
                </p>
            </footer>
        );
    }

    if (isError) {
        return (
            <footer className={styles.footer}>
                <p className={styles['error-msg']} role="alert">
                    전송에 실패했습니다. 다시 시도해 주세요.
                </p>
                <button
                    className={styles['cta-btn']}
                    onClick={handleConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? '전송 중...' : '재시도 →'}
                </button>
            </footer>
        );
    }

    return (
        <footer className={styles.footer}>
            <button
                className={styles['cta-btn']}
                onClick={() => setIsDialogOpen(true)}
                disabled={isLoading}
                aria-label="진료 결과 확인 및 전송, 진료 종료"
            >
                {isLoading ? '전송 중...' : '확인 및 전송 · 진료 종료 →'}
            </button>
            <button
                className={styles['cancel-btn']}
                onClick={() => router.push('/projects/eum/doctor')}
                aria-label="결과 작성 취소, 이전 화면으로 돌아가기"
            >
                취소 →
            </button>

            <TransmissionDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirm}
                patientName={patientName}
            />
        </footer>
    );
}
