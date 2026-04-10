"use client";

import { useState } from "react";
import { CldImage } from "next-cloudinary";
import wireframeKeyScreens from "../_data/wireframeKeyScreens";
import emphasize from "../_utils/emphasize";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";

export default function SectionDevelopWireframe() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="section section-dd-develop-wireframe-to-prototype">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond 03. Develop</span>
                    Wireframe → prototype &middot; 프로토타입까지 이음.
                </h2>
                <p className="section-headline-small">
                    {emphasize(
                        "손스케치로 구조를 잡고, 바이브 코딩으로 실제 AI가 작동하는 프로토타입까지."
                    )}
                </p>
                <p className="typography-copy">
                    손스케치와 로우파이로 구조를 잡은 뒤, 바이브 코딩으로 실제 AI가 연결된
                    프로토타입까지 만들었습니다.
                </p>
                <AiWorkflowCallout>
                    바이브 코딩과 실제 AI 연결로 핵심 화면을 작동하는 프로토타입으로 구현했습니다.
                </AiWorkflowCallout>
            </div>
            <h3 className="visuallyhidden">Prototype Key Screens</h3>
            <div className="slider">
                <div
                    className="slider-content"
                    style={{ transform: `translateX(calc(-${activeIndex} * (696px + 24px)))` }}
                >
                    {wireframeKeyScreens.map((screen, i) => (
                        <div
                            className={`slider-item card-column${i === activeIndex ? " active" : ""}`}
                            key={screen.index}
                        >
                            <h4 className="card-column-eyebrow">
                                <span>{screen.index}</span>
                                {screen.title}
                            </h4>
                            <p className="typography-copy-bold">{screen.copy}</p>
                            <dl className="spec-list">
                                {screen.steps.map((step) => (
                                    <div className="spec-item" key={step.term}>
                                        <dt>{step.term}</dt>
                                        <dd>{step.desc}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="card-column-bottom">
                                <CldImage
                                    src={screen.image.src}
                                    alt={screen.image.alt}
                                    width={screen.image.width}
                                    height={screen.image.height}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="slider-controller">
                    <div className="slider-dots">
                        {wireframeKeyScreens.map((screen, i) => (
                            <button
                                type="button"
                                key={screen.index}
                                className={`slider-dot${i === activeIndex ? " active" : ""}`}
                                onClick={() => setActiveIndex(i)}
                                aria-label={`${screen.index} ${screen.title}`}
                            />
                        ))}
                    </div>
                    <div className="slider-arrows">
                        <button
                            type="button"
                            className={`slider-arrow${activeIndex > 0 ? " active" : ""}`}
                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                            aria-label="이전 슬라이드"
                        >
                            <span aria-hidden="true">{"<"}</span>
                        </button>
                        <button
                            type="button"
                            className={`slider-arrow${activeIndex < wireframeKeyScreens.length - 1 ? " active" : ""}`}
                            onClick={() =>
                                setActiveIndex((prev) =>
                                    Math.min(prev + 1, wireframeKeyScreens.length - 1)
                                )
                            }
                            aria-label="다음 슬라이드"
                        >
                            <span aria-hidden="true">{">"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
