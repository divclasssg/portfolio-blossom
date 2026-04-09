import Image from "next/image";
import defineMethodology from "../_data/defineMethodology";
import emphasize from "../_utils/emphasize";
import AiWorkflowCallout from "./_shared/AiWorkflowCallout";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionDefine() {
    return (
        <section className="section section-dd-define">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    02. Define &middot; 소통의 끊김을 읽음.
                </h2>
                <p className="section-headline-small">
                    {emphasize("진료시간 5분은 환자와 의사 모두에게 소통하기 부족한 시간.")}
                </p>
                <p className="typography-copy">
                    검사 결과가 정상이어도 환자에겐 불안이 남았고, 환자 경험은 짧은 진료 안에서
                    충분히 쓰이지 못했습니다. 문제를 &apos;환자 기록 → 진료 맥락, 진료 결과 → 환자
                    이해와 다음 행동&apos;이 끊기는 구조로 정의했습니다.
                </p>
                <AiWorkflowCallout>
                    AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.
                </AiWorkflowCallout>
                <div className="callout-wrapper">
                    <h3 className="visuallyhidden">환자와 의료진에게 필요했던 것</h3>
                    <div className="callout-content patient">
                        <h4 className="section-callout">&quot;환자에게 필요했던 것&quot;</h4>
                        <p className="typography-callout-headline">
                            왜 그런 결과이고, 다음에 무엇을 해야 하는지.
                        </p>
                        <p className="typography-callout-copy">
                            정상이라는 말은 환자에게 정보가 아니라 “갈 길이 없다”는 상태로 느껴졌고,
                            환자가 원한 것은 결과 한 줄이 아니라 이유와 다음 단계가 연결된
                            구조였습니다.
                        </p>
                    </div>
                    <div className="callout-content doctor">
                        <h4 className="section-callout">&quot;의료진에게 필요했던 것&quot;</h4>
                        <p className="typography-callout-headline">
                            짧은 시간 안에 빠르게 훑을 수 있는 요약.
                        </p>
                        <p className="typography-callout-copy">
                            의료진에게 더 필요한 것은 더 많은 정보가 아니라, 판단에 바로 쓸 수 있는
                            핵심 정보와 한눈에 읽히는 요약 포맷이었습니다. 소스에서도 최소 의사결정
                            정보와 선호 포맷을 따로 구조화했고, “눈에 팍 보이게” 읽히는 정보가
                            필요하다는 표현이 반복되었습니다.
                        </p>
                    </div>
                </div>
                <div className="define-methodology-wrapper">
                    <h3 className="visuallyhidden">UX Research Methodology</h3>
                    {defineMethodology.map((item) => (
                        <div className="define-methodology" key={item.title}>
                            <div className="define-methodology-content">
                                <h4 className="section-label">{item.title}</h4>
                                <p className="section-headline-small">{emphasize(item.headline)}</p>
                                {item.paragraphs.map((paragraph, index) => (
                                    <p className="typography-copy" key={index}>
                                        {paragraph}
                                    </p>
                                ))}
                                <div className="tag-wrapper">
                                    <h5 className="visuallyhidden">
                                        UX Research Methodology keywords
                                    </h5>
                                    <ul className="tags">
                                        {item.tags.map((tag) => (
                                            <li className="tags-item" key={tag}>
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <ExternalLink href={item.link.href}>
                                    {item.link.label}
                                </ExternalLink>
                            </div>
                            <div className="define-methodology-screenshots">
                                <Image src={item.image.src} alt={item.image.alt} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
