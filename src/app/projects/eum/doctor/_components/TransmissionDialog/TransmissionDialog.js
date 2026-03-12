'use client';

import { useEffect, useRef } from 'react';
import styles from './TransmissionDialog.module.scss';

// D-001 전송 확인 모달 (DOCTOR_DASHBOARD / 5)
export default function TransmissionDialog({
  isOpen,
  onClose,
  onConfirm,
  patientName,
}) {
  const cancelBtnRef = useRef(null);
  const cardRef = useRef(null);

  // 열릴 때 취소 버튼 포커스
  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
    }
  }, [isOpen]);

  // Escape 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // 포커스 트랩: Tab/Shift+Tab이 모달 내부 버튼에서만 순환
      if (e.key === 'Tab') {
        const focusable = cardRef.current?.querySelectorAll('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      {/* 카드 클릭 시 오버레이 닫기 방지 */}
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className={styles.title}>
          전송 확인
        </h2>

        <p className={styles.body}>
          {patientName} 환자에게 진료 결과를 전송합니다. EMR에도 기록됩니다.
        </p>

        <div className={styles.actions}>
          <button
            ref={cancelBtnRef}
            className={styles['btn-cancel']}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={styles['btn-confirm']}
            onClick={onConfirm}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
