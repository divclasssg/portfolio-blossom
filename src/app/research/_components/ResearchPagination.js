import Link from "next/link";
import { asset } from "@/_lib/media";
import { getResearchNeighbors } from "../_data/researchPages";

export default function ResearchPagination({ currentSlug }) {
    const { prev, next } = getResearchNeighbors(currentSlug);
    if (!prev && !next) return null;

    return (
        <nav className="research-pagination" aria-label="이전 다음 글 이동">
            {prev && (
                <Link
                    href={`/research/${prev.slug}`}
                    className="research-pagination-link research-pagination-link-prev"
                >
                    <picture>
                        <img
                            src={asset(`research/${prev.slug}/cover.webp`)}
                            alt=""
                            width={prev.cover.width}
                            height={prev.cover.height}
                            loading="lazy"
                        />
                    </picture>
                    <span className="research-pagination-text">
                        <span className="research-pagination-label">← Previous</span>
                        <span className="research-pagination-title">{prev.title}</span>
                    </span>
                </Link>
            )}
            {next && (
                <Link
                    href={`/research/${next.slug}`}
                    className="research-pagination-link research-pagination-link-next"
                >
                    <span className="research-pagination-text">
                        <span className="research-pagination-label">Next →</span>
                        <span className="research-pagination-title">{next.title}</span>
                    </span>
                    <picture>
                        <img
                            src={asset(`research/${next.slug}/cover.webp`)}
                            alt=""
                            width={next.cover.width}
                            height={next.cover.height}
                            loading="lazy"
                        />
                    </picture>
                </Link>
            )}
        </nav>
    );
}
