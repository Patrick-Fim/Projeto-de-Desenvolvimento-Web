'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCircleCheck, FaArrowRight } from 'react-icons/fa6';
import { getRing } from '../lib/rings';

// Como cada anel celebra: animação (globals.css), de onde as partículas saem e suas cores.
const EFEITOS = {
  coracao: {
    animacao: 'subir',
    origem: 'baixo',
    ritmo: 'ease-out',
    cores: ['text-pink-300', 'text-pink-400', 'text-pink-500', 'text-rose-400'],
    duracao: [2.2, 3.2],
    tamanho: [18, 46],
  },
  fogo: {
    animacao: 'labareda',
    origem: 'baixo',
    ritmo: 'ease-out',
    cores: ['text-amber-300', 'text-orange-400', 'text-orange-500', 'text-red-500'],
    duracao: [1.4, 2.2],
    tamanho: [20, 54],
  },
  terra: {
    animacao: 'folha',
    origem: 'topo',
    ritmo: 'linear',
    cores: ['text-lime-500', 'text-green-400', 'text-green-600', 'text-emerald-500'],
    duracao: [2.6, 3.4],
    tamanho: [18, 40],
  },
  agua: {
    animacao: 'gota',
    origem: 'topo',
    ritmo: 'ease-in',
    cores: ['text-cyan-400', 'text-sky-300', 'text-sky-400', 'text-blue-500'],
    duracao: [1.0, 1.8],
    tamanho: [12, 30],
  },
  vento: {
    animacao: 'rajada',
    origem: 'esquerda',
    ritmo: 'ease-in-out',
    cores: ['text-cyan-200', 'text-cyan-300', 'text-sky-300', 'text-slate-300'],
    duracao: [1.4, 2.2],
    tamanho: [24, 60],
  },
};

const QUANTIDADE = 42;
const DURACAO_TOTAL = 3200;  // ms até seguir para o painel
const DURACAO_REDUZIDA = 1600; // para quem prefere menos movimento

const entre = (min, max) => min + Math.random() * (max - min);

// Sorteia posição, tamanho, atraso e trajetória de cada partícula.
function gerarParticulas(efeito) {
  return Array.from({ length: QUANTIDADE }, (_, i) => {
    const posicao =
      efeito.origem === 'esquerda'
        ? { left: '-10%', top: `${entre(0, 95)}%` }
        : { left: `${entre(-2, 98)}%`, top: efeito.origem === 'baixo' ? '105%' : '-8%' };

    return {
      id: i,
      cor: efeito.cores[i % efeito.cores.length],
      estilo: {
        ...posicao,
        fontSize: `${entre(...efeito.tamanho)}px`,
        animationName: efeito.animacao,
        animationTimingFunction: efeito.ritmo,
        '--dur': `${entre(...efeito.duracao)}s`,
        '--delay': `${entre(0, 1.1)}s`,
        '--drift': `${entre(-90, 90)}px`,
        '--rot': `${entre(-260, 260)}deg`,
      },
    };
  });
}

// Tela cheia de comemoração ao criar uma missão, com o tema do anel escolhido.
export default function CelebracaoAnel({ anel, titulo, xp, onFim }) {
  const ring = getRing(anel);
  const efeito = EFEITOS[ring.id] || EFEITOS.terra;
  const Icon = ring.Icon;

  const [particulas] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? [] : gerarParticulas(efeito)
  );
  const [saindo, setSaindo] = useState(false);

  const onFimRef = useRef(onFim);
  useEffect(() => {
    onFimRef.current = onFim;
  });

  // Mostra a celebração, esmaece e segue para o painel automaticamente.
  useEffect(() => {
    const total = particulas.length ? DURACAO_TOTAL : DURACAO_REDUZIDA;
    const esmaecer = setTimeout(() => setSaindo(true), total - 450);
    const seguir = setTimeout(() => onFimRef.current?.(), total);
    return () => {
      clearTimeout(esmaecer);
      clearTimeout(seguir);
    };
  }, [particulas.length]);

  return (
    <div
      className={`fixed inset-0 z-[80] overflow-hidden transition-opacity duration-500 ${
        saindo ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="assertive"
    >
      {/* Fundo: véu da página + leve tom do anel (a animação fica no invólucro
          para não sobrescrever a opacidade da camada de cor). */}
      <div aria-hidden="true" className="absolute inset-0 animate-fadeIn">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className={`absolute inset-0 opacity-15 ${ring.bg}`} />
      </div>

      {/* Partículas do anel */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {particulas.map((p) => (
          <Icon key={p.id} className={`particula drop-shadow-md ${p.cor}`} style={p.estilo} />
        ))}
      </div>

      {/* Cartão central */}
      <div className="relative flex h-full items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-2xl animate-scaleUp">
          <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <span aria-hidden="true" className={`absolute inset-0 animate-ping rounded-full opacity-40 ${ring.bg}`} />
            <span className={`relative flex h-20 w-20 items-center justify-center rounded-full text-4xl text-white shadow-xl dark:text-slate-950 ${ring.bg}`}>
              <Icon aria-hidden="true" />
            </span>
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-text">Anel {ring.label}</p>
          <h2 className="mt-2 text-2xl font-black text-foreground">Missão criada!</h2>
          <p className="mt-2 line-clamp-2 text-sm text-foreground-muted">“{titulo}”</p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent-text">
            <FaCircleCheck aria-hidden="true" />
            +{xp} XP
          </p>

          <button
            type="button"
            onClick={() => onFimRef.current?.()}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-foreground-muted hover:text-foreground"
          >
            Levando você ao Painel de Missões
            <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
