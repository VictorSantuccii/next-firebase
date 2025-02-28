export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="pt-BR">
        <body>
          {children} {/* Aqui não inclui Navbar/Footer */}
        </body>
      </html>
    );
  }