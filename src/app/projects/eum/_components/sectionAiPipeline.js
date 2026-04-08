import Image from "next/image";
import Link from "next/link";
import emphasize from "../_utils/emphasize";

export default function SectionAiPipeline() {
    return (
        <section className="section section-ai-pipeline">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    AI 파이프라인 &middot; 기록에서 설명까지 이음.
                </h2>
                <p className="section-headline-small">
                    {emphasize("AI가 기록을 정리하고 설명까지 이어지도록 설계.")}
                </p>
                <p className="typography-copy">
                    AI는 세 단계에서 각각 다른 역할을 합니다. 환자가 남긴 자연어 기록을 의사가
                    읽을 수 있는 구조로 바꾸고, 진료 중에는 환자 상태의 핵심을 짧은 브리핑으로
                    요약하며, 진료 후에는 의사의 판단을 환자가 이해할 수 있는 설명으로 다시
                    풀어줍니다. 세 단계가 따로 작동하는 것이 아니라, 기록 → 판단 → 이해가 하나의
                    흐름으로 이어지도록 AI의 역할을 설계했습니다.
                </p>
                <p className="typography-copy">
                    초기에는 AI가 일부 화면에서 부분적으로 작동했다면, 최종 단계에서는 환자 기록
                    입력부터 의사 판단 지원, 환자용 설명까지 하나의 흐름으로 연결되도록
                    설계했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        환자 기록 → 의사 판단 지원 → 환자 이해와 다음 행동으로 이어지는 흐름을
                        설계하고, Claude Code를 활용한 바이브 코딩으로 실제 프로토타입에
                        구현했습니다.
                    </dd>
                </dl>
                <Link
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-primary"
                >
                    기능 상세 정의서 보기
                </Link>
                <Image src="" alt="AI 파이프라인 정리표 캡쳐본" />
            </div>
        </section>
    );
}
