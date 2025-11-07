import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '8543cf4fc76fddb1ac0de823835a53a1.cdn.bubble.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
