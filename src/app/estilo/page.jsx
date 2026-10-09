export default function GuiaDeEstilosPage() {
  return (
    <main className="min-h-screen p-6 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <header className="border-b border-primary/20 pb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1 rounded-full">
          ✓ Guia de Estilo Protetores da Terra
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mt-3">
          O Poder é de Vocês!
        </h1>
        <p className="text-foreground/70 mt-2 max-w-2xl">
          Página de validação dos tokens de design, tipografia (Montserrat + Inter), paleta do Capitão Planeta e Anéis Elementais.
        </p>
      </header>

      {/* Seção 1: Paleta de Cores Principais */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Cores Principais (Capitão Planeta)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-primary text-white shadow-sm">
            <p className="text-xs opacity-80">Primary</p>
            <p className="font-bold mt-1">#0096C7</p>
          </div>
          <div className="p-4 rounded-xl bg-primary-dark text-white shadow-sm">
            <p className="text-xs opacity-80">Primary Dark</p>
            <p className="font-bold mt-1">#0077B6</p>
          </div>
          <div className="p-4 rounded-xl bg-foreground text-white shadow-sm">
            <p className="text-xs opacity-80">Foreground</p>
            <p className="font-bold mt-1">#03045E</p>
          </div>
          <div className="p-4 rounded-xl bg-accent text-white shadow-sm">
            <p className="text-xs opacity-80">Ecological</p>
            <p className="font-bold mt-1">#00AB39</p>
          </div>
          <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
            <p className="text-xs text-foreground/70">Background</p>
            <p className="font-bold text-foreground mt-1">#F0F9FF</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
            <p className="text-xs text-foreground/70">Card</p>
            <p className="font-bold text-foreground mt-1">#FFFFFF</p>
          </div>
        </div>
      </section>

      {/* Seção 2: Os 5 Anéis Elementais */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Anéis Elementais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-ring-earth text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Terra</p>
              <p className="font-bold">Verde Folha</p>
            </div>
            <span className="text-2xl">🌿</span>
          </div>

          <div className="p-4 rounded-xl bg-ring-fire text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Fogo</p>
              <p className="font-bold">Flamejante</p>
            </div>
            <span className="text-2xl">🔥</span>
          </div>

          <div className="p-4 rounded-xl bg-ring-wind text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Vento</p>
              <p className="font-bold">Ciano Brilhante</p>
            </div>
            <span className="text-2xl">💨</span>
          </div>

          <div className="p-4 rounded-xl bg-ring-water text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Água</p>
              <p className="font-bold">Azul Oceano</p>
            </div>
            <span className="text-2xl">💧</span>
          </div>

          <div className="p-4 rounded-xl bg-ring-heart text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Coração</p>
              <p className="font-bold">Terracota</p>
            </div>
            <span className="text-2xl">❤️</span>
          </div>
        </div>
      </section>

      {/* Seção 3: Tipografia */}
      <section className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold border-b border-border pb-2">3. Tipografia</h2>
        
        <div>
          <span className="text-xs text-foreground/60 uppercase">Display — Montserrat 900</span>
          <p className="text-3xl font-extrabold text-foreground">O Poder é de Vocês!</p>
        </div>

        <div>
          <span className="text-xs text-foreground/60 uppercase">Heading — Montserrat 700</span>
          <p className="text-xl font-bold text-foreground">Escolha seu Anel Mágico</p>
        </div>

        <div>
          <span className="text-xs text-foreground/60 uppercase">Body — Inter 400</span>
          <p className="text-base text-foreground/90">
            Cada ação conta para o futuro do planeta e das próximas gerações. Participe ativamente das denúncias e missões ambientais na sua comunidade.
          </p>
        </div>

        <div>
          <span className="text-xs text-foreground/60 uppercase">Label — Inter 600</span>
          <p className="text-xs font-semibold text-accent">✓ 100.740 Protetores Ativos</p>
        </div>
      </section>

      {/* Seção 4: Botões e Interações */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Variantes de Botões</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Primary)
          </button>

          <button className="bg-accent hover:opacity-90 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Ecological)
          </button>

          <button className="bg-foreground hover:bg-black text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Dark)
          </button>

          <button className="border-2 border-primary text-primary hover:bg-primary/10 font-medium px-6 py-3 rounded-xl transition-all active:scale-95">
            Saiba Mais (Outline)
          </button>
        </div>

        <div className="pt-4">
          <p className="text-sm font-semibold mb-3">Seletor de Anéis (Ring Buttons):</p>
          <div className="flex gap-3">
            {['🌿', '🔥', '💨', '💧', '❤️'].map((icon, index) => (
              <button
                key={index}
                className="w-12 h-12 bg-card border-2 border-border hover:border-primary rounded-xl flex items-center justify-center text-xl shadow-sm hover:scale-105 transition-all"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}