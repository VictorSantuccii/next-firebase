// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Gera arquivos estáticos na pasta /out
  trailingSlash: true, // Opcional: adiciona "/" no final das URLs
};

export default nextConfig;