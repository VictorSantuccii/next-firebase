import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Gera arquivos estáticos na pasta /out
  trailingSlash: true, // Opcional: adiciona "/" no final das URLs

  async headers() {
    return [
      {
        source: '/:path*', // Aplica a todos os caminhos
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
