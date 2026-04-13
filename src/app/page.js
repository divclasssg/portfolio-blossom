import "../_style/home.scss";
import HomePortfolio from "@/_components/home-portfolio";

export default function Home() {
    return (
        <>
            <main id="main" className="main home">
                <section className="section section-hero">
                    <div className="hero-header">
                        <h1 className="hero-headline">세익 -- 世益 · [ se.ik ]</h1>
                        <h2 className="hero-subhead">Better Experiences, for a Better World.</h2>
                    </div>
                </section>
                <HomePortfolio />
            </main>
            <footer className="homefooter">
                &copy; 2025 -- 2026 parkseik. All rights reserved.
            </footer>
        </>
    );
}
