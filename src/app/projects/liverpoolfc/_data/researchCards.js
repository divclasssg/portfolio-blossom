const R2_BASE =
    "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool";

const researchCards = [
    {
        slug: "brand",
        title: "Brand Research",
        headline: "클럽은 정보 사이트가 아니라 정체성 기반 커뮤니티였습니다.",
        copy: "You’ll Never Walk Alone, This is Anfield, The Liverpool Way, The Red Way는 팬이 클럽과 감정적으로 연결되는 핵심 자산이었습니다.",
        image: {
            src: `${R2_BASE}/liverpool_research_brand.jpg`,
            alt: "Brand Research — 클럽 정체성 자산 정리",
            width: 3254,
            height: 4002,
        },
    },
    {
        slug: "traffic",
        title: "Traffic & Keyword",
        headline: "방문 목적은 경기와 선수 정보에 집중되어 있었습니다.",
        copy: "fixtures, lineups, tickets, standings, players 중심의 유입은 홈페이지가 경기 전후 필요한 정보를 확인하는 목적성 방문지라는 점을 보여줬습니다.",
        image: {
            src: `${R2_BASE}/liverpool_research_traffic.jpg`,
            alt: "Traffic & Keyword — fixtures · lineups · tickets 등 유입 키워드 집계",
            width: 3760,
            height: 1706,
        },
    },
    {
        slug: "user",
        title: "User Interview",
        headline: "공식 홈페이지는 방문할 명확한 이유가 필요했습니다.",
        copy: "팬들은 포털과 SNS를 더 편리하게 느꼈고, 공식 홈페이지에서만 얻을 수 있는 정보나 경험이 있을 때 방문할 이유를 느꼈습니다.",
        image: {
            src: `${R2_BASE}/liverpool_research_user.png`,
            alt: "User Interview — 팬 사용성 인터뷰 정리 노트",
            width: 6716,
            height: 18278,
        },
    },
    {
        slug: "aida",
        title: "AIDA Analysis",
        headline: "Attention은 강했지만 다음 행동으로 이어지는 흐름은 약했습니다.",
        copy: "뉴스, 상품, 광고, 경기 정보가 혼재되어 있어 사용자가 Interest에서 Desire, Action으로 자연스럽게 이동하기 어려웠습니다.",
        image: {
            src: `${R2_BASE}/liverpool_research_aida.jpg`,
            alt: "AIDA Analysis — 기존 홈페이지의 Attention→Action 단계별 분석",
            width: 2136,
            height: 1417,
        },
    },
    {
        slug: "reference",
        title: "Reference Analysis",
        headline: "레퍼런스 분석은 색상 강조와 CTA 배치 기준을 잡는 데 사용했습니다.",
        copy: "Real Madrid, Arsenal, Bayern Munich 등 유사 스포츠 구단 사이트를 비교하며 섹션 흐름, CTA 배치, 브랜드 컬러 사용 방식을 참고했습니다.",
        image: {
            src: `${R2_BASE}/liverpool_research_reference.png`,
            alt: "Reference Analysis — Real Madrid · Arsenal · Bayern Munich 비교 보드",
            width: 1555,
            height: 1773,
        },
        modifier: "reference",
    },
];

export default researchCards;
