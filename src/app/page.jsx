import Link from 'next/link';

const elementRings = [
  { icon: '🌿', name: 'Terra', color: 'bg-ring-earth', desc: 'Preservação de matas, hortas comunitárias e reflorestamento urbano' },
  { icon: '🔥', name: 'Fogo', color: 'bg-ring-fire', desc: 'Prevenção, monitoramento e denúncia de queimadas ilegais' },
  { icon: '💨', name: 'Vento', color: 'bg-ring-wind', desc: 'Monitoramento da qualidade do ar e combate a emissões poluentes' },
  { icon: '💧', name: 'Água', color: 'bg-ring-water', desc: 'Despoluição de rios, nascentes, praias e proteção hídrica' },
  { icon: '❤️', name: 'Coração', color: 'bg-ring-heart', desc: 'Mobilização comunitária, educação ambiental e redes de apoio' },
];

export default function HomePage() {
  return (
    <main className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent-text bg-accent/15 border border-accent/30 px-4 py-1.5 rounded-full">
            ✓ 100.740 Protetores Ativos
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-tight">
            O Poder é de Vocês! Junte-se aos Protetores da Terra.
          </h1>

          <p className="text-base md:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Plataforma comunitária para catalogar missões ecológicas, denunciar crimes ambientais e mobilizar ações de preservação na sua região.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/missoes"
              className="w-full sm:w-auto bg-primary-dark hover:bg-foreground text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Explorar Painel de Missões
            </Link>
            <Link
              href="/denuncia"
              className="w-full sm:w-auto border-2 border-primary-text text-primary-text hover:bg-primary/10 font-bold text-base px-8 py-3.5 rounded-xl transition-all active:scale-95"
            >
              Registrar uma Denúncia
            </Link>
          </div>
        </div>
      </section>

      {/* Seção dos 5 Anéis Elementais */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-foreground">Escolha seu Anel Mágico</h2>
          <p className="text-foreground-muted">Cada elemento guia uma frente estratégica de combate ambiental</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {elementRings.map((ring) => (
            <div
              key={ring.name}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col items-center text-center group"
            >
              <div className={`w-14 h-14 ${ring.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {ring.icon}
              </div>
              <h3 className="font-bold text-lg text-foreground">{ring.name}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{ring.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Métricas de Impacto */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-primary-text">100k+</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground-muted mt-1">Protetores Ativos</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-accent-text">1.250</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground-muted mt-1">Missões Concluídas</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-ring-fire">890</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground-muted mt-1">Denúncias Atendidas</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-ring-wind">50+</p>
            <p className="text-xs sm:text-sm font-semibold text-foreground-muted mt-1">Cidades Atendidas</p>
          </div>
        </div>
      </section>
    </main>
  );
}