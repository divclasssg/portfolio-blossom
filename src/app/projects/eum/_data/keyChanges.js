const keyChanges = [
    {
        title: "Key Change 01. 환자 앱 메인 화면 · Eum Patient Application",
        headline: "지금 내 상태가 먼저 보이도록.",
        copy: "첫 화면에서 서비스의 핵심 가치가 바로 읽히지 않았고, 기록 기능이 서비스 전체를 대표하는 것 처럼 보였습니다. 그래서 무엇을 할 수 있는지보다, 지금 어떤 상태인지와 다음에 무엇이 필요한지를 먼저 읽히도록 바꾸었습니다.",
        spec: [
            {
                term: "문제",
                desc: "서비스가 무엇을 도와주는지 첫 화면에서 바로 이해되지 않았다.",
            },
            { term: "원칙", desc: "기능보다 상태와 다음 행동이 먼저 읽혀야 한다." },
            {
                term: "변경 전 → 후",
                desc: "기능 진입 중심에서, 상태 카드 · 셋업 배너 · 미확인 결과 중심 구조로.",
            },
            {
                term: "기대 효과",
                desc: "환자는 “어디를 눌어야 하는가”보다 “지금 내 상태가 무엇인가”를 먼저 이해할 수 있다.",
            },
        ],
        link: { href: "", label: "원문 데이터 보기" },
        asIs: {
            src: "eum/screenshots/deliver/key_change_01_asis.webp",
            alt: "환자 앱 메인 화면 as-is",
            width: 768,
            height: 1664,
        },
        toBe: {
            src: "eum/videos/key_changes/key_change_01.mp4",
            poster: "eum/posters/key_change_01.webp",
            duration: 22.66,
            alt: "환자 앱 메인 화면 to-be",
            width: 774,
            height: 1678,
            framed: true,
        },
    },
    {
        title: "Key Change 02. 의사 패널 메인 화면 · Eum Doctor Plug-in",
        headline: "의사가 환자 상태의 핵심만 빠르게 파악할 수 있도록.",
        copy: "의사에게 필요한 것은 더 많은 정보가 아니라, 판단에 바로 쓸 수 있는 핵심 요약이었습니다. 그래서 환자 기록과 핵심 요약이 먼저 읽히도록 정리했습니다.",
        spec: [
            {
                term: "문제",
                desc: "중요한 정보는 있었지만, 짧은 시간 안에 핵심을 빠르게 파악하기 어려웠다.",
            },
            {
                term: "원칙",
                desc: "판단에 필요한 정보를 먼저 보여주고, AI 요약은 출처와 함께 제시한다.",
            },
            {
                term: "변경 전 → 후",
                desc: "정보가 나열된 화면에서, 핵심 요약이 먼저 보이고 출처를 확인 할 수 있는 구조로.",
            },
            {
                term: "기대 효과",
                desc: "의사는 환자 상태의 핵심을 빠르게 파악하고, AI 요약의 근거까지 확인할 수 있다.",
            },
        ],
        link: { href: "", label: "원문 데이터 보기" },
        asIs: {
            src: "eum/screenshots/deliver/key_change_02_asis.webp",
            alt: "의사 패널 메인 화면 as-is",
            width: 768,
            height: 2600,
        },
        toBe: {
            src: "eum/videos/key_changes/key_change_02.mp4",
            poster: "eum/posters/key_change_02.webp",
            duration: 18.02,
            alt: "의사 패널 메인 화면 to-be",
            width: 960,
            height: 1672,
        },
    },
    {
        title: "Key Change 03. 환자 진료 요약 상세 화면 · Eum Patient Application",
        headline:
            "환자 관점에서 기본적인 다음 단계 안내를 넘어, 왜 이런 판단인지와 이후 무엇을 해야 하는지를 이해할 수 있도록.",
        copy: "환자는 결과를 받았지만, 왜 그런 판단인지와 다음에 무엇을 해야 하는지가 충분히 이해되지 않았습니다. 초기 프로토타입에도 기본적인 다음 단계 안내는 있었지만, 환자 관점의 설명으로는 부족했습니다. 그래서 의사의 판단을 환자 관점의 요약으로 다시 풀고, 치료 계획 · 처방 · 주의사항 · 다음 단계를 한 번에 읽히도록 정리했습니다.",
        spec: [
            {
                term: "문제",
                desc: "결과는 전달됐지만, 이해와 다음 행동으로 충분히 이어지지 않았다.",
            },
            {
                term: "원칙",
                desc: "의사의 판단을 환자 관점의 설명으로 다시 풀고, 기본 안내를 더 구체적인 다음 단계로 연결한다.",
            },
            {
                term: "변경 전 → 후",
                desc: "소견 · 기본 다음 단계 · 기본 처방 중심에서, AI 환자 요약 · 구체화된 다음 단계 · 쉬운말 처방 설명 · 타과 의뢰까지 함께 읽히는 구조로.",
            },
            {
                term: "기대 효과",
                desc: "환자는 결과를 보는 데서 끝나지 않고, 이유와 이후 관리까지 이해할 수 있다.",
            },
        ],
        link: { href: "", label: "원문 데이터 보기" },
        asIs: {
            src: "eum/screenshots/deliver/key_change_03_asis.webp",
            alt: "환자 진료 요약 상세 화면 as-is",
            width: 768,
            height: 2636,
        },
        toBe: {
            src: "eum/videos/key_changes/key_change_03.mp4",
            poster: "eum/posters/key_change_03.webp",
            duration: 14.98,
            alt: "환자 진료 요약 상세 화면 to-be",
            width: 774,
            height: 1678,
            framed: true,
        },
    },
];

export default keyChanges;
