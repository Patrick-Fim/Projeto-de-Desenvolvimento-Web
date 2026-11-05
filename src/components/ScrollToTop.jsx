'use client';

import { useState, useEffect } from 'react';

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
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border-none cursor-pointer flex items-center justify-center text-white bg-gradient-to-r from-primary to-primary-dark shadow-lg transition-all duration-300 ${
        visivel
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Ícone de Seta para cima em SVG puro (não precisa de bibliotecas externas) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}