import emphasize from "../_utils/emphasize";

export default function SectionProjectOverview() {
    return (
        <section className="section section-standalone section-project-overview">
            <div className="standalone-content">
                <h2 className="section-eyebrow">Project Overview</h2>
                <p className="section-headline-large">
                    바이브 코딩으로 직접 설계 &middot; 구현한 <em className="emphasis">AI</em> 보조
                    진료 서비스.
                </p>
                <p className="section-headline-large">
                    {emphasize(
                        "환자기록을 정리해 의사는 빨리 판단하고, 환자는 결과를 쉽게 이해할 수 있도록 했습니다."
                    )}
                </p>
            </div>
        </section>
    );
}
