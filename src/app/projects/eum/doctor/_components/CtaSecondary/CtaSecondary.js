import styles from './CtaSecondary.module.scss';

// CTA Secondary 버튼 — 텍스트만, 배경 없음
export default function CtaSecondary({
    children,
    as: Tag = 'button',
    className,
    ...rest
}) {
    return (
        <Tag
            className={`${styles['cta-secondary']}${className ? ` ${className}` : ''}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}
