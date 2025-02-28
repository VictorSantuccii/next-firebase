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
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; style-src 'self';", // Ajuste conforme necessário
          },
        ],
      },
    ];
  },
};

export default nextConfig;
