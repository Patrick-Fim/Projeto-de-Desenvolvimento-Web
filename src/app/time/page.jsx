'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrophy, FaUsers, FaStar, FaPenToSquare, FaComments } from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';
import { useAmigos } from '../../context/AmigosContext';
import { getRing } from '../../lib/rings';
import { nivelDe } from '../../lib/gamificacao';
import { membrosDoTime, rankingElementos } from '../../lib/servicos';
import Avatar from '../../components/Avatar';
import BotaoAmizade from '../../components/BotaoAmizade';

const formatar = (n) => new Intl.NumberFormat('pt-BR').format(n || 0);

// Página do time: quem tem o mesmo anel favorito conversa aqui e soma XP para o elemento.
export default function TimePage() {
  const router = useRouter();
  const { usuario, perfil, carregando } = useAuth();
  const { abrirTime } = useAmigos();
  const [membros, setMembros] = useState([]);
  const [placar, setPlacar] = useState(null);

  useEffect(() => {
    if (!carregando && !usuario) router.replace('/login?voltar=/time');
  }, [carregando, usuario, router]);

  const anel = perfil?.anel;

  useEffect(() => {
    if (!anel) return;
    membrosDoTime(anel).then(setMembros).catch(() => setMembros([]));
    rankingElementos('geral')
      .then((times) => setPlacar(times.find((t) => t.id === anel) || null))
      .catch(() => setPlacar(null));
  }, [anel]);

  if (carregando || !usuario || !perfil) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16" aria-busy="true">
        <div className="h-64 animate-pulse rounded-3xl bg-foreground/10" />
      </main>
    );
  }

  const ring = getRing(anel);
  const Icon = ring.Icon;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {/* Cabeçalho do time, na cor do elemento */}
      <section className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl dark:text-slate-950 ${ring.bg}`}>
        <Icon aria-hidden="true" className="absolute -right-6 -top-6 text-[10rem] opacity-15" />
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-90">Meu time</p>
        <h1 className="mt-2 flex items-center gap-3 text-4xl font-black">
          <Icon aria-hidden="true" /> Time {ring.label}
        </h1>
        <p className="mt-2 max-w-xl opacity-90">{ring.desc}</p>

        <dl className="mt-6 flex flex-wrap gap-6 text-sm font-bold">
          <div className="flex items-center gap-2">
            <FaUsers aria-hidden="true" />
            <dt className="sr-only">Protetores</dt>
            <dd>{formatar(placar?.protetores ?? membros.length)} protetores</dd>
          </div>
          <div className="flex items-center gap-2">
            <FaStar aria-hidden="true" />
            <dt className="sr-only">XP do time</dt>
            <dd>{formatar(placar?.xp)} XP no total</dd>
          </div>
          {placar && (
            <div className="flex items-center gap-2">
              <FaTrophy aria-hidden="true" />
              <dt className="sr-only">Posição</dt>
              <dd>{placar.posicao}º lugar entre os elementos</dd>
            </div>
          )}
        </dl>
      </section>

      <p className="text-sm text-foreground-muted">
        Seu time é definido pelo anel favorito do perfil.{' '}
        <Link href="/perfil" className="inline-flex items-center gap-1 font-bold text-primary-text hover:underline">
          <FaPenToSquare aria-hidden="true" /> Trocar de anel
        </Link>
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <span className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white dark:text-slate-950 ${ring.bg}`}>
            <FaComments aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-foreground">Chat do Time {ring.label}</h2>
          <p className="mt-2 max-w-sm text-sm text-foreground-muted">
            A conversa do time agora fica no balão de conversas, junto com os seus amigos. Só protetores
            deste elemento participam.
          </p>
          <button
            type="button"
            onClick={abrirTime}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-dark px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 dark:text-slate-950"
          >
            <FaComments aria-hidden="true" /> Abrir chat do time
          </button>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="flex items-center justify-between text-base font-bold text-foreground">
            Protetores do time
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary-text">{membros.length}</span>
          </h2>
          <ul className="mt-4 space-y-3">
            {membros.map((m, i) => (
              <li key={m.uid} className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-black text-foreground-muted">{i + 1}</span>
                <Avatar nome={m.nome} anel={m.anel} fotoId={m.avatarId} tamanho="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">
                    {m.nome}
                    {m.uid === usuario.uid && <span className="ml-1 text-xs font-semibold text-foreground-muted">(você)</span>}
                  </p>
                  <p className="text-xs text-foreground-muted">{formatar(m.xp)} XP · {nivelDe(m.xp).nome}</p>
                </div>
                <BotaoAmizade uid={m.uid} nome={m.nome} compacto />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
