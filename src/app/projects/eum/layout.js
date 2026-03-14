import { Roboto } from 'next/font/google';
import { Noto_Sans_KR } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-roboto',
    display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-noto-kr',
    display: 'swap',
});

export default function EumLayout({ children }) {
    return (
        <div
            className={`${roboto.variable} ${notoSansKR.variable}`}
            style={{
                fontFamily: 'var(--font-roboto), var(--font-noto-kr), -apple-system, sans-serif',
            }}
        >
            {children}
        </div>
    );
}
