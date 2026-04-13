import IconArrow from "@/_components/icons/arrow";
import "../_style/home.scss";
import Link from "next/link";
import Image from "next/image";

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
                <nav className="homenav">
                    <div className="homenav-content">
                        <ul className="homenav-list">
                            <li className="homenav-item">
                                <Link href="/about" target="_self" className="homenav-link">
                                    about
                                    <span>
                                        <IconArrow size={12} />
                                    </span>
                                </Link>
                            </li>
                            <li className="homenav-item">
                                <Link href="/projects/eum" target="_self" className="homenav-link">
                                    eum, 2026
                                    <span>
                                        <IconArrow size={12} />
                                    </span>
                                </Link>
                            </li>
                            <li className="homenav-item">
                                <Link
                                    href="/projects/cronometer"
                                    target="_self"
                                    className="homenav-link"
                                >
                                    cronometer, 2025 -- 2026
                                    <span>
                                        <IconArrow size={12} />
                                    </span>
                                </Link>
                            </li>
                            <li className="homenav-item">
                                <Link
                                    href="/projects/liverpoolfc"
                                    target="_self"
                                    className="homenav-link"
                                >
                                    liverpool fc, 2025
                                    <span>
                                        <IconArrow size={12} />
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <section className="section section-portfolio-intro">
                    <div className="intro-content eum">
                        <div className="intro-image-wrapper">
                            <Image
                                src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/images/main/eum.jpg"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1344px"
                                alt="prjects Eum"
                            />
                        </div>
                    </div>
                </section>
            </main>
            <footer className="homefooter">
                &copy; 2025 -- 2026 parkseik. All rights reserved.
            </footer>
        </>
    );
}
