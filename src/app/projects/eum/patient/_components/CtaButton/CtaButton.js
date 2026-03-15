'use client';

import styles from './CtaButton.module.scss';

export default function CtaButton({
    variant = 'primary',
    disabled = false,
    onClick,
    type = 'button',
    className,
    children,
}) {
    const classes = [
        styles['cta-button'],
        styles[variant],
        className,
    ].filter(Boolean).join(' ');

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
