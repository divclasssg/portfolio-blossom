"use client";

import { CldImage } from "next-cloudinary";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import keyChanges from "../_data/keyChanges";
import emphasize from "../_utils/emphasize";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionDeliverKeyChanges() {
    return (
        <section className="section section-dd-deliver-key-changes">
            <h2 className="visuallyhidden">Eum Key Changes</h2>
            {keyChanges.map((item) => (
                <div className="key-change-wrapper" key={item.title}>
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
                            <CldImage
                                src={item.asIs.src}
                                alt={item.asIs.alt}
                                width={item.asIs.width}
                                height={item.asIs.height}
                                style={{ width: item.asIs.imgWidth, height: "auto" }}
                            />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        {item.toBe && (
                            <figure className="to-be">
                                {item.toBe.isVideo ? (
                                    <div style={{ width: item.toBe.imgWidth }}>
                                        <CldVideoPlayer
                                            id={`tobe-video-${item.toBe.src}`}
                                            src={item.toBe.src}
                                            width={item.toBe.width - 100}
                                            height={item.toBe.height}
                                            autoplay={true}
                                            loop={true}
                                            muted={true}
                                            controls={false}
                                            playsinline={true}
                                            transformation={[
                                                {
                                                    crop: "crop",
                                                    x: 110,
                                                    y: 0,
                                                    width: item.toBe.width - 200,
                                                    height: item.toBe.height,
                                                },
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    <CldImage
                                        src={item.toBe.src}
                                        alt={item.toBe.alt}
                                        width={item.toBe.width}
                                        height={item.toBe.height}
                                        style={{ width: item.toBe.imgWidth, height: "auto" }}
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
