'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

export default function ScrollToTop() {
  // O botão só fica interativo depois que a página passa do limite definido.
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 300);
    aoRolar();
    // Remove o ouvinte ao desmontar o componente para evitar manter uma inscrição ativa.
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const subir = () => {
    // Retorna suavemente ao início da página.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={subir}
      title="Voltar ao topo"
      aria-label="Voltar ao topo"
      tabIndex={visivel ? 0 : -1}
      className={`fixed bottom-24 right-5 z-40 sm:right-7 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary-dark text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-slate-950 ${
        visivel
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <FaArrowUp aria-hidden="true" />
    </button>
  );
}
