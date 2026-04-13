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
            },
        ],
    },
};

export default nextConfig;
