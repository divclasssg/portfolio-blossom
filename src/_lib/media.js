export const R2_ORIGIN = "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev";
const BASE = `${R2_ORIGIN}/portfolio`;

export const asset = (path) => `${BASE}/${path}`;

export const sizes = {
    full: "100vw",
    wide: "(max-width: 1024px) 100vw, 1024px",
    figure1200: "(max-width: 1200px) 100vw, 1200px",
    card: "(max-width: 768px) 90vw, 600px",
    fixed: (px) => `${px}px`,
};

export const QUALITY_UI = 90;
