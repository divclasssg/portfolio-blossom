import iaTransition from "../_data/iaTransition";
import IaSummaryCard from "./_shared/IaSummaryCard";
import IaTransitionList from "./_shared/IaTransitionList";

export default function SectionInformationArchitecture() {
    return (
        <section
            className="section section-information-architecture"
            aria-labelledby="ia-heading"
        >
            <div className="section-content">
                <h2 id="ia-heading" className="section-eyebrow">
                    Information Architecture
                </h2>
                <p className="section-headline-large">
                    페이지 구조는 콘텐츠 피드에서
                    <br />팬 여정으로 재편했습니다.
                </p>
                <div className="card-wrapper">
                    {iaTransition.summary.map((card) => (
                        <IaSummaryCard
                            key={card.label}
                            label={card.label}
                            subtitle={card.subtitle}
                            copy={card.copy}
                        />
                    ))}
                </div>
                <div className="ia-transition-map">
                    <IaTransitionList type="as-is" label="AS-IS" items={iaTransition.asIs} />
                    <IaTransitionList type="to-be" label="TO-BE" items={iaTransition.toBe} />
                </div>
            </div>
        </section>
    );
}
