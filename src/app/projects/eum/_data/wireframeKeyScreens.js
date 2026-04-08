const wireframeKeyScreens = [
    {
        index: "Key Screen 01.",
        title: "증상 기록 · 환자",
        copy: "환자의 자유 입력을, 의사가 읽을 수 있는 기록으로 바꾸는 시작점입니다.",
        steps: [
            { term: "Sketch", desc: "증상 입력의 핵심 요소와 대화 흐름을 빠르게 탐색." },
            { term: "Low-fi", desc: "질문, 답변, 심각도 선택, 기록 저장의 우선순위를 정리." },
            {
                term: "Prototype",
                desc: "바이브 코딩으로 실제 입력과 구조화 저장이 작동하도록 구현.",
            },
        ],
        figures: [
            { src: "", alt: "증상 기록 스케치 캡쳐본", caption: "Sketch" },
            { src: "", alt: "증상 기록 로우파이 캡쳐본", caption: "Low-fi" },
            { src: "", alt: "증상 기록 프로토타입 캡쳐본", caption: "Prototype" },
        ],
    },
    {
        index: "Key Screen 02.",
        title: "대시보드 · 의사",
        copy: "짧은 진료 안에서 환자 정보와 AI 브리핑을 빠르게 파악하는 화면입니다.",
        steps: [
            { term: "Sketch", desc: "의사가 먼저 봐야 할 정보와 화면 계층 정리." },
            { term: "Low-fi", desc: "프로필, 기록, AI 참고 정보를 읽는 순서를 정리." },
            { term: "Prototype", desc: "바이브 코딩으로 실제 AI 브리핑이 연결된 상태로 구현." },
        ],
        figures: [
            { src: "", alt: "의사 대시보드 스케치 캡쳐본", caption: "Sketch" },
            { src: "", alt: "의사 대시보드 로우파이 캡쳐본", caption: "Low-fi" },
            { src: "", alt: "의사 대시보드 프로토타입 캡쳐본", caption: "Prototype" },
        ],
    },
    {
        index: "Key Screen 03.",
        title: "진료 요약 · 환자",
        copy: "의사의 결과를 환자가 다시 확인할 수 있게 정리한 화면입니다.",
        steps: [
            { term: "Sketch", desc: "환자에게 꼭 남겨야 할 결과 정보의 뼈대를 정리." },
            { term: "Low-fi", desc: "결과, 계획, 처방, 다음 안내의 읽는 순서를 구조화." },
            {
                term: "Prototype",
                desc: "바이브 코딩으로 결과와 다음 안내를 다시 볼 수 있는 화면으로 구현.",
            },
        ],
        figures: [
            { src: "", alt: "환자 진료 요약 스케치 캡쳐본", caption: "Sketch" },
            { src: "", alt: "환자 진료 요약 로우파이 캡쳐본", caption: "Low-fi" },
            { src: "", alt: "환자 진료 요약 프로토타입 캡쳐본", caption: "Prototype" },
        ],
    },
];

export default wireframeKeyScreens;
