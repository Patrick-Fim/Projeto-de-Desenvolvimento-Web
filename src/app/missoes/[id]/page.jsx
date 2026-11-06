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
  FaPenToSquare,
  FaCalendarXmark,
} from 'react-icons/fa6';
import { useAuth } from '../../../context/AuthContext';
import { RINGS, getRing, STATUS_STYLES } from '../../../lib/rings';
import { XP, nivelDe } from '../../../lib/gamificacao';
import { ehMembro, totalProtetores, infoPrazo, validarCamposMissao } from '../../../lib/missoes';
import { urlImagem, salvarImagemSeNova } from '../../../lib/imagens';
import { hoje } from '../../../lib/datas';
import Button from '../../../components/Button';
import Avatar from '../../../components/Avatar';
import Modal from '../../../components/Modal';
import Campo, { classeCampo, a11yCampo } from '../../../components/Campo';
import SeletorImagem from '../../../components/SeletorImagem';
import SeloPrazo from '../../../components/SeloPrazo';
import ChatMissao from '../../../components/ChatMissao';

// Formulário de edição da missão (só o criador vê). Usa os mesmos campos e regras da criação.
function FormEditarMissao({ missao, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({
    title: missao.title || '',
    ring: missao.ring || 'terra',
    location: missao.location || '',
    prazo: missao.prazo || '',
    description: missao.description || '',
    capa: urlImagem(missao.capaId),
  });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [salvando, setSalvando] = useState(false);

  const alterar = (e) => {
    const { name, value } = e.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    const novos = validarCamposMissao(dados, missao.prazo || null);
    setErros(novos);
    if (Object.keys(novos).length) return;
    try {
      setSalvando(true);
      setErroApi('');
      await onSalvar(dados);
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      {erroApi && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-text/10 p-3 text-sm font-semibold text-danger-text">
          <FaTriangleExclamation aria-hidden="true" /> {erroApi}
        </p>
      )}

      <SeletorImagem
        id="editar-capa"
        rotulo="Imagem de capa"
        formato="capa"
        valor={dados.capa}
        onChange={(valor) => setDados((anterior) => ({ ...anterior, capa: valor }))}
      />

      <Campo id="editar-titulo" label="Título da Ocorrência" error={erros.title}>
        <input id="editar-titulo" name="title" value={dados.title} onChange={alterar} className={classeCampo(erros.title)} {...a11yCampo('editar-titulo', erros.title)} />
      </Campo>

      <fieldset>
        <legend className="text-sm font-bold text-foreground">Anel Elemental</legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {RINGS.map((ring) => {
            const marcado = dados.ring === ring.id;
            const Icon = ring.Icon;
            return (
              <label
                key={ring.id}
                title={ring.label}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 py-2 transition focus-within:ring-2 focus-within:ring-primary ${
                  marcado ? `${ring.border} ${ring.soft}` : 'border-border hover:border-primary/40'
                }`}
              >
                <input type="radio" name="ring" value={ring.id} checked={marcado} onChange={alterar} className="sr-only" />
                <Icon aria-hidden="true" className={`text-lg ${ring.text}`} />
                <span className="text-[11px] font-bold text-foreground">{ring.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="editar-local" label="Cidade e Estado (UF)" error={erros.location}>
          <input id="editar-local" name="location" value={dados.location} onChange={alterar} className={classeCampo(erros.location)} {...a11yCampo('editar-local', erros.location)} />
        </Campo>
        <Campo id="editar-prazo" label="Data limite" obrigatorio={false} error={erros.prazo}>
          <input id="editar-prazo" name="prazo" type="date" min={hoje()} value={dados.prazo} onChange={alterar} className={classeCampo(erros.prazo)} {...a11yCampo('editar-prazo', erros.prazo)} />
        </Campo>
      </div>

      <Campo id="editar-descricao" label="Descrição Detalhada" error={erros.description}>
        <textarea id="editar-descricao" name="description" rows="5" value={dados.description} onChange={alterar} className={`${classeCampo(erros.description)} resize-y`} {...a11yCampo('editar-descricao', erros.description)} />
      </Campo>

      <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-5 sm:flex-row">
        <Button variant="outline" size="sm" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" size="sm" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Button>
      </div>
    </form>
  );
}

export default function MissaoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario, perfil, setPerfil, chamarApi } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [editando, setEditando] = useState(false);
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
  const encerrada = infoPrazo(missao.prazo)?.encerrada;
  const fotosMembros = Object.fromEntries(membros.map((m) => [m.uid, m.avatarId]));

  // Salva a edição: envia a capa nova (se houver) e os campos pelo PUT.
  const salvarEdicao = async ({ capa, ...campos }) => {
    const capaId = await salvarImagemSeNova(chamarApi, capa, missao.capaId, 'capa');
    await chamarApi(`/api/missoes/${id}`, {
      method: 'PUT',
      body: { ...campos, prazo: campos.prazo || null, capaId },
    });
    await carregar();
    setEditando(false);
    mostrarToast('success', 'Missão atualizada!');
  };

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
  } else if (!membro && encerrada) {
    acaoPrincipal = (
      <span className="inline-flex items-center gap-2 rounded-xl bg-foreground/5 px-4 py-2.5 text-sm font-bold text-foreground-muted">
        <FaCalendarXmark aria-hidden="true" /> Prazo encerrado: não aceita novos protetores
      </span>
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
        {/* Banner da missão (capa) e faixa com a cor do anel */}
        {missao.capaId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={urlImagem(missao.capaId)} alt="" aria-hidden="true" className="h-48 w-full object-cover md:h-64" />
        )}
        <span className={`block h-2 w-full ${ring.bg}`} aria-hidden="true" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white dark:text-slate-950 ${ring.bg}`}>
                <RingIcon aria-hidden="true" /> {ring.label}
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass}`}>{missao.status}</span>
              <SeloPrazo prazo={missao.prazo} completo />
            </div>
            {ehCriador && (
              <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
                <FaPenToSquare aria-hidden="true" /> Editar missão
              </Button>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">{missao.title}</h1>
          {missao.creatorName && <p className="mt-1 text-sm text-foreground-muted">Registrada por {missao.creatorName}</p>}
          <p className="mt-4 max-w-3xl leading-relaxed text-foreground-muted">{missao.description}</p>

          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-foreground-muted">
              <span className="flex items-center gap-1.5"><FaLocationDot aria-hidden="true" className="text-primary-text" /> {missao.location}</span>
              <span className="flex items-center gap-1.5"><FaUsers aria-hidden="true" className="text-primary-text" /> {totalProtetores(missao)} {totalProtetores(missao) === 1 ? 'protetor' : 'protetores'}</span>
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
          fotosMembros={fotosMembros}
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
                  <Avatar nome={m.nome} anel={m.anel} fotoId={m.avatarId} />
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

      {ehCriador && (
        <Modal isOpen={editando} onClose={() => setEditando(false)} title="Editar missão">
          {editando && (
            <FormEditarMissao missao={missao} onSalvar={salvarEdicao} onCancelar={() => setEditando(false)} />
          )}
        </Modal>
      )}

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
