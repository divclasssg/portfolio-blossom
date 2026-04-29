export const MENU_ITEMS = [
    { type: "link", href: "/", label: "home", match: (p) => p === "/" },
    { type: "link", href: "/about", label: "about", match: (p) => p === "/about" },
    { type: "label", label: "projects", match: (p) => p.startsWith("/projects/") },
    {
        type: "link",
        href: "/projects/eum",
        label: "eum",
        indent: true,
        match: (p) => p.startsWith("/projects/eum"),
    },
    {
        type: "link",
        href: "/projects/cronometer",
        label: "cronometer",
        indent: true,
        match: (p) => p.startsWith("/projects/cronometer"),
    },
    {
        type: "link",
        href: "/projects/liverpoolfc",
        label: "liverpool fc",
        indent: true,
        match: (p) => p.startsWith("/projects/liverpoolfc"),
    },
    {
        type: "link",
        href: "/research/autonomous-vehicle-trust-ux",
        label: "research",
        match: (p) => p.startsWith("/research/autonomous-vehicle-trust-ux"),
    },
];
