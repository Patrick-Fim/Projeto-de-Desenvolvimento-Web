'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FaArrowLeft,
  FaLocationDot,
  FaUsers,
  FaFlagCheckered,
  FaHandshake,
  FaRightToBracket,
  FaCircleCheck,
  FaTrash,
  FaTriangleExclamation,
  FaXmark,
  FaCrown,
} from 'react-icons/fa6';
import { useAuth } from '../../../context/AuthContext';
import { getRing, STATUS_STYLES } from '../../../lib/rings';
import { XP, nivelDe } from '../../../lib/gamificacao';
import { ehMembro } from '../../../lib/missoes';
import Button from '../../../components/Button';
import Avatar from '../../../components/Avatar';
import ChatMissao from '../../../components/ChatMissao';

export default function MissaoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario, perfil, setPerfil, chamarApi } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [toast, setToast] = useState(null);

  const mostrarToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  // Busca a missão e seus membros na API.
  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`/api/missoes/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Falha ao carregar a missão.');
      setDados(json);
      setErro('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Entrar (engajar) ou concluir: a API valida e dá o XP.
  const executarAcao = async (acao) => {
    try {
      setSalvando(true);
      const nivelAntes = nivelDe(perfil?.xp).numero;
      const resposta = await chamarApi(`/api/missoes?id=${id}`, { method: 'PATCH', body: { acao } });
      setPerfil(resposta.perfil);
      await carregar();

      const novoNivel = nivelDe(resposta.perfil.xp);
      const base = acao === 'engajar' ? 'Bem-vindo à missão! O chat foi liberado.' : 'Missão concluída!';
      mostrarToast(
        'success',
        novoNivel.numero > nivelAntes
          ? `${base} +${resposta.xpGanho} XP. Você subiu para o nível ${novoNivel.nome}!`
          : `${base} +${resposta.xpGanho} XP`
      );
    } catch (err) {
      mostrarToast('error', err.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async () => {
    try {
      setSalvando(true);
      const resposta = await chamarApi(`/api/missoes?id=${id}`, { method: 'DELETE' });
      if (resposta.perfil) setPerfil(resposta.perfil);
      router.push('/missoes');
    } catch (err) {
      mostrarToast('error', err.message);
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10" aria-busy="true">
        <span className="sr-only">Carregando missão...</span>
        <div className="h-56 animate-pulse rounded-3xl bg-foreground/10" />
        <div className="h-96 animate-pulse rounded-2xl bg-foreground/10" />
      </main>
    );
  }

  if (erro || !dados) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <FaTriangleExclamation aria-hidden="true" className="mx-auto text-4xl text-danger-text" />
        <h1 className="mt-4 text-2xl font-black text-foreground">{erro || 'Missão não encontrada.'}</h1>
        <Link href="/missoes" className="mt-6 inline-flex items-center gap-2 font-bold text-primary-text hover:underline">
          <FaArrowLeft aria-hidden="true" /> Voltar ao Painel de Missões
        </Link>
      </main>
    );
  }

  const { missao, membros } = dados;
  const ring = getRing(missao.ring);
  const RingIcon = ring.Icon;
  const statusClass = STATUS_STYLES[missao.status] || STATUS_STYLES.Ativa;
  const ehCriador = usuario?.uid === missao.creatorUid;
  const membro = ehMembro(missao, usuario?.uid);
  const concluiu = (missao.concluidoPor || []).includes(usuario?.uid);

  // Botão principal conforme a relação do usuário com a missão.
  let acaoPrincipal = null;
  if (!usuario) {
    acaoPrincipal = (
      <Link
        href={`/login?voltar=/missoes/${id}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 dark:text-slate-950"
      >
        <FaRightToBracket aria-hidden="true" /> Entre para participar
      </Link>
    );
  } else if (!membro) {
    acaoPrincipal = (
      <Button variant="ecological" disabled={salvando} onClick={() => executarAcao('engajar')}>
        <FaHandshake aria-hidden="true" />
        {salvando ? 'Entrando...' : `Entrar na missão (+${XP.engajar} XP)`}
      </Button>
    );
  } else if (!ehCriador && !concluiu) {
    acaoPrincipal = (
      <Button variant="ecological" disabled={salvando} onClick={() => executarAcao('concluir')}>
        <FaFlagCheckered aria-hidden="true" />
        {salvando ? 'Salvando...' : `Marcar como concluída (+${XP.concluir} XP)`}
      </Button>
    );
  } else if (concluiu) {
    acaoPrincipal = (
      <span className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent-text">
        <FaCircleCheck aria-hidden="true" /> Você concluiu esta missão
      </span>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <Link href="/missoes" className="inline-flex items-center gap-2 text-sm font-bold text-primary-text hover:underline">
        <FaArrowLeft aria-hidden="true" /> Voltar às missões
      </Link>

      {/* Cabeçalho da missão */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <span className={`block h-2 w-full ${ring.bg}`} aria-hidden="true" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white dark:text-slate-950 ${ring.bg}`}>
              <RingIcon aria-hidden="true" /> {ring.label}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass}`}>{missao.status}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">{missao.title}</h1>
          {missao.creatorName && <p className="mt-1 text-sm text-foreground-muted">Registrada por {missao.creatorName}</p>}
          <p className="mt-4 max-w-3xl leading-relaxed text-foreground-muted">{missao.description}</p>

          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-foreground-muted">
              <span className="flex items-center gap-1.5"><FaLocationDot aria-hidden="true" className="text-primary-text" /> {missao.location}</span>
              <span className="flex items-center gap-1.5"><FaUsers aria-hidden="true" className="text-primary-text" /> {missao.participants || 0} engajados</span>
              <span className="flex items-center gap-1.5"><FaFlagCheckered aria-hidden="true" className="text-accent-text" /> {(missao.concluidoPor || []).length} concluíram</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ehCriador &&
                (confirmandoExclusao ? (
                  <span className="flex items-center gap-2 rounded-xl bg-danger-text/10 px-3 py-2 text-sm">
                    <span className="font-semibold text-danger-text">Excluir de vez?</span>
                    <Button variant="danger" size="sm" disabled={salvando} onClick={excluir}>Sim, excluir</Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmandoExclusao(false)}>Cancelar</Button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmandoExclusao(true)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-danger-text hover:bg-danger-text/10"
                  >
                    <FaTrash aria-hidden="true" /> Excluir missão
                  </button>
                ))}
              {acaoPrincipal}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chat */}
        <ChatMissao
          missaoId={id}
          podeParticipar={membro}
          usuarioUid={usuario?.uid}
          chamarApi={chamarApi}
          totalMembros={membros.length}
          acaoBloqueado={acaoPrincipal}
        />

        {/* Membros */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="flex items-center justify-between text-base font-bold text-foreground">
            Membros
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary-text">{membros.length}</span>
          </h2>
          {membros.length === 0 ? (
            <p className="mt-4 text-sm text-foreground-muted">Ninguém entrou nesta missão ainda. Seja o primeiro!</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {membros.map((m) => (
                <li key={m.uid} className="flex items-center gap-3">
                  <Avatar nome={m.nome} anel={m.anel} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
                      {m.nome}
                      {m.uid === usuario?.uid && <span className="text-xs font-semibold text-foreground-muted">(você)</span>}
                    </p>
                    <p className="text-xs text-foreground-muted">Nível {nivelDe(m.xp).numero} · {nivelDe(m.xp).nome}</p>
                  </div>
                  {m.papel === 'criador' && (
                    <span title="Criador da missão" className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <FaCrown aria-hidden="true" /> Criador
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl animate-fadeIn ${
            toast.type === 'error' ? 'bg-ring-fire text-white' : 'bg-accent-text text-white dark:text-slate-950'
          }`}
        >
          {toast.type === 'error' ? <FaTriangleExclamation aria-hidden="true" /> : <FaCircleCheck aria-hidden="true" />}
          <span className="flex-1 text-sm font-semibold">{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Fechar aviso" className="cursor-pointer rounded-md p-1 hover:bg-white/15">
            <FaXmark aria-hidden="true" />
          </button>
        </div>
      )}
    </main>
  );
}
