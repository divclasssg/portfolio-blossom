"use client";

import Image from "next/image";
import { asset } from "../_lib/media";
import utFindings from "../_data/utFindings";
import utInterviews from "../_data/utInterviews";
import utOverview from "../_data/utOverview";
import emphasize from "../_utils/emphasize";
import ExternalLink from "./_shared/ExternalLink";

export default function SectionDevelopUsabilityTesting() {
    return (
        <section className="section section-dd-develop-usability-testing">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond 03. Develop</span>
                    Usability Testing &middot; 더 선명하게 잇길.
                </h2>
                <p className="section-headline-small">
                    {emphasize("환자는 더 개인화된 설명을, 의사는 더 빠른 요약을.")}
                </p>
                <p className="typography-copy">
                    핵심 문제는 기능 부족이 아니라, 기록 &middot; AI &middot; 진료가 연결돼도
                    환자에게는 이해로, 의사에게는 판단으로 바로 이어지지 않는 구조였습니다.
                </p>
                <p className="typography-copy">
                    사용성 테스트는 MVP가 어디를 더 선명하게 해야 이 강점이 제대로 읽히는지를 확인
                    할 수 있는 과정이었습니다.
                </p>
                <p className="typography-copy">
                    검증 결과, 사용자가 크게 느낀 가치는 기록 기능 자체보다 기록이 진료와 이해로
                    이어지는 연결에 있었습니다. 그래서 이후 수정도 기능을 바꾸는 데보다, 왜 이런
                    판단이 나왔는지와 다음에 무엇을 해야 하는지가 더 먼저 읽히도록 메시지, 정보
                    구조, 출처 표기, AI 역할 구분을 다듬는 데 집중했습니다.
                </p>
                <div className="ut-results">
                    <h3 className="visuallyhidden">UT Results</h3>
                    {utFindings.map((finding) => (
                        <div className="ut-results-item" key={finding.headline}>
                            <h4 className="ut-results-headline">{emphasize(finding.headline)}</h4>
                            <p className="typography-copy">{finding.copy}</p>
                            {finding.figures && (
                                <figure className="ut-results-screenshot">
                                    <div className="image-wrapper">
                                        {finding.figures.map((fig) => (
                                            <Image
                                                key={fig.src}
                                                src={asset(fig.src)}
                                                alt={fig.alt}
                                                width={fig.width}
                                                height={fig.height}
                                                style={{ width: fig.imgWidth, height: "auto" }}
                                            />
                                        ))}
                                    </div>
                                    <figcaption>{finding.caption}</figcaption>
                                </figure>
                            )}
                            {finding.figure && (
                                <figure className="ut-results-screenshot">
                                    <div className="image-wrapper">
                                        <Image
                                            src={asset(finding.figure.src)}
                                            alt={finding.figure.alt}
                                            width={finding.figure.width}
                                            height={finding.figure.height}
                                            style={{
                                                width: finding.figure.imgWidth,
                                                height: "auto",
                                            }}
                                        />
                                    </div>
                                    <figcaption>{finding.figure.caption}</figcaption>
                                </figure>
                            )}
                        </div>
                    ))}
                    <ExternalLink href="#">원문 데이터 보기</ExternalLink>
                </div>
                <div className="ut-overview">
                    <h5 className="visuallyhidden">Usability Testing Overview</h5>
                    <dl className="ut-meta-info">
                        {utOverview.map((row) => (
                            <div className="ut-meta-info-item" key={row.term}>
                                <dt>{row.term}</dt>
                                <dd>
                                    {row.items ? (
                                        <ul>
                                            {row.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        row.desc
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div className="ut-interview">
                        {utInterviews.map((interview) => (
                            <figure key={interview.image.alt}>
                                <Image
                                    src={asset(interview.image.src)}
                                    alt={interview.image.alt}
                                    width={interview.image.width}
                                    height={interview.image.height}
                                    style={{ width: interview.image.imgWidth, height: "auto" }}
                                />
                                <figcaption>
                                    <strong>{interview.person}</strong>
                                    <span>{interview.quote}</span>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
