import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Os Protetores da Terra - Movimento Ambiental",
  description: "Plataforma para engajamento em causas ambientais e registro de denúncias.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}