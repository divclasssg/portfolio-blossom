import Image from "next/image";
import Link from "next/link";

export default function SectionSystemDefinition() {
    return (
        <section className="section section-system-definition">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    시스템 정의서 &middot; 구현 가능한 구조로 이음.
                </h2>
                <p className="section-headline-small">
                    프로토타입 이후 개발을 이어갈 수 있도록 화면 &middot; 기능 &middot; 로직
                    문서를 함께 남겼다.
                </p>
                <p className="typography-copy">
                    화면 상세 정의서에서는 정보 위계와 컴포넌트 구조를, 기능 상세 정의서에서는
                    데이터 조건과 표시 규칙을, 로직 문서에서는 홈 상태 분기 &middot; 의사 화면
                    전환 &middot; 결과 읽음 처리 &middot; AI 요약 반영 방식까지 정리했습니다.
                </p>
                <p className="typography-copy">
                    기존에는 화면 중심으로 흩어져 있던 정의를, 최종 단계에서는 화면 &middot;
                    기능 &middot; 로직으로 분리해 다시 하나의 흐름으로 연결함으로써 이후 개발을
                    이어갈 수 있는 구조로 정리했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        화면 수정과 로직 수정을 함께 다뤄, 작동 흐름과 문서 정의가 어긋나지
                        않도록 정리했습니다.
                    </dd>
                </dl>
                <div className="button-wrapper">
                    <Link
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-primary"
                    >
                        기능 상세 정의서 보기
                    </Link>
                    <Link
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-primary"
                    >
                        화면 상세 정의서 보기
                    </Link>
                    <Link
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-primary"
                    >
                        로직 보기
                    </Link>
                </div>
                <Image src="" alt="기능상세정의서, 화면상세정의서, 로직 정리표 캡쳐본" />
            </div>
        </section>
    );
}
