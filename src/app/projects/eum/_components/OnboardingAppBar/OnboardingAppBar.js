import Link from 'next/link';
import styles from './OnboardingAppBar.module.scss';
import { ArrowIcon } from '../icons';

/**
 * 온보딩 앱바
 * variant="logo"     — 이음 로고만 (P-000, P-001, P-014)
 * variant="progress" — 뒤로가기 + 진행률 바 (P-002 ~ P-013)
 */
export default function OnboardingAppBar({
  variant = 'progress',
  step = 0,
  totalSteps = 11,
  backHref,
}) {
  const progressPct = totalSteps > 0 ? Math.round((step / totalSteps) * 100) : 0;

  return (
    <header className={styles['app-bar']} role="banner">
      <div className={styles['app-bar-inner']}>
        {variant === 'progress' && backHref && (
          <Link
            href={backHref}
            className={styles['back-btn']}
            aria-label="뒤로 가기"
          >
            <ArrowIcon variant="left" size={20} />
          </Link>
        )}
        <span className={styles['logo']}>이음</span>
      </div>

      {variant === 'progress' && (
        <div
          className={styles['progress-track']}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-label={`온보딩 ${totalSteps}단계 중 ${step}단계`}
        >
          <div
            className={styles['progress-fill']}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </header>
  );
}
