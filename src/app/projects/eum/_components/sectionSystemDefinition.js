"use client";

import Image from "next/image";
import { asset } from "../_lib/media";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionSystemDefinition() {
    return (
        <section className="section section-system-definition">
            <div className="section-content">
                <h2 className="section-eyebrow">시스템 정의서 &middot; 구현 가능한 구조로 이음.</h2>
                <p className="section-headline-small">
                    프로토타입 이후 개발을 이어갈 수 있도록 화면 &middot; 기능 &middot; 로직 문서를
                    함께 남겼다.
                </p>
                <p className="typography-copy">
                    화면 상세 정의서에서는 정보 위계와 컴포넌트 구조를, 기능 상세 정의서에서는
                    데이터 조건과 표시 규칙을, 로직 문서에서는 홈 상태 분기 &middot; 의사 화면 전환
                    &middot; 결과 읽음 처리 &middot; AI 요약 반영 방식까지 정리했습니다.
                </p>
                <p className="typography-copy">
                    기존에는 화면 중심으로 흩어져 있던 정의를, 최종 단계에서는 화면 &middot; 기능
                    &middot; 로직으로 분리해 다시 하나의 흐름으로 연결함으로써 이후 개발을 이어갈 수
                    있는 구조로 정리했습니다.
                </p>
                <AiWorkflowCallout>
                    화면 수정과 로직 수정을 함께 다뤄, 작동 흐름과 문서 정의가 어긋나지 않도록
                    정리했습니다.
                </AiWorkflowCallout>
                <div className="button-wrapper">
                    <ExternalLink href="">기능 상세 정의서 보기</ExternalLink>
                    <ExternalLink href="">화면 상세 정의서 보기</ExternalLink>
                    <ExternalLink href="">로직 보기</ExternalLink>
                </div>
                <div className="img-wrapper">
                    <Image
                        src={asset("eum/screenshots/deliver/c7d1a83f70ea22a27576d0f19f3ff62098cb0277_utod9a.png")}
                        alt="기능상세정의서, 화면상세정의서, 로직 정리표 캡쳐본"
                        width={2056}
                        height={1721}
                        style={{ width: 1024, height: "auto" }}
                    />
                </div>
            </div>
        </section>
    );
}
