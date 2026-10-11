import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Interação WCAG: Fechar ao pressionar a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Container do Modal */}
      <div
        className="bg-card w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-border space-y-4 animate-scaleUp"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro feche o modal
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 id="modal-title" className="text-xl font-bold text-foreground">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-foreground/50 hover:text-foreground text-2xl font-bold w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        <div className="text-foreground/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}