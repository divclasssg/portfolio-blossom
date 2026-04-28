import Image from "next/image";

export default function ResearchCard({ title, headline, copy, image, modifier }) {
    return (
        <div className={`card-item${modifier ? ` ${modifier}` : ""}`}>
            <div className="img-wrapper">
                <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>
            <div className="caption-content">
                <h3>{title}</h3>
                <p className="section-headline-small">{headline}</p>
                <p className="typography-copy">{copy}</p>
            </div>
        </div>
    );
}
