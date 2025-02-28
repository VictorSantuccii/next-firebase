// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
            {
                key: 'Access-Control-Allow-Origin',
                value: '*'
            }
        ]
      }
    ]
  }
};

export default nextConfig;