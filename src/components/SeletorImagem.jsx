'use client';

import { useRef, useState } from 'react';
import { FaImage, FaTrash, FaTriangleExclamation } from 'react-icons/fa6';
import { comprimirImagem } from '../lib/imagens';
import Button from './Button';

// Formato da pré-visualização de cada tipo de imagem.
const MOLDURAS = {
  avatar: 'h-24 w-24 shrink-0 rounded-full',
  banner: 'aspect-[3/1] w-full rounded-xl',
  capa: 'aspect-video w-full rounded-xl',
};

// Escolha de imagem com pré-visualização e compressão automática.
// valor: URL da imagem atual, data URL da imagem nova ou null (sem imagem).
export default function SeletorImagem({ id, rotulo, formato = 'capa', valor, onChange, dica }) {
  const inputRef = useRef(null);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');
  const redondo = formato === 'avatar';

  const escolher = async (arquivo) => {
    if (!arquivo) return;
    setErro('');
    try {
      setProcessando(true);
      onChange(await comprimirImagem(arquivo, formato));
    } catch (err) {
      setErro(err.message || 'Não foi possível usar esta imagem.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="space-y-2">
      <p id={`${id}-rotulo`} className="text-sm font-bold text-foreground">{rotulo}</p>

      <div className={`flex gap-4 ${redondo ? 'items-center' : 'flex-col'}`}>
        <div className={`relative overflow-hidden border border-border bg-background ${MOLDURAS[formato]}`}>
          {valor ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={valor} alt={`Pré-visualização: ${rotulo}`} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-foreground-muted">
              <FaImage aria-hidden="true" className="text-2xl" />
            </span>
          )}
          {processando && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/20" />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-labelledby={`${id}-rotulo`}
            onChange={(e) => {
              escolher(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <Button variant="outline" size="sm" disabled={processando} onClick={() => inputRef.current?.click()}>
            <FaImage aria-hidden="true" />
            {processando ? 'Preparando...' : valor ? 'Trocar imagem' : 'Escolher imagem'}
          </Button>
          {valor && !processando && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              <FaTrash aria-hidden="true" /> Remover
            </Button>
          )}
        </div>
      </div>

      {erro ? (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-semibold text-danger-text">
          <FaTriangleExclamation aria-hidden="true" /> {erro}
        </p>
      ) : (
        dica && <p className="text-xs text-foreground-muted">{dica}</p>
      )}
    </div>
  );
}
