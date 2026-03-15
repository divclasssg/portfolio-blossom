import styles from './Badge.module.scss';

// 기본 뱃지 — 회색 pill, 작은 폰트
export default function Badge({ children, as: Tag = 'span', className, ...rest }) {
    return (
        <Tag
            className={`${styles.badge}${className ? ` ${className}` : ''}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}
