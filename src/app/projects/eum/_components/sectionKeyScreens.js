"use client";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import finalKeyScreens from "../_data/finalKeyScreens";

export default function SectionKeyScreens() {
    return (
        <section className="section section-keyscreens">
            <div className="keyscreen-container">
                <h2 className="visuallyhidden">Eum Final Key Screens</h2>
                {finalKeyScreens.map((screen) => (
                    <div className="keyscreen-content" key={screen.index}>
                        <div className="keyscreen-callout">
                            <h3 className="keyscreen-callout-header">
                                {screen.index}
                                <span className="visuallyhidden">Key Screen</span>
                            </h3>
                            <p className="keyscreen-callout-headline">{screen.headline}</p>
                            <p className="keyscreen-callout-copy">{screen.copy}</p>
                        </div>
                        <div className="keyscreen-overview">
                            <CldVideoPlayer
                                id={`keyscreen-video-${screen.index.replace("#", "")}`}
                                src={screen.video}
                                width={screen.width}
                                height={screen.height}
                                autoplay={true}
                                loop={true}
                                muted={true}
                                controls={false}
                                playsinline={true}
                                transformation={
                                    screen.crop
                                        ? [
                                              {
                                                  crop: "crop",
                                                  x: screen.crop.x,
                                                  y: screen.crop.y,
                                                  width: screen.crop.width,
                                                  height: screen.crop.height,
                                              },
                                          ]
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
