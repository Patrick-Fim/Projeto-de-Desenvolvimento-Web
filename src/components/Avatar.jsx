import { getRing } from '../lib/rings';

const TAMANHOS = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-24 w-24 text-3xl',
};

// Avatar com as iniciais do protetor, na cor do seu anel favorito.
export default function Avatar({ nome = '', anel, tamanho = 'md', className = '' }) {
  const ring = getRing(anel);
  const iniciais =
    nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('') || '?';

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-black text-white ring-2 ring-background dark:text-slate-950 ${ring.bg} ${TAMANHOS[tamanho]} ${className}`}
    >
      {iniciais}
    </span>
  );
}
