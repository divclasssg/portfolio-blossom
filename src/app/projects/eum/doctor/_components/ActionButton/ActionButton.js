import { forwardRef } from 'react';
import styles from './ActionButton.module.scss';

const ActionButton = forwardRef(function ActionButton(
    { children, onClick, className, variant = 'filled', ...rest },
    ref
) {
    const variantClass = variant === 'text' ? styles['action-btn--text'] : '';

    return (
        <button
            ref={ref}
            className={`${styles['action-btn']} ${variantClass} ${className || ''}`}
            onClick={onClick}
            {...rest}
        >
            <span>{children}</span>
            <svg
                className={styles.chevron}
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M1 1l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
});

export default ActionButton;
