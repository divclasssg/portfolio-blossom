import ResearchPagination from "./ResearchPagination";

/**
 * Research 페이지의 hero 섹션.
 *
 * 구조:
 *   <section className="section section-hero" aria-labelledby="hero-heading">
 *     <div className="section-content">
 *       <ResearchPagination position="top" />     ← 자동 포함
 *       <div className="hero-cover"><picture><img/></picture></div>
 *       <div className="hero-headline">{label, h1, subhead}</div>
 *       <div className="hero-meta"><dl>{meta}</dl></div>
 *       <div className="button-wrapper"><a className="button-primary"/></div>
 *     </div>
 *   </section>
 *
 * @param {object} props
 * @param {string} props.slug - ResearchPagination에 전달
 * @param {string} props.label - 상단 라벨 (예: "석사 학위 논문 - KCI등재")
 * @param {string} props.headline - h1 본문
 * @param {string} props.subhead - typography-subhead 본문
 * @param {{ src: string, width: number, height: number, alt?: string }} props.cover
 * @param {Array<{ term: string, description: import("react").ReactNode }>} props.meta
 *   각 항목이 dt/dd로 렌더된다. description은 ReactNode (em/strong/br 허용).
 * @param {{ href: string, label: string, ariaLabel: string }} props.download
 */
export default function ResearchHero({
    slug,
    label,
    headline,
    subhead,
    cover,
    meta,
    download,
}) {
    return (
        <section className="section section-hero" aria-labelledby="hero-heading">
            <div className="section-content">
                <ResearchPagination currentSlug={slug} position="top" />
                <div className="hero-cover">
                    <picture>
                        <img
                            src={cover.src}
                            alt={cover.alt ?? ""}
                            width={cover.width}
                            height={cover.height}
                        />
                    </picture>
                </div>
                <div className="hero-headline">
                    <p className="label">{label}</p>
                    <h1 id="hero-heading" className="headline">
                        {headline}
                    </h1>
                    <p className="typography-subhead">{subhead}</p>
                </div>
                <div className="hero-meta">
                    <dl className="meta-list">
                        {meta.map((item) => (
                            <div key={item.term} className="meta-item">
                                <dt>{item.term}</dt>
                                <dd>{item.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <div className="button-wrapper">
                    <a
                        href={download.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-primary"
                        aria-label={download.ariaLabel}
                    >
                        {download.label}
                    </a>
                </div>
            </div>
        </section>
    );
}
