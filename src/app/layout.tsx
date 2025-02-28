import type { Metadata } from "next";
import { AuthProvider } from "@/lib/context/authContext";
import { Geist, Geist_Mono, Montserrat, Poppins } from "next/font/google";
import "../styles/globals.css";
import LayoutWrapper from "@/components/layout-wrapper"; // Wrapper do layout

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "EcoCash | Suas finanças em um só lugar ",
  description: "Cuide de suas finanças de forma simples e inteligente",
  icons: {
    icon: '/logosite.png'
  },
  openGraph: {
    images: [
      {
        url: "/logo.png", 
        width: 1200, 
        height: 630, 
        alt: "EcoCash",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/logo.png", 
        width: 1200, 
        height: 630,
        alt: "EcoCash",
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper> {/* Envolve os conteúdos com o LayoutWrapper */}
        </AuthProvider>
      </body>
    </html>
  );
}
