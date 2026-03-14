import styles from './FooterCta.module.scss';

// 하단 고정 CTA — [결과 작성] → D-001
export default function FooterCta() {
    return (
        <footer className={styles.footer}>
            <a
                href="/projects/eum/doctor/result"
                className={styles['cta-btn']}
                aria-label="결과 작성 화면으로 이동 (D-001)"
            >
                결과 작성
            </a>
        </footer>
    );
}
