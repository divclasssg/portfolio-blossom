"use client";

import { useCallback, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";
import defineMethodology from "../_data/defineMethodology";
import emphasize from "../_utils/emphasize";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";
import ExternalLink from "./_shared/ExternalLink";

const ITEM_COUNT = defineMethodology.length;

// 이미지 타이밍
const IMG_IN_END = 0.22; //  0 ~ 22% : 아래에서 부드럽게 슬라이드 업 (opacity 1)
const IMG_DIM_START = 0.3; // 22 ~ 30% : 정지 (크리스프)
const IMG_DIM_END = 0.55; // 30 ~ 55% : opacity 1 → DIM (텍스트 진입과 동시)
// 55 ~ 82% : DIM opacity 유지 (희미한 배경)
// 82 ~ 100%: 텍스트와 함께 DIM → 0

// 텍스트 타이밍
const TXT_IN_START = 0.3;
const TXT_IN_END = 0.55;
const HOLD_END = 0.82; // 55 ~ 82% : HOLD (읽기 시간)

const IMG_RISE_VH = 15; // 이미지 등장 시작 오프셋 (vh)
const IMG_DRIFT_VH = 3; // 이미지 fade out 시 상향 드리프트 (vh)
const IMG_DIM_OPACITY = 0.08; // 텍스트 진입 후 이미지가 남는 opacity
const TXT_RISE_PX = 120; // 텍스트 슬라이드 거리 (px)

const easeOut = (t) => 1 - (1 - t) * (1 - t);
// smoothStep: 시작·끝 모두 천천히 (S-curve). 이미지 rise에 사용.
const smoothStep = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export default function SectionDefine() {
    const containerRef = useRef(null);
    const imageRefs = useRef([]);
    const contentRefs = useRef([]);
    const rafRef = useRef(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollTop = -rect.top;
        const scrollHeight = container.offsetHeight - window.innerHeight;
        if (scrollHeight <= 0) return;

        const totalProgress = clamp01(scrollTop / scrollHeight);
        const segmentSize = 1 / ITEM_COUNT;

        // ── 이미지: 첫 이미지는 slide-up, 이후는 fade-in → 정지 → DIM → HOLD → 텍스트와 함께 fade out ──
        imageRefs.current.forEach((el, i) => {
            if (!el) return;

            const local = (totalProgress - i * segmentSize) / segmentSize;
            const isFirst = i === 0;

            let tyVh;
            let op;

            if (local < 0) {
                // 세그먼트 이전 — 모든 이미지 IMG_RISE_VH 아래, 숨김
                tyVh = IMG_RISE_VH;
                op = 0;
            } else if (local < IMG_IN_END) {
                // 등장 — 모든 이미지 slide-up, 첫 이미지는 op 1 고정 / 나머지는 fade-in 동반
                const t = smoothStep(local / IMG_IN_END);
                tyVh = (1 - t) * IMG_RISE_VH;
                op = isFirst ? 1 : t;
            } else if (local < IMG_DIM_START) {
                // 정지 — 크리스프
                tyVh = 0;
                op = 1;
            } else if (local < IMG_DIM_END) {
                // 텍스트 진입과 동시에 opacity 1 → DIM
                const t = easeOut(
                    (local - IMG_DIM_START) / (IMG_DIM_END - IMG_DIM_START)
                );
                tyVh = 0;
                op = 1 - t * (1 - IMG_DIM_OPACITY);
            } else if (local < HOLD_END) {
                // HOLD — 희미한 배경으로 유지
                tyVh = 0;
                op = IMG_DIM_OPACITY;
            } else if (local < 1) {
                // 텍스트 퇴출과 함께 DIM → 0
                const t = easeOut((local - HOLD_END) / (1 - HOLD_END));
                tyVh = -t * IMG_DRIFT_VH;
                op = IMG_DIM_OPACITY * (1 - t);
            } else {
                tyVh = -IMG_DRIFT_VH;
                op = 0;
            }

            el.style.transform = `translate3d(0, ${tyVh}vh, 0)`;
            el.style.opacity = String(clamp01(op));
        });

        // ── 텍스트: slide-up + fade-in → HOLD → slide-up + fade-out ──
        contentRefs.current.forEach((el, i) => {
            if (!el) return;

            const local = (totalProgress - i * segmentSize) / segmentSize;

            let tyPx;
            let op;

            if (local < TXT_IN_START) {
                tyPx = TXT_RISE_PX;
                op = 0;
            } else if (local < TXT_IN_END) {
                const raw = (local - TXT_IN_START) / (TXT_IN_END - TXT_IN_START);
                // 움직임은 smoothStep (부드러운 S-curve), opacity는 easeOut (자연스러운 fade)
                tyPx = (1 - smoothStep(raw)) * TXT_RISE_PX;
                op = easeOut(raw);
            } else if (local < HOLD_END) {
                tyPx = 0;
                op = 1;
            } else if (local < 1) {
                const raw = (local - HOLD_END) / (1 - HOLD_END);
                tyPx = -smoothStep(raw) * TXT_RISE_PX;
                op = 1 - easeOut(raw);
            } else {
                tyPx = -TXT_RISE_PX;
                op = 0;
            }

            const opClamped = clamp01(op);
            el.style.transform = `translate3d(0, ${tyPx}px, 0)`;
            el.style.opacity = String(opClamped);
            // HOLD 구간에서만 링크 클릭 가능
            el.style.pointerEvents = opClamped > 0.5 ? "auto" : "none";
        });
    }, []);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    return (
        <section className="section section-dd-define">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    02. Define &middot; 소통의 끊김을 읽음.
                </h2>
                <p className="section-headline-small">
                    {emphasize("진료시간 5분은 환자와 의사 모두에게 소통하기 부족한 시간.")}
                </p>
                <p className="typography-copy">
                    검사 결과가 정상이어도 환자에겐 불안이 남았고, 환자 경험은 짧은 진료 안에서
                    충분히 쓰이지 못했습니다. 문제를 &apos;환자 기록 → 진료 맥락, 진료 결과 → 환자
                    이해와 다음 행동&apos;이 끊기는 구조로 정의했습니다.
                </p>
                <AiWorkflowCallout>
                    AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.
                </AiWorkflowCallout>
                <div className="callout-wrapper">
                    <h3 className="visuallyhidden">환자와 의료진에게 필요했던 것</h3>
                    <div className="callout-content patient">
                        <h4 className="section-callout">&quot;환자에게 필요했던 것&quot;</h4>
                        <p className="typography-callout-headline">
                            왜 그런 결과이고, 다음에 무엇을 해야 하는지.
                        </p>
                        <p className="typography-callout-copy">
                            정상이라는 말은 환자에게 정보가 아니라 “갈 길이 없다”는 상태로 느껴졌고,
                            환자가 원한 것은 결과 한 줄이 아니라 이유와 다음 단계가 연결된
                            구조였습니다.
                        </p>
                    </div>
                    <div className="callout-content doctor">
                        <h4 className="section-callout">&quot;의료진에게 필요했던 것&quot;</h4>
                        <p className="typography-callout-headline">
                            짧은 시간 안에 빠르게 훑을 수 있는 요약.
                        </p>
                        <p className="typography-callout-copy">
                            의료진에게 더 필요한 것은 더 많은 정보가 아니라, 판단에 바로 쓸 수 있는
                            핵심 정보와 한눈에 읽히는 요약 포맷이었습니다. 소스에서도 최소 의사결정
                            정보와 선호 포맷을 따로 구조화했고, “눈에 팍 보이게” 읽히는 정보가
                            필요하다는 표현이 반복되었습니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="define-methodology-scroll" ref={containerRef}>
                <h3 className="visuallyhidden">UX Research Methodology</h3>

                <div className="define-methodology-sticky">
                    {/* 이미지 레이어 — 아래에서 슬라이드 업, 블러 처리 */}
                    <div className="define-methodology-image-frame">
                        {defineMethodology.map((item, i) => (
                            <div
                                className="define-methodology-image"
                                key={item.title}
                                ref={(el) => {
                                    imageRefs.current[i] = el;
                                }}
                            >
                                <CldImage
                                    src={item.image.src}
                                    alt={item.image.alt}
                                    width={item.image.width}
                                    height={item.image.height}
                                    sizes="90vw"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 텍스트 레이어 — 이미지 위로 겹쳐 슬라이드 업 */}
                    <div className="define-methodology-callout-frame">
                        {defineMethodology.map((item, i) => (
                            <div
                                className="define-methodology-content"
                                key={item.title}
                                ref={(el) => {
                                    contentRefs.current[i] = el;
                                }}
                            >
                                <h4 className="section-label">{item.title}</h4>
                                <p className="section-headline-small">
                                    {emphasize(item.headline)}
                                </p>
                                {item.paragraphs.map((paragraph, index) => (
                                    <p className="typography-copy" key={index}>
                                        {paragraph}
                                    </p>
                                ))}
                                <div className="tag-wrapper">
                                    <h5 className="visuallyhidden">
                                        UX Research Methodology keywords
                                    </h5>
                                    <ul className="tags">
                                        {item.tags.map((tag) => (
                                            <li className="tags-item" key={tag}>
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <ExternalLink href={item.link.href}>
                                    {item.link.label}
                                </ExternalLink>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
