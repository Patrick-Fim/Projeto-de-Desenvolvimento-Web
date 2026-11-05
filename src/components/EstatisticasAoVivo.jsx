'use client';

import { useEffect, useState } from 'react';

// Uma única busca compartilhada pelos componentes da página (renovada a cada 15 s).
let buscaEmAndamento = null;
function buscarEstatisticas() {
  if (!buscaEmAndamento) {
    buscaEmAndamento = fetch('/api/estatisticas')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Falha'))))
      .finally(() => setTimeout(() => { buscaEmAndamento = null; }, 15000));
  }
  return buscaEmAndamento;
}

function useEstatisticas() {
  const [dados, setDados] = useState(null);
  useEffect(() => {
    let ativo = true;
    buscarEstatisticas()
      .then((resultado) => ativo && setDados(resultado))
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);
  return dados;
}

const formatar = (numero) => new Intl.NumberFormat('pt-BR').format(numero);

// Selo do topo: número real de usuários cadastrados.
export function SeloProtetores() {
  const dados = useEstatisticas();
  const total = dados?.protetores;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-text">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {total === undefined
        ? 'Protetores Ativos'
        : `${formatar(total)} ${total === 1 ? 'Protetor Ativo' : 'Protetores Ativos'}`}
    </span>
  );
}

// Faixa de números de impacto, com dados reais do Firestore.
export function FaixaEstatisticas() {
  const dados = useEstatisticas();
  const itens = [
    { label: 'Protetores cadastrados', valor: dados?.protetores },
    { label: 'Missões registradas', valor: dados?.missoes },
    { label: 'Missões concluídas', valor: dados?.concluidas },
    { label: 'Cidades atendidas', valor: dados?.cidades },
  ];

  return (
    <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4" aria-busy={!dados}>
      {itens.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse text-center md:border-l md:border-border md:pl-8 md:text-left md:first:border-l-0 md:first:pl-0"
        >
          <dt className="mt-1 text-sm font-semibold text-foreground-muted">{item.label}</dt>
          <dd className="font-display text-3xl font-black text-foreground sm:text-4xl">
            {item.valor === undefined ? (
              <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-foreground/10 align-middle" />
            ) : (
              formatar(item.valor)
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
