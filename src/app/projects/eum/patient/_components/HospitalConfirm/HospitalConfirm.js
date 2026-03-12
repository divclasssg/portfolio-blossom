import Link from 'next/link';
import styles from './HospitalConfirm.module.scss';

export default function HospitalConfirm({ hospitalName, address }) {
  return (
    <div className={styles['container']}>
      {/* 콘텐츠 영역 — 수직 중앙 */}
      <div className={styles['content']}>
        <h1 className={styles['question']}>이 병원에 오셨나요?</h1>

        <div className={styles['icon-circle']}>
          {/* 빌딩 아이콘 */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <rect x="10" y="8" width="28" height="34" rx="2" stroke="#8E8E93" strokeWidth="2.5" />
            <rect x="18" y="14" width="4" height="4" rx="0.5" fill="#8E8E93" />
            <rect x="26" y="14" width="4" height="4" rx="0.5" fill="#8E8E93" />
            <rect x="18" y="22" width="4" height="4" rx="0.5" fill="#8E8E93" />
            <rect x="26" y="22" width="4" height="4" rx="0.5" fill="#8E8E93" />
            <rect x="20" y="32" width="8" height="10" rx="1" fill="#8E8E93" />
          </svg>
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
      <div className={styles['actions']}>
        <Link
          href="/projects/eum/patient/checkin/consent"
          className={styles['btn-primary']}
        >
          맞아요, 체크인 할게요
        </Link>
        <Link
          href="/projects/eum/patient/checkin/find"
          className={styles['btn-secondary']}
        >
          아니오, 다른 병원이에요 <span aria-hidden="true">›</span>
        </Link>
      </div>
    </div>
  );
}
