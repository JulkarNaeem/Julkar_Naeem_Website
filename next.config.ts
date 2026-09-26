import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [{
      source: '/:asset(services/.*\\.webp|jn-logo-mark\\.png|julkar-naeem-dp\\.webp|share-card\\.png)',
      headers: [{key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400'}],
    }];
  },
};

export default nextConfig;
