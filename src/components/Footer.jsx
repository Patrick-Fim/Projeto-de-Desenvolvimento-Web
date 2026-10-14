import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white border-t border-primary/20 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="font-black text-xl flex items-center gap-2">
            <span>🌎</span> Protetores.Terra
          </p>
          <p className="text-white/70 text-sm">
            Movimento ambiental colaborativo voltado ao monitoramento, denúncia e engajamento comunitário.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-white text-base mb-3">Links Rápidos</h2>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/" className="hover:text-primary">Início</Link></li>
            <li><Link href="/missoes" className="hover:text-primary">Painel de Missões</Link></li>
            <li><Link href="/denuncia" className="hover:text-primary">Registrar Denúncia</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-white text-base mb-3">Projeto Acadêmico</h2>
          <p className="text-xs text-white/70">
            Desenvolvimento Web • Unidade 2<br />
            Conformidade WCAG AA & Next.js App Router
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2026 Protetores da Terra. O Poder é de Vocês!
      </div>
    </footer>
  );
}