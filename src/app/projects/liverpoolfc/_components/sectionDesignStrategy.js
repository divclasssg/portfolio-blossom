import designStrategy from "../_data/designStrategy";
import StrategyCard from "./_shared/StrategyCard";

export default function SectionDesignStrategy() {
    return (
        <section
            className="section section-design-strategy"
            aria-labelledby="design-strategy-heading"
        >
            <div className="section-content">
                <h2 id="design-strategy-heading" className="section-eyebrow">
                    Design Strategy
                </h2>
                <p className="section-headline-large">
                    리디자인의 기준은
                    <br />
                    팬의 목적과 클럽 정체성을 함께
                    <br />
                    만족시키는 것이었습니다.
                </p>
                <p className="typography-copy">
                    팬이 필요한 정보를 빠르게 찾고, 클럽의 정체성에 몰입하고,
                    <br />
                    자연스럽게 다음 행동으로 이어지도록 페이지 흐름을 다시 설계했습니다.
                </p>
                <div className="card-wrapper">
                    {designStrategy.map((card) => (
                        <StrategyCard key={card.title} title={card.title} copy={card.copy} />
                    ))}
                </div>
            </div>
        </section>
    );
}
