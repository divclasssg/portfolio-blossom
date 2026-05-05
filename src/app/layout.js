import ClarityInit from "@/_components/clarity-init";
import Globalnav from "@/_components/globalnav";
import { R2_ORIGIN } from "@/_lib/media";
import "@/_style/style.scss";

export const metadata = {
    metadataBase: new URL("https://example.com"),
    title: {
        default: "parkseik",
        template: "%s | parkseik Portfolio",
    },
    description: "parkseik's portfolio",
    keywords: ["portfolio", "frontend", "web", "developer"],
    authors: [{ name: "PARK Seik" }],
    creator: "PARK Seik",
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "https://example.com",
        siteName: "parkseik's Portfolio",
        title: "parkseik Portfolio",
        description: "parkseik's portfolio",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "parkseik's Portfolio",
        description: "포트폴리오 사이트입니다.",
        images: ["/og-image.png"],
    },
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#1d1d1f",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                <link rel="preconnect" href={R2_ORIGIN} crossOrigin="" />
                <link rel="dns-prefetch" href={R2_ORIGIN} />
            </head>
            <body>
                <ClarityInit />
                <Globalnav />
                {children}
            </body>
        </html>
    );
}
