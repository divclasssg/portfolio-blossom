"use client";

import Image from "next/image";
import { asset, sizes, QUALITY_UI } from "../_lib/media";
import emphasize from "../_utils/emphasize";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";

export default function SectionDeliver() {
    return (
        <section className="section section-dd-deliver">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    04. Deliver &middot; 더 선명하게 이음.
                </h2>
                <p className="section-headline-small">
                    {emphasize(
                        "환자에게는 나에게 맞는 설명과 데이터를, 의사에게는 바로 훑을 수 있는 요약으로 빠르게 환자를 파악할 수 있게."
                    )}
                </p>
                <p className="typography-copy">
                    사용성 테스트에서 확인된 핵심 문제는 기능 부족이 아니라, 환자에게는 설명이,
                    의사에게는 요약이 충분히 읽히지 않는 구조였습니다. 그래서 기능을 더하기보다,
                    환자 기록 → 의사 판단 → 환자 이해와 다음 행동으로 이어지는 전달 구조를 다시
                    설계했습니다.
                </p>
                <AiWorkflowCallout>
                    사용성 테스트 결과와 화면 비교, 기능 정의, 로직 구조를 함께 보며 무엇을
                    유지하고 무엇을 바꿀지 정리한 뒤, 실제 AI가 연결된 바이브 코딩 프로토타입에
                    바로 반영했습니다.
                </AiWorkflowCallout>
                <figure>
                    <Image
                        src={asset("eum/screenshots/deliver/5c57984005bd8f73f6aaf31aa249b3036f958a1b_pu4cjy.jpg")}
                        alt="사용성 테스트 환자 의사별 인사이트 모음"
                        width={2886}
                        height={634}
                        style={{ width: 1024, height: "auto" }}
                        sizes={sizes.wide}
                        quality={QUALITY_UI}
                    />
                    <figcaption>사용성 테스트 환자 및 의사별 인사이트</figcaption>
                </figure>
            </div>
        </section>
    );
}
