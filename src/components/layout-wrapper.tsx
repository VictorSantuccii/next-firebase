// components/layout-wrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/login') || pathname.includes('/cadastro'); // Verifica se está em /login ou /cadastro

  return (
    <>
      {/* Renderiza Navbar e Footer apenas quando não for uma página de autenticação */}
      {!isAuthPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
