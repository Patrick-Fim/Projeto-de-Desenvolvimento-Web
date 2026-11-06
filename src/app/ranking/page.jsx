'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTrophy, FaCrown, FaMedal, FaTriangleExclamation, FaFlagCheckered } from 'react-icons/fa6';
import PageHeader from '../../components/PageHeader';
import Avatar from '../../components/Avatar';
import Foguinho from '../../components/Foguinho';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { nivelDe } from '../../lib/gamificacao';

// Cores do pódio: ouro, prata e bronze.
const PODIO = [
  { cor: 'from-amber-300 to-amber-500 text-amber-950', altura: 'sm:pt-0', Icon: FaCrown },
  { cor: 'from-slate-200 to-slate-400 text-slate-900', altura: 'sm:pt-10', Icon: FaMedal },
  { cor: 'from-orange-300 to-orange-600 text-orange-950', altura: 'sm:pt-16', Icon: FaMedal },
];

export default function RankingPage() {
  const { usuario } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      setCarregando(true);
      setErro('');
      const res = await fetch('/api/ranking');
      if (!res.ok) throw new Error('Falha ao carregar o ranking.');
      setRanking(await res.json());
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const podio = ranking.slice(0, 3);
  // Ordem visual do pódio: 2º, 1º, 3º.
  const ordemPodio = [podio[1], podio[0], podio[2]].filter(Boolean);

  return (
    <main>
      <PageHeader
        eyebrow={<><FaTrophy aria-hidden="true" /> Ranking</>}
        title="Os Protetores mais ativos"
        description="Ganhe XP registrando denúncias, engajando e concluindo missões. Quanto mais você protege, mais alto você sobe."
      />

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        {carregando && (
          <div className="space-y-3" aria-busy="true">
            <span className="sr-only">Carregando ranking...</span>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-foreground/10" />
            ))}
          </div>
        )}

        {erro && !carregando && (
          <div role="alert" className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-danger-text/30 bg-danger-text/10 p-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 font-semibold text-danger-text">
              <FaTriangleExclamation aria-hidden="true" /> {erro}
            </p>
            <Button variant="outline" size="sm" onClick={carregar}>Tentar novamente</Button>
          </div>
        )}

        {!carregando && !erro && ranking.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <FaTrophy aria-hidden="true" className="mx-auto text-3xl text-amber-500" />
            <h2 className="mt-3 text-lg font-bold text-foreground">Ninguém no ranking ainda</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              <Link href="/login" className="font-bold text-primary-text hover:underline">Crie sua conta</Link> e seja o primeiro protetor!
            </p>
          </div>
        )}

        {/* Pódio dos três primeiros */}
        {!carregando && !erro && podio.length > 0 && (
          <section aria-label="Pódio" className="grid items-end gap-4 sm:grid-cols-3">
            {ordemPodio.map((p) => {
              const estilo = PODIO[p.posicao - 1];
              const Icon = estilo.Icon;
              const ehVoce = usuario?.uid === p.uid;
              return (
                <div key={p.uid} className={`${estilo.altura} ${p.posicao === 1 ? 'order-first sm:order-none' : ''}`}>
                  <div className={`rounded-3xl border bg-card p-6 text-center shadow-sm ${ehVoce ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}>
                    <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br shadow-md ${estilo.cor}`}>
                      <Icon aria-hidden="true" />
                    </span>
                    <Avatar nome={p.nome} anel={p.anel} tamanho="lg" className="mx-auto mt-4" />
                    <p className="mt-3 truncate font-bold text-foreground">{p.nome}{ehVoce && ' (você)'}</p>
                    <p className="text-xs font-semibold text-foreground-muted">{nivelDe(p.xp).nome}</p>
                    <p className="mt-2 font-display text-2xl font-black text-foreground">{p.xp} XP</p>
                    <p className="sr-only">{p.posicao}º lugar</p>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Lista completa */}
        {!carregando && !erro && ranking.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="sr-only">Classificação completa</h2>
            <ol className="divide-y divide-border">
              {ranking.map((p) => {
                const ehVoce = usuario?.uid === p.uid;
                const nivel = nivelDe(p.xp);
                return (
                  <li key={p.uid} className={`flex items-center gap-4 px-5 py-4 ${ehVoce ? 'bg-primary/5' : ''}`}>
                    <span className="w-8 text-center font-display text-lg font-black text-foreground-muted">{p.posicao}</span>
                    <Avatar nome={p.nome} anel={p.anel} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-foreground">
                        {p.nome}
                        {ehVoce && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary-text">você</span>}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        Nível {nivel.numero} · {nivel.nome}
                        {p.cidade ? ` · ${p.cidade}` : ''}
                      </p>
                    </div>
                    <div className="hidden items-center gap-3 sm:flex">
                      <span className="flex items-center gap-1 text-xs font-semibold text-foreground-muted" title="Missões concluídas">
                        <FaFlagCheckered aria-hidden="true" className="text-accent-text" />
                        {p.concluidas}
                        <span className="sr-only">missões concluídas</span>
                      </span>
                      <Foguinho dias={p.sequenciaAtual} />
                    </div>
                    <span className="w-20 text-right font-display font-black text-foreground">{p.xp} XP</span>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
