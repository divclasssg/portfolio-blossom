/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // eum 프로젝트는 실제 라우트가 존재하므로 rewrite 제외
      {
        source: '/projects/eum/:path*',
        destination: '/projects/eum/:path*',
      },
      { source: '/projects/:path*', destination: '/caseStudies/:path*' },
    ];
  },
};

export default nextConfig;
