export const RESEARCH_PAGES = [
    {
        slug: "autonomous-vehicle-trust-ux",
        title: "완전자율주행차는 어떤 정보를 보여줘야 할까?",
        cover: { width: 1672, height: 941 },
    },
    {
        slug: "habit-together-healthcare-ux",
        title: "건강 습관은 왜 혼자 만들기 어려울까?",
        cover: { width: 1672, height: 941 },
    },
];

export function getResearchNeighbors(currentSlug) {
    const idx = RESEARCH_PAGES.findIndex((p) => p.slug === currentSlug);
    if (idx === -1) return { prev: null, next: null };
    return {
        prev: idx > 0 ? RESEARCH_PAGES[idx - 1] : null,
        next: idx < RESEARCH_PAGES.length - 1 ? RESEARCH_PAGES[idx + 1] : null,
    };
}
