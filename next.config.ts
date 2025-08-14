import type { NextConfig } from "next";
//
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // config d'accès a l'api
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
