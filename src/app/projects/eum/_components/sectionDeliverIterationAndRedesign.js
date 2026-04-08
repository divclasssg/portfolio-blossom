import Image from "next/image";
import emphasize from "../_utils/emphasize";

export default function SectionDeliverIterationAndRedesign() {
    return (
        <section className="section section-standalone section-dd-deliver-iteration-and-redesign">
            <div className="section-standalone">
                <div className="standalone-content">
                    <h2 className="section-eyebrow">
                        <span>Double Diamond 04. Deliver</span>
                        Iteration & Redesign &middot; 전달을 다시 이음.
                    </h2>
                    <p className="section-headline-large">
                        {emphasize(
                            "환자에게는 진료 결과의 이유와 다음에 무엇을 해야 하는지, 의사에게는 짧은 요약이 먼저 보이도록 다시 설계했습니다. 새 기능을 더한 것이 아니라, 이미 만든 구조가 더 잘 이해되도록 다듬는 과정이었습니다."
                        )}
                    </p>
                </div>
            </div>
            <div className="iteration-and-redesign-screenshot">
                <figure>
                    <Image src="" alt="핵심 루프 플로우차트" />
                    <figcaption>
                        <strong>핵심 루프 재설계 방향.</strong>
                        <span>
                            환자의 기록이 의사의 판단으로 이어지고, 그 판단이 다시 환자의 이해와
                            다음 행동으로 이어질 수 있게 전달 구조를 다시 설게했습니다.
                        </span>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}
