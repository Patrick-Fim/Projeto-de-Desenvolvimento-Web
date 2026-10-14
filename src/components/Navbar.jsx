'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/missoes', label: 'Painel de Missões' },
  { href: '/denuncia', label: 'Registrar Denúncia' },
  { href: '/estilo', label: 'Guia de Estilos' },
  { href: '/componentes', label: 'Componentes' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-black text-foreground hover:opacity-90 transition">
          <span className="text-2xl">🌎</span>
          <span>Protetores.Terra</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegação Principal">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors pb-1 ${
                  isActive
                    ? 'text-primary-dark border-b-2 border-primary-dark font-bold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:bg-background rounded-lg border border-border"
          aria-label="Alternar menu de navegação"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-card px-6 py-4 space-y-3" aria-label="Navegação Mobile">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-semibold py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-dark text-white font-bold'
                    : 'text-foreground-muted hover:bg-background hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}