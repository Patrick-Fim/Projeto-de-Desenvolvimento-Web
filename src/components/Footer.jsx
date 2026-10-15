import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border text-foreground mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Coluna 1: Logo e Descrição */}
        <div className="space-y-2">
          <p className="font-black text-xl flex items-center gap-2 text-foreground">
            <span>🌎</span> Protetores.Terra
          </p>
          <p className="text-foreground-muted text-sm leading-relaxed max-w-sm">
            Movimento ambiental colaborativo voltado ao monitoramento, denúncia e engajamento comunitário.
          </p>
        </div>

        {/* Coluna 2: Links Rápidos (Centralizado no Desktop) */}
        <div className="md:justify-self-center">
          <h2 className="font-bold text-foreground text-base mb-3">Links Rápidos</h2>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li>
              <Link href="/" className="hover:text-primary-dark transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link href="/missoes" className="hover:text-primary-dark transition-colors">
                Painel de Missões
              </Link>
            </li>
            <li>
              <Link href="/denuncia" className="hover:text-primary-dark transition-colors">
                Registrar Denúncia
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Projeto Acadêmico (Alinhado à Direita no Desktop) */}
        <div className="md:justify-self-end">
          <h2 className="font-bold text-foreground text-base mb-3">Projeto Acadêmico</h2>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Desenvolvimento Web • Unidade 2<br />
            Conformidade WCAG AA & Next.js App Router
          </p>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-foreground-muted">
        © 2026 Protetores da Terra. O Poder é de Vocês!
      </div>
    </footer>
  );
}