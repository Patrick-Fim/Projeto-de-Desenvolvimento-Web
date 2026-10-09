import "../styles/globals.css"; // ← Mantenha APENAS este import de estilo

export const metadata = {
  title: "Os Protetores da Terra",
  description: "Plataforma de conscientização e afiliação ambiental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}