import styles from './Chip.module.scss';

// Chip — 아이콘+텍스트 pill, 테두리 있음
// variant: 'default' (회색), 'danger' (빨강), 'info' (파랑)
export default function Chip({
    children,
    variant = 'default',
    className,
    ...rest
}) {
    const cls = [
        styles.chip,
        styles[`chip--${variant}`],
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={cls} {...rest}>
            {children}
        </span>
    );
}
