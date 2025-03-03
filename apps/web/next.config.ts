import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
  transpilePackages: ['jotai-devtools'],
};

export default nextConfig;
