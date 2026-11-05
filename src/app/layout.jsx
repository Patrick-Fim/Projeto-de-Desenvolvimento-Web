import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";

// Metadados compartilhados por todas as páginas da aplicação.
export const metadata = {
  title: "Os Protetores da Terra - Movimento Ambiental",
  description: "Plataforma para engajamento em causas ambientais e registro de denúncias.",
};

// Aplica o tema salvo antes da primeira pintura, evitando o "piscar" do tema claro.
const scriptTema = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        {/* Atalho de teclado para pular a navegação (acessibilidade). */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-dark focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Pular para o conteúdo
        </a>

        {/* O AuthProvider deixa o usuário logado disponível para todas as telas. */}
        <AuthProvider>
          {/* Cabeçalho e rodapé envolvem o conteúdo da rota atual. */}
          <Navbar />
          <div id="conteudo" className="flex-1">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
