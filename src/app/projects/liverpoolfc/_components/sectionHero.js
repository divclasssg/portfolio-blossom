import Link from "next/link";

export default function SectionHero() {
    return (
        <section className="section section-hero" aria-labelledby="hero-heading">
            <div className="hero-content">
                <div className="hero-background-image-wrapper">
                    <picture className="hero-background-image">
                        <img
                            src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_1x.png"
                            srcSet="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_1x.png 1x, https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_2x.png 2x"
                            alt="Liverpool FC 리뉴얼 히어로 이미지"
                            width="1920"
                            height="1169"
                        />
                    </picture>
                </div>
                <div className="marquee-header">
                    <span>Redesign</span>
                    <h1 id="hero-heading" className="header-eyebrow">
                        Liverpool FC
                    </h1>
                    <Link
                        href="/liverpoolfc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-elevated"
                    >
                        Liverpool FC 체험하기
                    </Link>
                </div>
            </div>
        </section>
    );
}
