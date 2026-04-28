import keyInsights from "../_data/keyInsights";
import ContentItem from "./_shared/ContentItem";

export default function SectionKeyInsights() {
    return (
        <section
            className="section section-key-insights"
            aria-labelledby="key-insights-heading"
        >
            <div className="section-content">
                <h2 id="key-insights-heading" className="section-eyebrow">
                    Key Insights
                </h2>
                <p className="section-headline-large">
                    리디자인의 핵심은 더 많이 보여주는 것이 아니라, 무엇을 먼저 보여줄지 결정하는
                    것이었습니다.
                </p>
                <div className="content-wrapper">
                    {keyInsights.map((item) => (
                        <ContentItem
                            key={item.index}
                            index={item.index}
                            title={item.title}
                            copy={item.copy}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
