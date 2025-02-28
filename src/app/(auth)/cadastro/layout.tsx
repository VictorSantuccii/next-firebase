import { AuthProvider } from "@/lib/context/authContext";
import { Geist, Geist_Mono, Montserrat, Poppins } from "next/font/google";
import  "../../../styles/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });

export default function CadastroLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          {/* Renderiza apenas o conteúdo da página de cadastro sem Navbar ou Footer */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
