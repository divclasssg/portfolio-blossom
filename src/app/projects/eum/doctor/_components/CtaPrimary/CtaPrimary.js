import styles from './CtaPrimary.module.scss';

// CTA Primary 버튼 — 의사 패널 하단 주요 액션
// as="a"로 링크, 기본은 button
export default function CtaPrimary({
    children,
    as: Tag = 'button',
    className,
    ...rest
}) {
    return (
        <Tag
            className={`${styles['cta-primary']}${className ? ` ${className}` : ''}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}
