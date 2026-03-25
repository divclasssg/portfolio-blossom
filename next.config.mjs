/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/projects/:path*', destination: '/caseStudies/:path*' },
    ];
  },
};

export default nextConfig;
