import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
};

export default nextConfig;
