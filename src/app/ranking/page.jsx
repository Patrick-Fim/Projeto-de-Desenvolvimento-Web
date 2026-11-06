'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTrophy, FaCrown, FaMedal, FaTriangleExclamation, FaFlagCheckered, FaUsers } from 'react-icons/fa6';
import PageHeader from '../../components/PageHeader';
import Avatar from '../../components/Avatar';
import Foguinho from '../../components/Foguinho';
import Button from '../../components/Button';
import BotaoAmizade from '../../components/BotaoAmizade';
import { useAuth } from '../../context/AuthContext';
import { nivelDe } from '../../lib/gamificacao';
import { getRing } from '../../lib/rings';
import { ranking as buscarRanking, rankingElementos, PERIODOS_RANKING } from '../../lib/servicos';

// Cores do pódio: ouro, prata e bronze.
const PODIO = [
  { cor: 'from-amber-300 to-amber-500 text-amber-950', altura: 'sm:pt-0', Icon: FaCrown },
  { cor: 'from-slate-200 to-slate-400 text-slate-900', altura: 'sm:pt-10', Icon: FaMedal },
  { cor: 'from-orange-300 to-orange-600 text-orange-950', altura: 'sm:pt-16', Icon: FaMedal },
];

const DESCRICAO_PERIODO = {
  semanal: 'XP ganho nesta semana (começa na segunda-feira).',
  mensal: 'XP ganho neste mês.',
  geral: 'Todo o XP desde a entrada na plataforma.',
};

const formatar = (n) => new Intl.NumberFormat('pt-BR').format(n || 0);

export default function RankingPage() {
  const { usuario } = useAuth();
  const [periodo, setPeriodo] = useState('semanal');
  const [ranking, setRanking] = useState([]);
  const [times, setTimes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      const [pessoas, elementos] = await Promise.all([buscarRanking(periodo), rankingElementos(periodo)]);
      setRanking(pessoas);
      setTimes(elementos);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const podio = ranking.slice(0, 3);
  // Ordem visual do pódio: 2º, 1º, 3º.
  const ordemPodio = [podio[1], podio[0], podio[2]].filter(Boolean);
  const maiorXpTime = Math.max(1, ...times.map((t) => t.xp));

  return (
    <main>
      <PageHeader
        eyebrow={<><FaTrophy aria-hidden="true" /> Ranking</>}
        title="Os Protetores mais ativos"
        description="Ganhe XP registrando denúncias, engajando e concluindo missões. Quanto mais você protege, mais alto você — e o seu time — sobem."
      />

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        {/* Período do ranking */}
        <div className="space-y-2">
          <div className="inline-flex rounded-xl border border-border bg-card p-1" role="group" aria-label="Período do ranking">
            {PERIODOS_RANKING.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodo(p.id)}
                aria-pressed={periodo === p.id}
                className={`cursor-pointer rounded-lg px-5 py-2 text-sm font-bold transition ${
                  periodo === p.id
                    ? 'bg-primary-dark text-white shadow-sm dark:text-slate-950'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                {p.rotulo}
              </button>
            ))}
          </div>
          <p className="text-sm text-foreground-muted">{DESCRICAO_PERIODO[periodo]}</p>
        </div>

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

        {/* Ranking dos elementos (times) */}
        {!carregando && !erro && (
          <section aria-labelledby="titulo-elementos" className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 id="titulo-elementos" className="text-lg font-bold text-foreground">Ranking dos elementos</h2>
            <p className="text-sm text-foreground-muted">Soma do XP de todos os protetores de cada anel.</p>
            <ol className="mt-5 space-y-3">
              {times.map((time) => {
                const ring = getRing(time.id);
                const Icon = ring.Icon;
                return (
                  <li key={time.id} className="flex items-center gap-3">
                    <span className="w-6 text-center font-display font-black text-foreground-muted">{time.posicao}</span>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white dark:text-slate-950 ${ring.bg}`}>
                      <Icon aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-foreground">
                          Time {ring.label}
                          {time.posicao === 1 && time.xp > 0 && <FaCrown aria-label="Líder" className="ml-1.5 inline text-amber-500" />}
                        </p>
                        <p className="shrink-0 text-sm font-black text-foreground">{formatar(time.xp)} XP</p>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                        <div className={`h-full rounded-full ${ring.bg}`} style={{ width: `${(time.xp / maiorXpTime) * 100}%` }} />
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
                        <FaUsers aria-hidden="true" /> {time.protetores} {time.protetores === 1 ? 'protetor' : 'protetores'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {!carregando && !erro && ranking.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <FaTrophy aria-hidden="true" className="mx-auto text-3xl text-amber-500" />
            <h2 className="mt-3 text-lg font-bold text-foreground">Ninguém pontuou neste período ainda</h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {usuario ? 'Registre uma denúncia ou entre numa missão e seja o primeiro!' : <><Link href="/login" className="font-bold text-primary-text hover:underline">Crie sua conta</Link> e seja o primeiro protetor!</>}
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
                    <Avatar nome={p.nome} anel={p.anel} fotoId={p.avatarId} tamanho="lg" className="mx-auto mt-4" />
                    <p className="mt-3 truncate font-bold text-foreground">{p.nome}{ehVoce && ' (você)'}</p>
                    <p className="text-xs font-semibold text-foreground-muted">{nivelDe(p.xp).nome}</p>
                    <p className="mt-2 font-display text-2xl font-black text-foreground">{formatar(p.xpPeriodo)} XP</p>
                    <p className="sr-only">{p.posicao}º lugar</p>
                    <div className="mt-3 flex justify-center">
                      <BotaoAmizade uid={p.uid} nome={p.nome} />
                    </div>
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
                    <Avatar nome={p.nome} anel={p.anel} fotoId={p.avatarId} />
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
                    <span className="w-20 text-right font-display font-black text-foreground">{formatar(p.xpPeriodo)} XP</span>
                    <BotaoAmizade uid={p.uid} nome={p.nome} compacto />
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
