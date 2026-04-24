import emphasize from "../_utils/emphasize";

export default function SectionKeyTakeaways() {
    return (
        <section className="section section-key-takeaways">
            <div className="section-content">
                <h2 className="section-eyebrow">Key Takeaways</h2>
                <p className="section-headline-small">
                    {emphasize("문제는 명확했지만, 검증 환경은 제한적이었다.")}
                </p>
                <p className="typography-copy">
                    환자는 정상 결과를 받아도 판단의 이유와 다음 행동을 이해하지 못하고, 의료진은
                    짧은 시간 안에 환자 맥락을 파악하고 설명하기 어렵다. 다만 의료진 인터뷰 섭외가
                    쉽지 않아, 응답을 일반화하지 않고 반복적으로 드러난 공통 병목에 집중했다. 이
                    한계는 오히려 프로젝트 범위를 보수적으로 좁히는 기준이 되었다.
                </p>
                <p className="section-headline-small">
                    {emphasize("AI 기능보다 중요한 것은 정보의 연결이었다.")}
                </p>
                <p className="typography-copy">
                    핵심은 AI 기능 자체가 아니라, 기록된 정보가 의료진의 판단과 환자의 이해로
                    이어지는 구조였다. 의료진에게 필요한 건 더 많은 데이터가 아니라 판단에 쓸
                    우선순위였고, 환자에게 필요한 건 결과가 아니라 이유와 다음 행동이었다. 그래서
                    MVP는 기능을 늘리는 대신, 기록이 의료진의 판단으로 정리되고 다시 환자의 이해로
                    돌아오는 핵심 루프에 집중했다.
                </p>
                <p className="section-headline-small">
                    {emphasize("구현 과정에서 보이지 않던 제약을 배웠다.")}
                </p>
                <p className="typography-copy">
                    백엔드와 DB를 직접 다루며 데이터 흐름과 AI API 연동 구조를 여러 번 다시
                    만들었다. 비용 부담, 외부 API로 보낼 수 있는 데이터의 범위, AI 출력 표현의
                    한계까지 동시에 고려해야 했다. 이를 통해 구현은 화면을 작동하게 만드는 일이
                    아니라, 데이터·비용·법적 책임·사용자 안전을 함께 조율하는 일임을 체감했다.
                </p>
                <p className="section-headline-small">
                    {emphasize("제약은 자유도를 줄인 것이 아니라 판단 기준이 되었다.")}
                </p>
                <p className="typography-copy">
                    의료 도메인의 제약은 처음에는 자유도를 줄이는 듯했지만, 결국 무엇을 말할 수 있고
                    무엇은 말하면 안 되는지 정하는 기준이 되었다. AI 출력은 진단이 아닌 참고
                    키워드와 요약으로 제한했고, 의료진의 최종 검토 구조를 유지했다. 이는 타협이
                    아니라 안전하게 쓸 수 있는 제품에 가까워지기 위한 조건이었다.
                </p>
                <p className="section-headline-small">{emphasize("다음 프로젝트를 위한 메모.")}</p>
                <p className="typography-copy">
                    다시 한다면 완성도 높은 프로토타입보다 핵심 정보 구조를 더 일찍 검증했을 것이다.
                    의료진이 어떤 정보를 먼저 보고 판단하는지, 환자가 어떤 설명에 납득하는지를 더
                    빠르게 비교했을 것이다. 이번 프로젝트는 여러 제약 속에서 환자와 의료진 사이의
                    이해 차이를 줄이는 최소 연결 구조를 찾아간 과정이었다.
                </p>
            </div>
        </section>
    );
}
