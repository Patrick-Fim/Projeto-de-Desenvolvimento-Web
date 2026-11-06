'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserGroup,
  FaUserPlus,
  FaComments,
  FaCheck,
  FaXmark,
  FaMagnifyingGlass,
  FaPaperPlane,
} from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';
import { useAmigos } from '../../context/AmigosContext';
import { buscarProtetores } from '../../lib/servicos';
import { getRing } from '../../lib/rings';
import { nivelDe } from '../../lib/gamificacao';
import PageHeader from '../../components/PageHeader';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import BotaoAmizade from '../../components/BotaoAmizade';
import CampoBusca from '../../components/CampoBusca';

const ABAS = [
  { id: 'amigos', rotulo: 'Meus amigos', Icon: FaUserGroup },
  { id: 'pedidos', rotulo: 'Pedidos', Icon: FaUserPlus },
  { id: 'encontrar', rotulo: 'Encontrar protetores', Icon: FaMagnifyingGlass },
];

// Linha com avatar, nome, anel/nível e as ações ao lado.
function LinhaProtetor({ perfil, children }) {
  const ring = getRing(perfil?.anel);
  return (
    <li className="flex flex-wrap items-center gap-3 px-5 py-4">
      <Avatar nome={perfil?.nome} anel={perfil?.anel} fotoId={perfil?.avatarId} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-foreground">{perfil?.nome || 'Carregando...'}</p>
        <p className="text-xs text-foreground-muted">
          <span className={ring.text}>Anel {ring.label}</span> · Nível {nivelDe(perfil?.xp).numero} · {perfil?.xp || 0} XP
          {perfil?.cidade ? ` · ${perfil.cidade}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </li>
  );
}

function ListaVazia({ Icon, titulo, texto }) {
  return (
    <div className="px-6 py-14 text-center">
      <Icon aria-hidden="true" className="mx-auto text-3xl text-primary/40" />
      <p className="mt-3 font-bold text-foreground">{titulo}</p>
      <p className="mt-1 text-sm text-foreground-muted">{texto}</p>
    </div>
  );
}

export default function AmigosPage() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();
  const { amigos, recebidos, enviados, aceitar, remover, abrirConversa } = useAmigos();
  const [aba, setAba] = useState('amigos');
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Página exclusiva para quem está logado.
  useEffect(() => {
    if (!carregando && !usuario) router.replace('/login?voltar=/amigos');
  }, [carregando, usuario, router]);

  // Busca protetores enquanto digita (com uma pequena espera).
  useEffect(() => {
    if (aba !== 'encontrar' || !usuario) return undefined;
    setBuscando(true);
    const espera = setTimeout(() => {
      buscarProtetores(busca)
        .then((lista) => setResultados(lista.filter((p) => p.uid !== usuario.uid)))
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false));
    }, 300);
    return () => clearTimeout(espera);
  }, [aba, busca, usuario]);

  if (carregando || !usuario) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16" aria-busy="true">
        <div className="h-64 animate-pulse rounded-2xl bg-foreground/10" />
      </main>
    );
  }

  const contagens = { amigos: amigos.length, pedidos: recebidos.length };

  return (
    <main>
      <PageHeader
        eyebrow={<><FaUserGroup aria-hidden="true" /> Amigos</>}
        title="Sua rede de protetores"
        description="Adicione amigos para conversar em particular pelo balão de chat e acompanhar quem está protegendo o planeta com você."
      />

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        {/* Abas */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Seções de amigos">
          {ABAS.map(({ id, rotulo, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              aria-pressed={aba === id}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                aba === id
                  ? 'border-transparent bg-primary-dark text-white shadow-md dark:text-slate-950'
                  : 'border-border bg-card text-foreground-muted hover:text-foreground'
              }`}
            >
              <Icon aria-hidden="true" />
              {rotulo}
              {contagens[id] > 0 && (
                <span className={`rounded-full px-2 text-xs font-black ${id === 'pedidos' ? 'bg-ring-fire text-white' : 'bg-foreground/10'}`}>
                  {contagens[id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {aba === 'amigos' &&
            (amigos.length === 0 ? (
              <ListaVazia Icon={FaUserGroup} titulo="Você ainda não tem amigos" texto="Use a aba “Encontrar protetores” para adicionar alguém." />
            ) : (
              <ul className="divide-y divide-border">
                {amigos.map((a) => (
                  <LinhaProtetor key={a.uid} perfil={a.perfil}>
                    <Button size="sm" onClick={() => abrirConversa(a.uid)}>
                      <FaComments aria-hidden="true" /> Conversar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remover(a.par)} ariaLabel={`Desfazer amizade com ${a.perfil?.nome || 'amigo'}`}>
                      <FaXmark aria-hidden="true" />
                    </Button>
                  </LinhaProtetor>
                ))}
              </ul>
            ))}

          {aba === 'pedidos' && (
            <div className="divide-y divide-border">
              <div>
                <h2 className="px-5 pt-5 text-sm font-bold uppercase tracking-wider text-foreground-muted">Recebidos</h2>
                {recebidos.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-foreground-muted">Nenhum pedido recebido.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recebidos.map((p) => (
                      <LinhaProtetor key={p.uid} perfil={p.perfil}>
                        <Button variant="ecological" size="sm" onClick={() => aceitar(p.par)}>
                          <FaCheck aria-hidden="true" /> Aceitar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remover(p.par)}>Recusar</Button>
                      </LinhaProtetor>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h2 className="px-5 pt-5 text-sm font-bold uppercase tracking-wider text-foreground-muted">Enviados</h2>
                {enviados.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-foreground-muted">Nenhum pedido aguardando resposta.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {enviados.map((p) => (
                      <LinhaProtetor key={p.uid} perfil={p.perfil}>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted">
                          <FaPaperPlane aria-hidden="true" /> Aguardando
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => remover(p.par)}>Cancelar</Button>
                      </LinhaProtetor>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {aba === 'encontrar' && (
            <div>
              <div className="border-b border-border p-5">
                <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar protetor pelo nome..." rotulo="Buscar protetor pelo nome" />
              </div>
              {buscando && resultados.length === 0 ? (
                <p className="px-5 py-6 text-sm text-foreground-muted" aria-live="polite">Buscando...</p>
              ) : resultados.length === 0 ? (
                <ListaVazia Icon={FaMagnifyingGlass} titulo="Ninguém encontrado" texto="Tente outro nome." />
              ) : (
                <ul className="divide-y divide-border">
                  {resultados.map((p) => (
                    <LinhaProtetor key={p.uid} perfil={p}>
                      <BotaoAmizade uid={p.uid} nome={p.nome} />
                    </LinhaProtetor>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
