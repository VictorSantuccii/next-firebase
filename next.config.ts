// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Permite popups controlados
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", 
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
        },
        ],
      },
    ];
  },
};

export default nextConfig;