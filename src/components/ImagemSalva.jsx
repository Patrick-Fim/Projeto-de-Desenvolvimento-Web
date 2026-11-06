'use client';

import { useEffect, useState } from 'react';
import { carregarImagem } from '../lib/servicos';

// Mostra uma imagem guardada no Firestore (coleção "imagens") pelo id.
// Enquanto carrega, ocupa o mesmo espaço com um fundo neutro.
export default function ImagemSalva({ id, alt = '', className = '', ...props }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let ativo = true;
    carregarImagem(id).then((dados) => ativo && setSrc(dados));
    return () => {
      ativo = false;
    };
  }, [id]);

  if (!src) return <span aria-hidden="true" className={`block animate-pulse bg-foreground/10 ${className}`} />;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} {...props} />;
}
