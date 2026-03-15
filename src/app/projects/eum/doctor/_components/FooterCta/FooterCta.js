import CtaPrimary from '../CtaPrimary/CtaPrimary';

// 하단 고정 CTA — [결과 작성] → D-001
export default function FooterCta() {
    return (
        <footer className="cta-footer">
            <CtaPrimary
                as="a"
                href="/projects/eum/doctor/result"
                aria-label="결과 작성 화면으로 이동 (D-001)"
            >
                결과 작성
            </CtaPrimary>
        </footer>
    );
}
