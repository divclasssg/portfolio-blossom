import researchCards from "../_data/researchCards";
import ResearchCard from "./_shared/ResearchCard";

export default function SectionResearch() {
    return (
        <section className="section section-research" aria-labelledby="research-heading">
            <div className="section-content">
                <h2 id="research-heading" className="section-eyebrow">
                    Research
                </h2>
                <p className="section-headline-large">
                    팬은 공식 홈페이지에서 목적성 정보를 먼저 찾고 있었습니다.
                </p>
                <p className="typography-copy">
                    리서치 결과, 팬은 감성적인 콘텐츠보다 경기 일정, 라인업, 티켓, 순위, 선수
                    정보처럼 명확한 목적을 가진 정보를 먼저 찾고 있었습니다.
                </p>
                <div className="card-wrapper">
                    {researchCards.map((card) => (
                        <ResearchCard
                            key={card.slug}
                            title={card.title}
                            headline={card.headline}
                            copy={card.copy}
                            image={card.image}
                            modifier={card.modifier}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
