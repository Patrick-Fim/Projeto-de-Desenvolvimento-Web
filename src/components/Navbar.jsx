'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaXmark, FaMoon, FaSun, FaBullhorn, FaRightToBracket } from 'react-icons/fa6';
import Logo from './Logo';
import Avatar from './Avatar';
import Foguinho from './Foguinho';
import { useAuth } from '../context/AuthContext';

// Destinos compartilhados pelas versões desktop e mobile da navegação.
// /estilo e /componentes são páginas internas de referência (ver docs/PADROES.md).
const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/missoes', label: 'Missões' },
  { href: '/ranking', label: 'Ranking' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { usuario, perfil, carregando, sair } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Lê a preferência salva no navegador ao carregar a página
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    // Mantém a classe visual e a preferência persistida em sincronia.
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const linkClass = (isActive) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary-text'
        : 'text-foreground-muted hover:bg-foreground/5 hover:text-foreground'
    }`;

  const linksMobile = [
    ...NAV_LINKS,
    { href: '/denuncia', label: 'Registrar Denúncia' },
    usuario ? { href: '/perfil', label: 'Meu Perfil' } : { href: '/login', label: 'Entrar' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação Principal">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={linkClass(isActive)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Botão de Alternar Tema */}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              title={isDark ? 'Modo claro' : 'Modo escuro'}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
            </button>
          )}

          <Link
            href="/denuncia"
            aria-current={pathname === '/denuncia' ? 'page' : undefined}
            className="hidden items-center gap-2 rounded-lg bg-primary-dark px-4 py-2 text-sm font-bold text-white shadow-sm shadow-primary/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card md:inline-flex dark:text-slate-950"
          >
            <FaBullhorn aria-hidden="true" />
            Denunciar
          </Link>

          {/* Área do usuário: avatar e foguinho, ou botão de entrar */}
          {!carregando && usuario && perfil && (
            <Link
              href="/perfil"
              aria-label={`Meu perfil (${perfil.nome})`}
              aria-current={pathname === '/perfil' ? 'page' : undefined}
              className="hidden items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2 transition hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              <Avatar nome={perfil.nome} anel={perfil.anel} tamanho="sm" />
              <Foguinho dias={perfil.sequenciaAtual} />
            </Link>
          )}

          {!carregando && !usuario && (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-lg border-2 border-primary-text/40 px-3.5 py-1.5 text-sm font-bold text-primary-text transition hover:border-primary-text hover:bg-primary/5 sm:inline-flex"
            >
              <FaRightToBracket aria-hidden="true" />
              Entrar
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-foreground hover:bg-foreground/5 lg:hidden"
          >
            {isOpen ? <FaXmark aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav
          id="menu-mobile"
          className="border-t border-border bg-card px-4 py-3 animate-fadeIn lg:hidden"
          aria-label="Navegação Mobile"
        >
          <ul className="space-y-1">
            {linksMobile.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block ${linkClass(isActive)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {usuario && (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    sair();
                  }}
                  className={`block w-full cursor-pointer text-left ${linkClass(false)}`}
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
