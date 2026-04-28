import problemItems from "../_data/problemItems";
import ContentItem from "./_shared/ContentItem";

export default function SectionProblem() {
    return (
        <section className="section section-problem" aria-labelledby="problem-heading">
            <div className="section-content">
                <h2 id="problem-heading" className="section-eyebrow">
                    Problem
                </h2>
                <p className="section-headline-large">
                    콘텐츠는 많았지만, 팬이 따라갈 흐름은 약했습니다.
                </p>
                <p className="typography-copy">
                    기존 Liverpool FC 홈페이지는 뉴스, 상품, 광고, 경기 정보를 한 화면 안에 강하게
                    노출하고 있었습니다. 콘텐츠의 양은 충분했지만, 사용자가 어떤 정보를 먼저 보고
                    어떤 행동으로 이어져야 하는지는 명확하지 않았습니다.
                </p>
                <p className="typography-copy">
                    특히 Liverpool FC의 상징색인 레드는 강력한 브랜드 자산이지만, 카드, 배너, CTA,
                    섹션 배경에 반복적으로 사용되며 시각적 노이즈를 만들고 있었습니다. 이로 인해
                    여러 요소가 동시에 주목을 끄는 competing focal points가 발생했습니다.
                </p>
                <div className="content-wrapper">
                    {problemItems.map((item) => (
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
