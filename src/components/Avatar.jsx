import { getRing } from '../lib/rings';
import { urlImagem } from '../lib/imagens';

const TAMANHOS = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-24 w-24 text-3xl',
  xl: 'h-28 w-28 text-4xl',
};

// Avatar do protetor: a foto de perfil (fotoId) ou, sem foto, as iniciais na cor do anel favorito.
export default function Avatar({ nome = '', anel, fotoId, tamanho = 'md', className = '' }) {
  const ring = getRing(anel);

  if (fotoId) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={urlImagem(fotoId)}
        alt=""
        aria-hidden="true"
        className={`inline-block shrink-0 rounded-full object-cover ring-2 ring-background ${ring.bg} ${TAMANHOS[tamanho]} ${className}`}
      />
    );
  }

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
