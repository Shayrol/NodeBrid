import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/img/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8001',
        pathname: '/img/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/images/:path*', // 클라이언트에서는 이 경로를 호출
        destination: 'http://localhost:8001/img/:path*', // 실제 백엔드 주소
      },
    ];
  },
};

export default nextConfig;
