'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResultFooterCta.module.scss';
import TransmissionDialog from '../TransmissionDialog/TransmissionDialog';

// D-001 하단 CTA — 확인 및 전송 / 취소
export default function ResultFooterCta({ patientName }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTransmitted, setIsTransmitted] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    setIsDialogOpen(false);
    setIsTransmitted(true);
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

  return (
    <footer className={styles.footer}>
      <button
        className={styles['cta-btn']}
        onClick={() => setIsDialogOpen(true)}
        aria-label="진료 결과 확인 및 전송, 진료 종료"
      >
        확인 및 전송 · 진료 종료 →
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
