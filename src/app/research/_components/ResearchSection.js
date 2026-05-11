/**
 * Research 본문 섹션의 공통 프레임.
 *
 * 일반 케이스 (wrap=true, 기본):
 *   <section className="section section-{name}" aria-labelledby="{name}-heading">
 *     <div className="section-content">
 *       <h2 id="{name}-heading" className="section-eyebrow">{eyebrow}</h2>
 *       {headline && <p className="section-headline">{headline}</p>}
 *       {children}
 *     </div>
 *   </section>
 *
 * 예외 케이스 (wrap=false):
 *   한 section 안에 .section-content가 여러 개 있을 때 사용한다.
 *   사용처가 모든 .section-content를 직접 작성하고, h2/headline도 직접 책임진다.
 *   현재는 autonomous-vehicle-trust-ux의 quantitative-analysis 1곳에서만 사용.
 *
 * @param {object} props
 * @param {string} props.name - kebab-case (예: "overview"). className·id에 사용.
 * @param {string} [props.eyebrow] - h2 본문. wrap=true일 때만 사용.
 * @param {string} [props.headline] - .section-headline 본문. wrap=true일 때만 사용.
 * @param {boolean} [props.wrap=true] - false면 children을 .section-content로 자동 감싸지 않는다.
 * @param {import("react").ReactNode} props.children
 */
export default function ResearchSection({
    name,
    eyebrow,
    headline,
    wrap = true,
    children,
}) {
    const headingId = `${name}-heading`;
    const sectionClassName = `section section-${name}`;

    if (!wrap) {
        return (
            <section className={sectionClassName} aria-labelledby={headingId}>
                {children}
            </section>
        );
    }

    return (
        <section className={sectionClassName} aria-labelledby={headingId}>
            <div className="section-content">
                <h2 id={headingId} className="section-eyebrow">
                    {eyebrow}
                </h2>
                {headline && <p className="section-headline">{headline}</p>}
                {children}
            </div>
        </section>
    );
}
