'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaPenToSquare,
  FaRightFromBracket,
  FaLocationDot,
  FaCalendarDays,
  FaFlagCheckered,
  FaBullhorn,
  FaHandshake,
  FaStar,
  FaLock,
  FaFire,
  FaTrophy,
  FaCircleCheck,
  FaTriangleExclamation,
  FaXmark,
} from 'react-icons/fa6';
import { useAuth } from '../../context/AuthContext';
import { RINGS, getRing } from '../../lib/rings';
import { CONQUISTAS, XP, nivelDe } from '../../lib/gamificacao';
import { diasDesde } from '../../lib/datas';
import { totalProtetores } from '../../lib/missoes';
import Avatar from '../../components/Avatar';
import Foguinho from '../../components/Foguinho';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Campo, { classeCampo, a11yCampo } from '../../components/Campo';
import SeletorImagem from '../../components/SeletorImagem';
import { urlImagem, salvarImagemSeNova } from '../../lib/imagens';

function CartaoNumero({ Icon, rotulo, valor, detalhe, cor = 'text-primary-text bg-primary/10' }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${cor}`}>
        <Icon aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-3xl font-black text-foreground">{valor}</p>
      <p className="text-sm font-semibold text-foreground-muted">{rotulo}</p>
      {detalhe && <p className="mt-1 text-xs text-foreground-muted">{detalhe}</p>}
    </div>
  );
}

// Formulário de edição do perfil, aberto dentro do Modal.
function FormEditarPerfil({ perfil, onSalvar, onCancelar }) {
  const [dados, setDados] = useState({
    nome: perfil.nome || '',
    cidade: perfil.cidade || '',
    bio: perfil.bio || '',
    anel: perfil.anel || 'terra',
    // Imagens: URL atual, data URL nova ou null (sem imagem).
    avatar: urlImagem(perfil.avatarId),
    banner: urlImagem(perfil.bannerId),
  });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novos = {};
    if (dados.nome.trim().length < 3) novos.nome = 'O nome deve ter no mínimo 3 caracteres.';
    if (dados.cidade.length > 60) novos.cidade = 'Use no máximo 60 caracteres.';
    if (dados.bio.length > 160) novos.bio = 'Use no máximo 160 caracteres.';
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {erroApi && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-text/10 p-3 text-sm font-semibold text-danger-text">
          <FaTriangleExclamation aria-hidden="true" /> {erroApi}
        </p>
      )}

      <SeletorImagem
        id="perfil-banner"
        rotulo="Banner do perfil"
        formato="banner"
        valor={dados.banner}
        onChange={(valor) => setDados((anterior) => ({ ...anterior, banner: valor }))}
        dica="Imagem larga que aparece no topo do seu perfil."
      />

      <SeletorImagem
        id="perfil-avatar"
        rotulo="Foto de perfil"
        formato="avatar"
        valor={dados.avatar}
        onChange={(valor) => setDados((anterior) => ({ ...anterior, avatar: valor }))}
        dica="Sem foto, aparecem suas iniciais na cor do anel favorito."
      />

      <Campo id="perfil-nome" label="Nome" error={erros.nome}>
        <input id="perfil-nome" name="nome" value={dados.nome} onChange={handleChange} className={classeCampo(erros.nome)} {...a11yCampo('perfil-nome', erros.nome)} />
      </Campo>

      <Campo id="perfil-cidade" label="Cidade" obrigatorio={false} error={erros.cidade}>
        <input id="perfil-cidade" name="cidade" value={dados.cidade} onChange={handleChange} placeholder="Ex: Ijuí, RS" className={classeCampo(erros.cidade)} {...a11yCampo('perfil-cidade', erros.cidade)} />
      </Campo>

      <Campo
        id="perfil-bio"
        label="Bio"
        obrigatorio={false}
        error={erros.bio}
        dica={`${dados.bio.length}/160 caracteres`}
      >
        <textarea id="perfil-bio" name="bio" rows="3" value={dados.bio} onChange={handleChange} placeholder="Conte o que te move na causa ambiental..." className={`${classeCampo(erros.bio)} resize-none`} {...a11yCampo('perfil-bio', erros.bio)} />
      </Campo>

      <fieldset>
        <legend className="text-sm font-bold text-foreground">Anel favorito (cor do seu avatar)</legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {RINGS.map((ring) => {
            const marcado = dados.anel === ring.id;
            const Icon = ring.Icon;
            return (
              <label
                key={ring.id}
                title={ring.label}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 py-2 transition focus-within:ring-2 focus-within:ring-primary ${
                  marcado ? `${ring.border} ${ring.soft}` : 'border-border hover:border-primary/40'
                }`}
              >
                <input type="radio" name="anel" value={ring.id} checked={marcado} onChange={handleChange} className="sr-only" />
                <Icon aria-hidden="true" className={`text-lg ${ring.text}`} />
                <span className="text-[11px] font-bold text-foreground">{ring.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-5 sm:flex-row">
        <Button variant="outline" size="sm" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" size="sm" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar perfil'}</Button>
      </div>
    </form>
  );
}

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, perfil, setPerfil, carregando, chamarApi, sair } = useAuth();
  const [missoes, setMissoes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [concluindo, setConcluindo] = useState('');
  const [toast, setToast] = useState(null);

  // Página exclusiva para quem está logado.
  useEffect(() => {
    if (!carregando && !usuario) router.replace('/login?voltar=/perfil');
  }, [carregando, usuario, router]);

  useEffect(() => {
    fetch('/api/missoes')
      .then((res) => (res.ok ? res.json() : []))
      .then(setMissoes)
      .catch(() => setMissoes([]));
  }, []);

  const mostrarToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  if (carregando || !usuario || !perfil) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16" aria-busy="true">
        <div className="h-48 animate-pulse rounded-3xl bg-foreground/10" />
        <span className="sr-only">Carregando perfil...</span>
      </main>
    );
  }

  const nivel = nivelDe(perfil.xp);
  const dias = diasDesde(perfil.criadoEm);
  const ringFavorito = getRing(perfil.anel);
  const concluidas = perfil.concluidas || [];
  const engajadas = perfil.engajadas || [];
  const conquistas = CONQUISTAS.map((c) => ({ ...c, desbloqueada: c.teste(perfil) }));
  const totalDesbloqueadas = conquistas.filter((c) => c.desbloqueada).length;

  const emAndamento = missoes.filter((m) => engajadas.includes(m.id) && !concluidas.includes(m.id));
  const minhasDenuncias = missoes.filter((m) => m.creatorUid === usuario.uid);

  const salvarPerfil = async ({ avatar, banner, ...dados }) => {
    // Envia primeiro as imagens novas; as que não mudaram mantêm o id atual.
    const [avatarId, bannerId] = await Promise.all([
      salvarImagemSeNova(chamarApi, avatar, perfil.avatarId, 'avatar'),
      salvarImagemSeNova(chamarApi, banner, perfil.bannerId, 'banner'),
    ]);
    const atualizado = await chamarApi('/api/perfil', {
      method: 'PATCH',
      body: { ...dados, avatarId, bannerId },
    });
    setPerfil(atualizado);
    setEditando(false);
    mostrarToast('success', 'Perfil atualizado!');
  };

  const concluirMissao = async (missao) => {
    try {
      setConcluindo(missao.id);
      const nivelAntes = nivelDe(perfil.xp).numero;
      const resposta = await chamarApi(`/api/missoes?id=${missao.id}`, { method: 'PATCH', body: { acao: 'concluir' } });
      setPerfil(resposta.perfil);
      setMissoes((lista) => lista.map((m) => (m.id === missao.id ? resposta.missao : m)));
      const novoNivel = nivelDe(resposta.perfil.xp);
      mostrarToast(
        'success',
        novoNivel.numero > nivelAntes
          ? `Missão concluída! +${resposta.xpGanho} XP. Você subiu para o nível ${novoNivel.nome}!`
          : `Missão concluída! +${resposta.xpGanho} XP`
      );
    } catch (err) {
      mostrarToast('error', err.message);
    } finally {
      setConcluindo('');
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      {/* Cartão principal: identidade, nível e XP */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        {/* Banner: a imagem escolhida ou, sem banner, a cor do anel favorito */}
        {perfil.bannerId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={urlImagem(perfil.bannerId)}
            alt=""
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-36 w-full object-cover md:h-44"
          />
        ) : (
          <div aria-hidden="true" className={`absolute inset-x-0 top-0 -z-10 h-28 opacity-90 ${ringFavorito.bg}`} />
        )}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 -z-10 bg-linear-to-b from-transparent to-card ${perfil.bannerId ? 'h-36 md:h-44' : 'h-28'}`}
        />

        <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${perfil.bannerId ? 'pt-20 md:pt-24' : 'pt-10'}`}>
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:text-left">
            <Avatar nome={perfil.nome} anel={perfil.anel} fotoId={perfil.avatarId} tamanho="lg" className="ring-4 ring-card" />
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">{perfil.nome}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-foreground-muted md:justify-start">
                {perfil.cidade && (
                  <span className="flex items-center gap-1.5"><FaLocationDot aria-hidden="true" className="text-primary-text" /> {perfil.cidade}</span>
                )}
                <span className="flex items-center gap-1.5"><FaCalendarDays aria-hidden="true" className="text-primary-text" /> {dias} {dias === 1 ? 'dia' : 'dias'} na plataforma</span>
              </div>
              {perfil.bio && <p className="mt-2 max-w-xl text-sm text-foreground-muted">{perfil.bio}</p>}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
              <FaPenToSquare aria-hidden="true" /> Editar perfil
            </Button>
            <Button variant="ghost" size="sm" onClick={sair}>
              <FaRightFromBracket aria-hidden="true" /> Sair
            </Button>
          </div>
        </div>

        {/* Nível e barra de XP */}
        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#0096C7] to-[#2E7D32] font-display text-lg font-black text-white">
                {nivel.numero}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Nível {nivel.numero}</p>
                <p className="font-display text-lg font-black text-foreground">{nivel.nome}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-foreground">
              {perfil.xp} XP
              {nivel.proximo && <span className="font-semibold text-foreground-muted"> · faltam {nivel.faltam} para {nivel.proximo.nome}</span>}
            </p>
          </div>
          <div
            className="mt-4 h-3 overflow-hidden rounded-full bg-foreground/10"
            role="progressbar"
            aria-label="Progresso para o próximo nível"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(nivel.progresso * 100)}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-[#0096C7] via-[#00AB39] to-[#2E7D32] animate-encher"
              style={{ width: `${Math.max(4, nivel.progresso * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Números do protetor */}
      <section aria-label="Estatísticas" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CartaoNumero Icon={FaFlagCheckered} rotulo="Missões concluídas" valor={concluidas.length} cor="bg-accent/10 text-accent-text" />
        <CartaoNumero Icon={FaCalendarDays} rotulo="Dias na plataforma" valor={dias} />
        <CartaoNumero Icon={FaBullhorn} rotulo="Denúncias registradas" valor={perfil.missoesCriadas || 0} cor="bg-ring-wind/10 text-ring-wind" />
        <CartaoNumero Icon={FaHandshake} rotulo="Missões engajadas" valor={engajadas.length} cor="bg-ring-heart/10 text-ring-heart" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Missões em andamento */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-foreground">Missões em andamento</h2>
              <span className="text-xs font-bold text-accent-text">+{XP.concluir} XP por conclusão</span>
            </div>
            {emAndamento.length === 0 ? (
              <p className="mt-4 text-sm text-foreground-muted">
                Você não tem missões em andamento.{' '}
                <Link href="/missoes" className="font-bold text-primary-text hover:underline">Encontre uma no painel</Link>.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {emAndamento.map((missao) => {
                  const ring = getRing(missao.ring);
                  const Icon = ring.Icon;
                  return (
                    <li key={missao.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white dark:text-slate-950 ${ring.bg}`}>
                          <Icon aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground">{missao.title}</p>
                          <p className="text-xs text-foreground-muted">{missao.location}</p>
                        </div>
                      </div>
                      <Button variant="ecological" size="sm" disabled={concluindo === missao.id} onClick={() => concluirMissao(missao)}>
                        <FaCircleCheck aria-hidden="true" />
                        {concluindo === missao.id ? 'Concluindo...' : 'Marcar como concluída'}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Conquistas */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-foreground">Conquistas</h2>
              <span className="text-sm font-bold text-foreground-muted">{totalDesbloqueadas}/{conquistas.length}</span>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {conquistas.map(({ id, titulo, descricao, Icon, desbloqueada }) => (
                <li
                  key={id}
                  title={descricao}
                  className={`flex flex-col items-center rounded-2xl border p-4 text-center transition ${
                    desbloqueada ? 'border-amber-500/40 bg-amber-500/10' : 'border-border bg-background opacity-60'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${
                      desbloqueada ? 'bg-linear-to-br from-amber-300 to-amber-500 text-amber-950 shadow-md' : 'bg-foreground/10 text-foreground-muted'
                    }`}
                  >
                    {desbloqueada ? <Icon aria-hidden="true" /> : <FaLock aria-hidden="true" />}
                  </span>
                  <p className="mt-3 text-xs font-bold text-foreground">{titulo}</p>
                  <p className="mt-1 text-[11px] leading-snug text-foreground-muted">{descricao}</p>
                  <span className="sr-only">{desbloqueada ? 'Desbloqueada' : 'Bloqueada'}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Denúncias do usuário */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-foreground">Minhas denúncias</h2>
              <Link href="/denuncia" className="text-sm font-bold text-primary-text hover:underline">+ Nova denúncia</Link>
            </div>
            {minhasDenuncias.length === 0 ? (
              <p className="mt-4 text-sm text-foreground-muted">Você ainda não registrou denúncias. Cada uma vale +{XP.criarMissao} XP.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {minhasDenuncias.map((missao) => (
                  <li key={missao.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <span className="min-w-0 truncate font-semibold text-foreground">{missao.title}</span>
                    <span className="shrink-0 text-xs text-foreground-muted">
                      {totalProtetores(missao)} {totalProtetores(missao) === 1 ? 'protetor' : 'protetores'} · {(missao.concluidoPor || []).length} concluíram
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Coluna lateral: foguinho e como ganhar XP */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300">Seu foguinho</h2>
            <div className="mt-4 flex justify-center">
              <Foguinho dias={perfil.sequenciaAtual} grande />
            </div>
            <p className="mt-3 text-sm text-foreground">
              {perfil.sequenciaAtual > 0
                ? `${perfil.sequenciaAtual} ${perfil.sequenciaAtual === 1 ? 'dia seguido' : 'dias seguidos'}. Volte amanhã para manter a chama acesa!`
                : 'Acesse todos os dias para acender sua chama.'}
            </p>
            <p className="mt-2 text-xs font-semibold text-foreground-muted">
              <FaTrophy aria-hidden="true" className="mr-1 inline text-amber-500" />
              Recorde: {perfil.melhorSequencia || 0} {perfil.melhorSequencia === 1 ? 'dia' : 'dias'}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-foreground">Como ganhar XP</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { Icon: FaFire, texto: 'Acesso diário', xp: XP.checkin },
                { Icon: FaBullhorn, texto: 'Registrar denúncia', xp: XP.criarMissao },
                { Icon: FaHandshake, texto: 'Engajar em missão', xp: XP.engajar },
                { Icon: FaFlagCheckered, texto: 'Concluir missão', xp: XP.concluir },
              ].map(({ Icon, texto, xp }) => (
                <li key={texto} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-foreground-muted">
                    <Icon aria-hidden="true" className="text-primary-text" /> {texto}
                  </span>
                  <span className="font-bold text-accent-text">+{xp} XP</span>
                </li>
              ))}
            </ul>
            <Link href="/ranking" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-sm font-bold text-primary-text hover:bg-primary/15">
              <FaStar aria-hidden="true" /> Ver ranking
            </Link>
          </section>
        </aside>
      </div>

      <Modal isOpen={editando} onClose={() => setEditando(false)} title="Editar perfil">
        {editando && <FormEditarPerfil perfil={perfil} onSalvar={salvarPerfil} onCancelar={() => setEditando(false)} />}
      </Modal>

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
