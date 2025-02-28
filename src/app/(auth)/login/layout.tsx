import { Metadata } from "next";
import { AuthProvider } from "@/lib/context/authContext";

export const metadata: Metadata = {
  title: "Login | EcoCash",
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
