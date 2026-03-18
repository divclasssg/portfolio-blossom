/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/caseStudies/:path*', destination: '/projects/:path*' },
    ];
  },
};

export default nextConfig;
