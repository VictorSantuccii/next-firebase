import { Metadata } from "next";
import { AuthProvider } from "@/lib/context/authContext";

export const metadata: Metadata = {
  title: "Cadastro | EcoCash",
  description: "Faça login para acessar suas finanças.",
};

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
