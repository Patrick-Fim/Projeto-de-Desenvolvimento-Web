import Link from 'next/link';
import Logo from './Logo';
import { RINGS } from '../lib/rings';

const LINKS = [
  { href: '/', label: 'Início' },
  { href: '/missoes', label: 'Painel de Missões' },
  { href: '/denuncia', label: 'Registrar Denúncia' },
  { href: '/estilo', label: 'Guia de Estilos' },
  { href: '/componentes', label: 'Componentes' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      {/* Faixa com as cores dos cinco anéis. */}
      <div className="flex h-1.5" aria-hidden="true">
        {RINGS.map((ring) => (
          <span key={ring.id} className={`flex-1 ${ring.bg}`} />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        {/* Marca e descrição */}
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
            Movimento ambiental colaborativo voltado ao monitoramento, denúncia e engajamento comunitário.
          </p>
          <ul className="flex gap-2" aria-label="Anéis elementais">
            {RINGS.map((ring) => {
              const Icon = ring.Icon;
              return (
                <li
                  key={ring.id}
                  title={ring.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${ring.soft} ${ring.text}`}
                >
                  <Icon aria-hidden="true" />
                  <span className="sr-only">{ring.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Links rápidos */}
        <nav aria-label="Links do rodapé">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Navegação</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-foreground-muted transition-colors hover:text-primary-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Projeto acadêmico */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Projeto Acadêmico</h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
            Desenvolvimento Web · Unidade 2
            <br />
            Next.js App Router · Firebase · WCAG AA
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-foreground-muted sm:flex-row">
          <p>© 2026 Protetores da Terra.</p>
          <p className="font-semibold">O Poder é de Vocês!</p>
        </div>
      </div>
    </footer>
  );
}
