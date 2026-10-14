"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/missoes", label: "Painel de Missões" },
  { href: "/denuncia", label: "Registrar Denúncia" },
  { href: "/estilo", label: "Guia de Estilos" },
  { href: "/componentes", label: "Componentes" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-foreground">
          <span className="text-2xl" aria-hidden="true">🌎</span>
          <span>Protetores<span className="text-primary">.Terra</span></span>
        </Link>

        {/* Links Desktop */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {LINKS.map((link) => {
              const ativo = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`text-sm font-semibold transition hover:text-primary ${
                      ativo ? "text-primary border-b-2 border-primary pb-1" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Botão Hambúrguer Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="md:hidden text-2xl text-foreground p-1 rounded-lg hover:bg-primary/10"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 space-y-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-semibold text-foreground hover:text-primary py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

export default Navbar;