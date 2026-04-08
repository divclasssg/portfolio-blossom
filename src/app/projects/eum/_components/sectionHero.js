import Link from "next/link";

export default function SectionHero() {
    return (
        <section className="section section-hero">
            <div className="content-container">
                <div className="marquee-header">
                    <h1 className="header-eyebrow">Eum</h1>
                    <p className="header-headline">환자와 의사를 이음.</p>
                    <p className="header-violator">기록이 진료가 되고, 진료가 이해로 남는.</p>
                </div>
                <div className="marquee-detail">
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-elevated"
                    >
                        Eum Demo 체험하기
                    </Link>
                </div>
                <div className="hero-asset"></div>
            </div>
        </section>
    );
}
