import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    sassOptions: {
        includePaths: [path.join(process.cwd(), "src/_style")],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev",
                pathname: "/**",
                search: "",
            },
        ],
        formats: ["image/avif", "image/webp"],
        qualities: [75, 85, 90],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        minimumCacheTTL: 2678400,
    },
    async rewrites() {
        return [
            {
                source: "/liverpoolfc",
                destination: "https://portfolio-tan-five-60.vercel.app/liverpoolfc",
            },
            {
                source: "/liverpoolfc/:path*",
                destination: "https://portfolio-tan-five-60.vercel.app/liverpoolfc/:path*",
            },
        ];
    },
};

export default nextConfig;
