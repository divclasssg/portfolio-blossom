'use client';

import Link from 'next/link';
import styles from './CtaButton.module.scss';

export default function CtaButton({
    variant = 'primary',
    disabled = false,
    onClick,
    href,
    type = 'button',
    className,
    children,
}) {
    const classes = [
        styles['cta-button'],
        styles[variant],
        className,
    ].filter(Boolean).join(' ');

    // href가 있으면 Link로 렌더 (순수 네비게이션)
    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
