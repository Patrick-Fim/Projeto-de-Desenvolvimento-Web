'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FaXmark, FaTrophy } from 'react-icons/fa6';

const DURACAO = 5000; // ms até o aviso sumir sozinho
const CORES_CONFETE = ['#FBBF24', '#F59E0B', '#00AB39', '#0096C7', '#F472B6'];

// Cartão de "Conquista desbloqueada!" no canto inferior direito, com explosão de confetes.
export default function AvisoConquista({ conquista, onFechar }) {
  const cartaoRef = useRef(null);
  const onFecharRef = useRef(onFechar);
  useEffect(() => {
    onFecharRef.current = onFechar;
  });

  useEffect(() => {
    // Os confetes saem da medalha, no lado esquerdo do cartão.
    const area = cartaoRef.current?.getBoundingClientRect();
    const origem = area
      ? { x: (area.left + 44) / window.innerWidth, y: (area.top + 44) / window.innerHeight }
      : { x: 0.9, y: 0.9 };
    const base = { origin: origem, colors: CORES_CONFETE, zIndex: 95, disableForReducedMotion: true };

    confetti({ ...base, particleCount: 70, spread: 70, angle: 120, startVelocity: 45 });
    const segundaExplosao = setTimeout(
      () => confetti({ ...base, particleCount: 40, spread: 110, angle: 100, startVelocity: 30, scalar: 0.8 }),
      250
    );
    const fechar = setTimeout(() => onFecharRef.current?.(), DURACAO);

    return () => {
      clearTimeout(segundaExplosao);
      clearTimeout(fechar);
    };
  }, [conquista.id]);

  const Icon = conquista.Icon || FaTrophy;

  return (
    <div
      ref={cartaoRef}
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-4 right-4 z-[90] animate-conquista sm:bottom-6 sm:left-auto sm:right-6 sm:w-96"
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/50 bg-card p-4 shadow-2xl shadow-amber-500/20">
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-amber-400/15 via-transparent to-transparent" />

        <div className="relative flex items-center gap-4">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-amber-400/40" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-amber-300 to-amber-500 text-2xl text-amber-950 shadow-lg animate-medalha">
              <Icon aria-hidden="true" />
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
              Conquista desbloqueada!
            </p>
            <p className="mt-0.5 font-display text-lg font-black leading-tight text-foreground">{conquista.titulo}</p>
            <p className="text-sm text-foreground-muted">{conquista.descricao}</p>
          </div>

          <button
            type="button"
            onClick={() => onFecharRef.current?.()}
            aria-label="Fechar aviso de conquista"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center self-start rounded-lg text-foreground-muted hover:bg-foreground/5 hover:text-foreground"
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-1 w-full origin-left bg-linear-to-r from-amber-300 to-amber-500 animate-tempo"
          style={{ animationDuration: `${DURACAO}ms` }}
        />
      </div>
    </div>
  );
}
