"use client";

import "../_style/eum.heroSection.scss";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

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
                <div className="hero-asset">
                    <div className="doctor">
                        <CldImage
                            src="hero-section-image-width-frame_1_u73y0d"
                            fill
                            sizes="(max-width: 768px) 90vw, 1200px"
                            quality={100}
                            alt="Eum 메인 히어로 — 의사 일러스트"
                        />
                    </div>
                    <div className="patient">
                        <CldImage
                            src="main-hero-asset-patient_sa44wl"
                            fill
                            sizes="(max-width: 768px) 60vw, 600px"
                            quality={100}
                            alt="Eum 메인 히어로 — 환자 일러스트"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
