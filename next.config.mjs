import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    sassOptions: {
        includePaths: [path.join(process.cwd(), "src/_style")],
    },
};

export default nextConfig;
