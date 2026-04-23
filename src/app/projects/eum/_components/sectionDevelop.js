"use client";

import Image from "next/image";
import { asset, sizes, QUALITY_UI } from "../_lib/media";
import developProcess from "../_data/developProcess";
import emphasize from "../_utils/emphasize";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionDevelop() {
    return (
        <section className="section section-dd-develop">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    03. Develop &middot; 판단과 이해를 이음.
                </h2>
                <p className="section-headline-small">
                    {emphasize(
                        "기능을 줄이고, 환자 기록 → 의사 판단 → 환자 이해로 이어지는 최소 구조만."
                    )}
                </p>
                <p className="typography-copy">
                    기능 수가 아니라 핵심 루프가 기준이었습니다. 기록이 진료로 연결되고, 판단이 환자
                    이해로 이어지는 흐름만 남겼습니다.
                </p>
                <AiWorkflowCallout>
                    AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.
                </AiWorkflowCallout>
                <ExternalLink href="#">원문 데이터 보기</ExternalLink>
            </div>
            <div className="section-content-wide">
                <div className="card-wrapper">
                    {developProcess.map((item) => (
                        <div className="card-process" key={item.title}>
                            <div className="card-process-content">
                                <h3 className="card-process-headline">{item.title}</h3>
                                <p className="card-process-typography-copy">{item.copy}</p>
                            </div>
                            <div className="card-process-screenshot">
                                <Image
                                    src={asset(item.image.src)}
                                    alt={item.image.alt}
                                    width={item.image.width}
                                    height={item.image.height}
                                    sizes="(max-width: 768px) 90vw, 800px"
                                    quality={QUALITY_UI}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
