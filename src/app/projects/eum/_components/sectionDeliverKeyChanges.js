"use client";

import Image from "next/image";
import { asset, sizes, QUALITY_UI } from "../_lib/media";
import keyChanges from "../_data/keyChanges";
import emphasize from "../_utils/emphasize";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionDeliverKeyChanges() {
    return (
        <section className="section section-dd-deliver-key-changes">
            <h2 className="visuallyhidden">Eum Key Changes</h2>
            {keyChanges.map((item, index) => (
                <div className={`key-change-wrapper key-change-${String(index + 1).padStart(2, "0")}`} key={item.title}>
                    <div className="key-change-content">
                        <h3 className="key-change-headline">{item.title}</h3>
                        <p className="section-headline-small">{emphasize(item.headline)}</p>
                        <p className="typography-copy">{item.copy}</p>
                        <dl className="key-change-summary">
                            {item.spec.map((row) => (
                                <div className="key-change-item" key={row.term}>
                                    <dt>{row.term}</dt>
                                    <dd>{row.desc}</dd>
                                </div>
                            ))}
                        </dl>
                        <ExternalLink href={item.link.href}>{item.link.label}</ExternalLink>
                    </div>
                    <div className="key-change-assets">
                        <figure>
                            <Image
                                src={asset(item.asIs.src)}
                                alt={item.asIs.alt}
                                width={item.asIs.width}
                                height={item.asIs.height}
                                style={{ width: item.asIs.imgWidth, height: "auto" }}
                                sizes={sizes.fixed(item.asIs.imgWidth)}
                                quality={QUALITY_UI}
                            />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        {item.toBe && (
                            <figure className="to-be">
                                {item.toBe.isVideo ? (
                                    <CroppedVideo toBe={item.toBe} />
                                ) : (
                                    <Image
                                        src={asset(item.toBe.src)}
                                        alt={item.toBe.alt}
                                        width={item.toBe.width}
                                        height={item.toBe.height}
                                        style={{ width: item.toBe.imgWidth, height: "auto" }}
                                        sizes={sizes.fixed(item.toBe.imgWidth)}
                                        quality={QUALITY_UI}
                                    />
                                )}
                                <figcaption>TO-BE</figcaption>
                            </figure>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}

function CroppedVideo({ toBe }) {
    // 과거 CldVideoPlayer는 isVideo인 경우 기본값(110, 0, W-200, H)으로 항상 크롭했음.
    // 동일 동작 유지 — cropX/Y/W/H 명시가 없어도 디폴트로 좌우 100px씩 제거.
    const cropX = toBe.cropX ?? 110;
    const cropY = toBe.cropY ?? 0;
    const cropWidth = toBe.cropWidth ?? toBe.width - 200;
    const cropHeight = toBe.cropHeight ?? toBe.height;

    return (
        <div style={{ width: toBe.imgWidth }}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: `${cropWidth} / ${cropHeight}`,
                    overflow: "hidden",
                }}
            >
                <video
                    src={asset(toBe.src)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: "absolute",
                        left: `${(-cropX / cropWidth) * 100}%`,
                        top: `${(-cropY / cropHeight) * 100}%`,
                        width: `${(toBe.width / cropWidth) * 100}%`,
                        height: `${(toBe.height / cropHeight) * 100}%`,
                        maxWidth: "none",
                        display: "block",
                    }}
                />
            </div>
        </div>
    );
}
