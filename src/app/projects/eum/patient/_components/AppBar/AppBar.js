import Link from 'next/link';
import styles from './AppBar.module.scss';
import { ArrowIcon, BellIcon } from '../../../_components/icons';

export default function AppBar({ backHref }) {
  return (
    <header className={styles['app-bar']} role="banner">
      {backHref && (
        <Link href={backHref} className={styles['back-btn']} aria-label="뒤로 가기">
          <ArrowIcon variant="left" size={20} />
        </Link>
      )}
      <span className={styles['title']}>Eum</span>
      {!backHref && (
        /* 알림 버튼 — 포트폴리오 데모: 기능 미구현 */
        <button
          className={styles['bell-btn']}
          aria-label="알림"
          type="button"
        >
          <BellIcon variant="basic" size={22} />
        </button>
      )}
    </header>
  );
}
