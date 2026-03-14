import Link from 'next/link';
import styles from './AppBar.module.scss';
import { ArrowIcon, BellIcon } from '../../../_components/icons';

export default function AppBar({ backHref, unreadCount = 0 }) {
    return (
        <header className={styles['app-bar']} role="banner">
            {backHref && (
                <Link href={backHref} className={styles['back-btn']} aria-label="뒤로 가기">
                    <ArrowIcon variant="left" size={20} />
                </Link>
            )}
            <span className={styles['title']}>Eum</span>
            {!backHref && (
                <button
                    className={styles['bell-btn']}
                    aria-label={unreadCount > 0 ? `알림 ${unreadCount}개 (준비 중)` : '알림 (준비 중)'}
                    type="button"
                    disabled
                >
                    <BellIcon variant="basic" size={22} />
                    {unreadCount > 0 && (
                        <span className={styles['badge']} aria-hidden="true">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
        </header>
    );
}
