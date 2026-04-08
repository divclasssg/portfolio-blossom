import Image from "next/image";
import Link from "next/link";
import keyChanges from "../_data/keyChanges";
import emphasize from "../_utils/emphasize";

export default function SectionDeliverKeyChanges() {
    return (
        <section className="section section-dd-deliver-key-changes">
            <h2 className="visuallyhidden">Eum Key Changes</h2>
            {keyChanges.map((item) => (
                <div className="key-change-item" key={item.title}>
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
                        <Link
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-primary"
                        >
                            {item.link.label}
                        </Link>
                    </div>
                    <div className="key-change-assets">
                        <figure>
                            <Image src={item.asIs.src} alt={item.asIs.alt} />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        <figure>
                            <Image src={item.toBe.src} alt={item.toBe.alt} />
                            <figcaption>TO-BE</figcaption>
                        </figure>
                    </div>
                </div>
            ))}
        </section>
    );
}
