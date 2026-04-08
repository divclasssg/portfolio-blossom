import Image from "next/image";
import Link from "next/link";
import developProcess from "../_data/developProcess";
import emphasize from "../_utils/emphasize";

export default function SectionDevelop() {
    return (
        <section className="section section-dd-develop">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    03. Develop &middot; 판단과 이해를 이음.
                </h2>
                <p className="section-headline-small">
                    {emphasize(
                        "기능을 줄이고, 환자 기록 → 의사 판단 → 환자 이해로 이어지는 최소 구조만."
                    )}
                </p>
                <p className="typography-copy">
                    기능 수가 아니라 핵심 루프가 기준이었습니다. 기록이 진료로 연결되고, 판단이 환자
                    이해로 이어지는 흐름만 남겼습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.</dd>
                </dl>
                <Link href="#" target="_blank" rel="noopener noreferrer" className="link-primary">
                    원문 데이터 보기
                </Link>
            </div>
            <div className="section-content-wide">
                <div className="card-wrapper">
                    {developProcess.map((item) => (
                        <div className="card-process" key={item.title}>
                            <h3 className="card-process-headline">{item.title}</h3>
                            <p className="card-process-typography-copy">{item.copy}</p>
                            <div className="card-process-screenshot">
                                <Image src={item.image.src} alt={item.image.alt} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
