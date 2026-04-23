"use client";

import "../_style/section.hero.scss";
import Image from "next/image";
import { asset } from "../_lib/media";
import { HERO_DOCTOR_BLUR, HERO_PATIENT_BLUR } from "../_data/heroBlur";
import ExternalLink from "./_shared/ExternalLink";

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
                    <ExternalLink href="#" variant="elevated">
                        Eum Demo 체험하기
                    </ExternalLink>
                </div>
                <div className="hero-asset">
                    <div className="doctor">
                        <Image
                            src={asset("eum/hero-section-image-width-frame_1_u73y0d.png")}
                            fill
                            sizes="(max-width: 768px) 50vw, 750px"
                            quality={85}
                            preload
                            placeholder="blur"
                            blurDataURL={HERO_DOCTOR_BLUR}
                            alt="Eum 메인 히어로 — 의사 일러스트"
                        />
                    </div>
                    <div className="patient">
                        <Image
                            src={asset("eum/main-hero-asset-patient_sa44wl.png")}
                            fill
                            sizes="(max-width: 768px) 20vw, 300px"
                            quality={85}
                            loading="eager"
                            fetchPriority="high"
                            placeholder="blur"
                            blurDataURL={HERO_PATIENT_BLUR}
                            alt="Eum 메인 히어로 — 환자 일러스트"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
