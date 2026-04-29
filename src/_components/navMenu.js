export const MENU_ITEMS = [
    { href: "/", label: "home", match: (p) => p === "/" },
    { href: "/about", label: "about", match: (p) => p === "/about" },
    { href: "/projects/eum", label: "eum", match: (p) => p.startsWith("/projects/eum") },
    {
        href: "/projects/cronometer",
        label: "cronometer",
        match: (p) => p.startsWith("/projects/cronometer"),
    },
    {
        href: "/projects/liverpoolfc",
        label: "liverpool fc",
        match: (p) => p.startsWith("/projects/liverpoolfc"),
    },
    {
        href: "/research/autonomous-vehicle-trust-ux",
        label: "research",
        match: (p) => p.startsWith("/research/autonomous-vehicle-trust-ux"),
    },
];
