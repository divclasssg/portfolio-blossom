import emphasize from "../_utils/emphasize";

export default function SectionDevelopReview() {
    return (
        <section className="section section-dd-develop-review">
            <div className="section-content">
                <h2 className="section-eyebrow subhead">
                    <span className="visuallyhidden">Double Diamond 03. Develop</span>
                    검토 기준 &middot; 규제와 원칙 먼저.
                </h2>
                <p className="section-headline-small">
                    {emphasize(
                        "의료는 작은 오해도 위험할 수 있고 법 · 규제가 AI 역할과 환자 데이터 처리를 제한하므로, 화면보다 AI의 역할 범위 · 의사 판단의 정보 위계 · 환자 설명 원칙을 먼저 검토."
                    )}
                </p>
                <p className="typography-copy">
                    그래서 화면 설계에 들어가기 전, 관련 법과 규제가 AI의 역할 범위와 환자 데이터
                    처리 방식에 어떤 제약을 두는지, 의료 데이터 하이어라키가 짧은 진료 안에서 의사가
                    무엇부터 빠르게 확인해야 하는지를 어떻게 구조화하는지, 의료 UX writing 원칙이
                    환자 설명과 건강 문해력 측면에서 어떤 기준을 요구하는지를 먼저 검토한 뒤, 이를
                    바탕으로 와이어프레임과 프로토타입의 정보 구조와 문구 체계를 설계했습니다.
                </p>

                <div className="card-white-wrapper">
                    <h3 className="visuallyhidden">검토한 세 가지 기준</h3>
                    <div className="card-white">
                        <h4 className="section-label">관련 법과 규제 검토</h4>
                        <p className="typography-copy">
                            AI는 진단이 아니라 참고 정보 범위로 제한해야 했고, 민감한 건강정보와
                            국외 이전에는 별도 동의가 필요했으며, 의사용 화면에는 비닫힘 경고와 검토
                            책임 고지가 계속 노출되어야 했습니다.
                        </p>
                    </div>
                    <div className="card-white">
                        <h4 className="section-label">의료 데이터 하이어라키 검토</h4>
                        <p className="typography-copy">
                            의사용 패널은 좁은 플로팅 구조 안에서 핵심 판단 정보를 먼저 보여줘야
                            했기 때문에, 알레르기&middot;주호소&middot;위험 신호를 우선 배치하고
                            나머지 데이터는 단계적으로 확인할 수 있는 구조로 정리했습니다.
                        </p>
                    </div>
                    <div className="card-white">
                        <h4 className="section-label">의료 UX writing 원칙 검토</h4>
                        <p className="typography-copy">
                            환자용 문구는 의학적으로 정확해야 할 뿐 아니라, 건강 문해력을 고려해
                            쉬운 말을 먼저 쓰고 필요한 경우에만 의학용어를 병기해야 했으며, AI가
                            풀어쓴 내용이라는 점도 명확히 드러나야 했습니다. 의사용 화면 역시
                            320–360px 안에서 빠르게 읽을 수 있도록 간결한 텍스트 기준이
                            필요했습니다.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
