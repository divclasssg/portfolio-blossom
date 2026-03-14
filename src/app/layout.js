import './globals.scss';

export const metadata = {
    title: 'Portfolio',
    description: 'Portfolio',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
