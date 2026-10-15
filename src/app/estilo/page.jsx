'use client';

import { useState, useEffect } from 'react';

export default function GuiaDeEstilosPage() {
  const [isDark, setIsDark] = useState(false);

  // Monitora alterações na classe 'dark' do elemento <html> em tempo real
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDark(); // Checagem inicial

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Mapeamento dinâmico dos códigos HEX conforme o modo ativo
  const colors = {
    primary: isDark ? '#00B4D8' : '#0096C7',
    primaryDark: isDark ? '#90E0EF' : '#0077B6',
    foreground: isDark ? '#F8FAFC' : '#03045E',
    accent: isDark ? '#10B981' : '#00AB39',
    background: isDark ? '#0F172A' : '#F0F9FF',
    card: isDark ? '#1E293B' : '#FFFFFF',
  };

  return (
    <main className="min-h-screen p-6 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <header className="border-b border-primary/20 pb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-accent-text bg-accent/15 border border-accent/30 px-3 py-1 rounded-full">
          ✓ Guia de Estilo Protetores da Terra
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mt-3">
          O Poder é de Vocês!
        </h1>
        <p className="text-foreground-muted mt-2 max-w-2xl">
          Página de validação dos tokens de design, tipografia (Montserrat + Inter), paleta do Capitão Planeta e Anéis Elementais.
        </p>
      </header>

      {/* Seção 1: Paleta de Cores Principais */}
      <section className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-foreground">1. Cores Principais (Capitão Planeta)</h2>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-card border border-border text-foreground-muted">
            Modo Ativo: {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-primary text-white dark:text-slate-950 shadow-sm transition-all">
            <p className="text-xs opacity-80">Primary</p>
            <p className="font-bold mt-1 font-mono">{colors.primary}</p>
          </div>

          <div className="p-4 rounded-xl bg-primary-dark text-white dark:text-slate-950 shadow-sm transition-all">
            <p className="text-xs opacity-80">Primary Dark</p>
            <p className="font-bold mt-1 font-mono">{colors.primaryDark}</p>
          </div>

          <div className="p-4 rounded-xl bg-foreground text-background shadow-sm transition-all">
            <p className="text-xs opacity-80">Foreground</p>
            <p className="font-bold mt-1 font-mono">{colors.foreground}</p>
          </div>

          <div className="p-4 rounded-xl bg-accent text-white shadow-sm transition-all">
            <p className="text-xs opacity-80 font-bold">Ecological</p>
            <p className="font-bold mt-1 font-mono">{colors.accent}</p>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border shadow-sm transition-all">
            <p className="text-xs text-foreground-muted">Background</p>
            <p className="font-bold text-foreground mt-1 font-mono">{colors.background}</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border shadow-sm transition-all">
            <p className="text-xs text-foreground-muted">Card</p>
            <p className="font-bold text-foreground mt-1 font-mono">{colors.card}</p>
          </div>
        </div>
      </section>

      {/* Seção 2: Os 5 Anéis Elementais */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">2. Anéis Elementais</h2>
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
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">3. Tipografia</h2>
        
        <div>
          <span className="text-xs text-foreground-muted uppercase font-bold">Display — Montserrat 900</span>
          <p className="text-3xl font-extrabold text-foreground">O Poder é de Vocês!</p>
        </div>

        <div>
          <span className="text-xs text-foreground-muted uppercase font-bold">Heading — Montserrat 700</span>
          <p className="text-xl font-bold text-foreground">Escolha seu Anel Mágico</p>
        </div>

        <div>
          <span className="text-xs text-foreground-muted uppercase font-bold">Body — Inter 400</span>
          <p className="text-base text-foreground-muted">
            Cada ação conta para o futuro do planeta e das próximas gerações. Participe ativamente das denúncias e missões ambientais na sua comunidade.
          </p>
        </div>

        <div>
          <span className="text-xs text-foreground-muted uppercase font-bold">Label — Inter 600</span>
          <p className="text-xs font-semibold text-accent-text">✓ 100.740 Protetores Ativos</p>
        </div>
      </section>

      {/* Seção 4: Botões e Interações */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">4. Variantes de Botões</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="bg-primary hover:bg-primary-dark text-white dark:text-slate-950 font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Primary)
          </button>

          <button className="bg-accent hover:opacity-90 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Ecological)
          </button>

          <button className="bg-foreground text-background hover:opacity-90 font-medium px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
            Tornar-se Protetor (Dark)
          </button>

          <button className="border-2 border-primary-text text-primary-text hover:bg-primary/10 font-medium px-6 py-3 rounded-xl transition-all active:scale-95">
            Saiba Mais (Outline)
          </button>
        </div>

        <div className="pt-4">
          <p className="text-sm font-semibold text-foreground mb-3">Seletor de Anéis (Ring Buttons):</p>
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