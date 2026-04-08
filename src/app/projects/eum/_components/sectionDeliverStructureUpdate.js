import Image from "next/image";
import Link from "next/link";

export default function SectionDeliverStructureUpdate() {
    return (
        <section className="section section-dd-deliver-structure-update">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span>Double Diamond 04. Deliver</span>
                    구조 업데이트 &middot; 흐름으로 이음.
                </h2>
                <p className="section-headline-small">
                    개별 화면보다, 서비스 전체가 하나의 흐름으로 읽히도록 구조를 다시 정리.
                </p>
                <p className="typography-copy">
                    화면을 각각 다듬는 것만으로는 부족했습니다. 각 화면이 좋아져도 서비스 전체가
                    하나의 흐름으로 읽히지 않으면 기능 모음처럼 보일 수 있었기 때문입니다. 그래서
                    정보 구조(IA)와 사용자 흐름(User Flow)을 기능 나열이 아니라, 상태 확인 →
                    진료 연결 → 결과 이해 순서가 먼저 읽히도록 핵심 루프 중심으로 다시
                    정리했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        AI는 기록 단계에서는 입력을 구조화하고, 진료 단계에서는 판단을 돕는
                        요약을 제공하며, 결과 단계에서는 환자가 이해할 수 있는 설명으로 다시
                        풀어주는 역할로 나눴습니다.
                    </dd>
                </dl>
                <Link
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-primary"
                >
                    원문 데이터 보기
                </Link>
                <Image src="" alt="유저플로우 캡쳐본" />
            </div>
        </section>
    );
}
