'use client';

import { useEffect, useRef, useState } from 'react';
import { collection, limitToLast, onSnapshot, orderBy, query } from 'firebase/firestore';
import {
  FaImage,
  FaPaperPlane,
  FaXmark,
  FaTrash,
  FaLock,
  FaComments,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { db } from '../lib/firebase';
import { hoje, diaAnterior } from '../lib/datas';
import { CHAT } from '../lib/missoes';
import { comprimirImagem } from '../lib/imagens';
import BolhaMensagem from './BolhaMensagem';

const FUSO = 'America/Sao_Paulo';
const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', timeZone: FUSO });
const chaveDia = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: FUSO });

const CINCO_MINUTOS = 5 * 60 * 1000;

function diaDe(iso) {
  return chaveDia.format(new Date(iso));
}

// "Hoje", "Ontem" ou a data por extenso, para separar a conversa por dia.
function rotuloDia(iso) {
  const dia = diaDe(iso);
  const atual = hoje();
  if (dia === atual) return 'Hoje';
  if (dia === diaAnterior(atual)) return 'Ontem';
  return formatoData.format(new Date(iso));
}

// Conversa em tempo real da missão. Só membros (criador e participantes) leem e escrevem.
// fotosMembros: { uid: avatarId } para mostrar a foto de perfil atual de cada autor.
export default function ChatMissao({
  missaoId,
  podeParticipar,
  usuarioUid,
  chamarApi,
  totalMembros,
  acaoBloqueado,
  fotosMembros = {},
}) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConversa, setErroConversa] = useState('');

  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(null);
  const [processandoImagem, setProcessandoImagem] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [arrastando, setArrastando] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(null);
  const [confirmandoApagar, setConfirmandoApagar] = useState(null);

  const listaRef = useRef(null);
  const textoRef = useRef(null);
  const arquivoRef = useRef(null);
  const pertoDoFim = useRef(true);

  // Escuta as mensagens em tempo real (últimas 80) direto do Firestore.
  useEffect(() => {
    if (!podeParticipar) return undefined;
    const consulta = query(
      collection(db, 'missoes', missaoId, 'mensagens'),
      orderBy('criadoEm'),
      limitToLast(80)
    );
    return onSnapshot(
      consulta,
      (snap) => {
        setMensagens(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setErroConversa('');
        setCarregando(false);
      },
      () => {
        setErroConversa('Não foi possível carregar a conversa. Verifique as regras do Firestore.');
        setCarregando(false);
      }
    );
  }, [missaoId, podeParticipar]);

  const rolarParaOFim = () => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  };

  // Acompanha a conversa: desce ao chegar mensagem nova se a pessoa já estava no fim.
  useEffect(() => {
    const ultima = mensagens[mensagens.length - 1];
    if (pertoDoFim.current || ultima?.autorUid === usuarioUid) rolarParaOFim();
  }, [mensagens, usuarioUid]);

  // Fecha a imagem ampliada com a tecla Esc.
  useEffect(() => {
    if (!imagemAberta) return undefined;
    const aoTeclar = (e) => e.key === 'Escape' && setImagemAberta(null);
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [imagemAberta]);

  const aoRolar = () => {
    const lista = listaRef.current;
    pertoDoFim.current = lista.scrollHeight - lista.scrollTop - lista.clientHeight < 120;
  };

  const ajustarAltura = (campo) => {
    campo.style.height = 'auto';
    campo.style.height = `${Math.min(campo.scrollHeight, 128)}px`;
  };

  const anexarArquivo = async (arquivo) => {
    if (!arquivo) return;
    setErroEnvio('');
    if (!arquivo.type.startsWith('image/')) {
      setErroEnvio('Envie apenas arquivos de imagem.');
      return;
    }
    if (arquivo.size > CHAT.limiteArquivo) {
      setErroEnvio('A imagem deve ter no máximo 15 MB.');
      return;
    }
    try {
      setProcessandoImagem(true);
      setImagem(await comprimirImagem(arquivo, 'chat'));
      textoRef.current?.focus();
    } catch (err) {
      setErroEnvio(err.message || 'Não foi possível ler esta imagem.');
    } finally {
      setProcessandoImagem(false);
    }
  };

  const enviar = async (e) => {
    e?.preventDefault();
    const conteudo = texto.trim();
    if ((!conteudo && !imagem) || enviando) return;

    try {
      setEnviando(true);
      setErroEnvio('');
      await chamarApi(`/api/missoes/${missaoId}/mensagens`, {
        method: 'POST',
        body: { texto: conteudo, imagem },
      });
      setTexto('');
      setImagem(null);
      pertoDoFim.current = true;
      if (textoRef.current) {
        textoRef.current.style.height = 'auto';
        textoRef.current.focus();
      }
    } catch (err) {
      setErroEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const apagar = async (idMensagem) => {
    try {
      await chamarApi(`/api/missoes/${missaoId}/mensagens?mensagem=${idMensagem}`, { method: 'DELETE' });
    } catch (err) {
      setErroEnvio(err.message);
    } finally {
      setConfirmandoApagar(null);
    }
  };

  const aoColar = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (item) {
      e.preventDefault();
      anexarArquivo(item.getAsFile());
    }
  };

  const aoSoltar = (e) => {
    e.preventDefault();
    setArrastando(false);
    anexarArquivo(e.dataTransfer.files?.[0]);
  };

  // Quem ainda não é membro vê a conversa bloqueada, com a ação para entrar.
  if (!podeParticipar) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary-text">
          <FaLock aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-foreground">Conversa exclusiva dos participantes</h2>
        <p className="mt-2 max-w-sm text-sm text-foreground-muted">
          Entre na missão para ver as mensagens, combinar a ação e trocar fotos com os outros protetores.
        </p>
        {acaoBloqueado && <div className="mt-6">{acaoBloqueado}</div>}
      </section>
    );
  }

  return (
    <section
      aria-label="Conversa da missão"
      className="relative flex h-[70vh] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setArrastando(false);
      }}
      onDrop={aoSoltar}
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-text">
          <FaComments aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-bold text-foreground">Conversa da missão</h2>
          <p className="text-xs text-foreground-muted">
            {totalMembros} {totalMembros === 1 ? 'protetor' : 'protetores'} na missão
          </p>
        </div>
      </div>

      {/* Mensagens */}
      <div
        ref={listaRef}
        onScroll={aoRolar}
        role="log"
        aria-live="polite"
        aria-label="Mensagens"
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {carregando && (
          <div className="space-y-3" aria-busy="true">
            <span className="sr-only">Carregando mensagens...</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-12 w-2/3 animate-pulse rounded-2xl bg-foreground/10 ${i === 1 ? 'ml-auto' : ''}`} />
            ))}
          </div>
        )}

        {erroConversa && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-text/10 p-4 text-sm font-semibold text-danger-text">
            <FaTriangleExclamation aria-hidden="true" /> {erroConversa}
          </p>
        )}

        {!carregando && !erroConversa && mensagens.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FaComments aria-hidden="true" className="text-4xl text-primary/40" />
            <p className="mt-3 font-bold text-foreground">Nenhuma mensagem ainda</p>
            <p className="mt-1 text-sm text-foreground-muted">Dê o primeiro passo e combine a ação com o grupo!</p>
          </div>
        )}

        <ul>
          {mensagens.map((m, i) => {
            const minha = m.autorUid === usuarioUid;
            const anterior = mensagens[i - 1];
            const novoDia = !anterior || diaDe(anterior.criadoEm) !== diaDe(m.criadoEm);
            const agrupada =
              !novoDia &&
              anterior.autorUid === m.autorUid &&
              new Date(m.criadoEm) - new Date(anterior.criadoEm) < CINCO_MINUTOS;

            return (
              <li key={m.id}>
                {novoDia && (
                  <div className="my-4 flex items-center gap-3 text-xs font-semibold text-foreground-muted">
                    <span className="h-px flex-1 bg-border" />
                    {rotuloDia(m.criadoEm)}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                )}

                <BolhaMensagem
                  mensagem={m}
                  fotoId={fotosMembros[m.autorUid]}
                  minha={minha}
                  agrupada={agrupada}
                  onAbrirImagem={setImagemAberta}
                  onImagemCarregada={() => pertoDoFim.current && rolarParaOFim()}
                  acoes={
                    minha && !m.apagada ? (
                      confirmandoApagar === m.id ? (
                        <span className="flex shrink-0 flex-col gap-1 text-xs">
                          <button type="button" onClick={() => apagar(m.id)} className="cursor-pointer font-bold text-danger-text hover:underline">
                            Apagar
                          </button>
                          <button type="button" onClick={() => setConfirmandoApagar(null)} className="cursor-pointer text-foreground-muted hover:underline">
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmandoApagar(m.id)}
                          aria-label="Apagar mensagem"
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-muted transition hover:bg-danger-text/10 hover:text-danger-text focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <FaTrash aria-hidden="true" className="text-xs" />
                        </button>
                      )
                    ) : null
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Escrever mensagem */}
      <form onSubmit={enviar} className="border-t border-border bg-card p-3">
        {erroEnvio && (
          <p role="alert" className="mb-2 flex items-center gap-2 text-xs font-semibold text-danger-text">
            <FaTriangleExclamation aria-hidden="true" /> {erroEnvio}
          </p>
        )}

        {(imagem || processandoImagem) && (
          <div className="mb-3 flex items-center gap-3">
            {imagem ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagem} alt="Pré-visualização da imagem a enviar" className="h-20 w-20 rounded-xl border border-border object-cover" />
                <button
                  type="button"
                  onClick={() => setImagem(null)}
                  aria-label="Remover imagem"
                  className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground text-xs text-background shadow"
                >
                  <FaXmark aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="h-20 w-20 animate-pulse rounded-xl bg-foreground/10" />
            )}
            <p className="text-xs text-foreground-muted">
              {imagem ? 'Imagem pronta. Escreva uma legenda se quiser e envie.' : 'Preparando a imagem...'}
            </p>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={arquivoRef}
            type="file"
            accept="image/*"
            tabIndex={-1}
            className="sr-only"
            aria-hidden="true"
            onChange={(e) => {
              anexarArquivo(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => arquivoRef.current?.click()}
            disabled={processandoImagem || enviando}
            aria-label="Anexar imagem"
            title="Anexar imagem"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border text-foreground-muted transition hover:bg-primary/10 hover:text-primary-text disabled:opacity-50"
          >
            <FaImage aria-hidden="true" />
          </button>

          <label htmlFor={`mensagem-${missaoId}`} className="sr-only">Mensagem</label>
          <textarea
            id={`mensagem-${missaoId}`}
            ref={textoRef}
            rows={1}
            value={texto}
            maxLength={CHAT.limiteTexto}
            placeholder="Escreva uma mensagem..."
            onChange={(e) => {
              setTexto(e.target.value);
              ajustarAltura(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) enviar(e);
            }}
            onPaste={aoColar}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            type="submit"
            disabled={enviando || processandoImagem || (!texto.trim() && !imagem)}
            aria-label="Enviar mensagem"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary-dark text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-950"
          >
            <FaPaperPlane aria-hidden="true" />
          </button>
        </div>

        <p className="mt-1.5 flex justify-between gap-3 text-[11px] text-foreground-muted">
          <span className="hidden sm:inline">Enter envia · Shift+Enter quebra linha · cole ou arraste imagens</span>
          <span className="ml-auto">{texto.length}/{CHAT.limiteTexto}</span>
        </p>
      </form>

      {/* Aviso ao arrastar uma imagem sobre o chat */}
      {arrastando && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center border-4 border-dashed border-primary bg-card/90 text-lg font-bold text-primary-text">
          <FaImage aria-hidden="true" className="mr-2" /> Solte a imagem para anexar
        </div>
      )}

      {/* Imagem ampliada */}
      {imagemAberta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
          onClick={() => setImagemAberta(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 p-4 animate-fadeIn"
        >
          <button
            type="button"
            onClick={() => setImagemAberta(null)}
            aria-label="Fechar imagem"
            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <FaXmark aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagemAberta} alt="Imagem ampliada da conversa" className="max-h-full max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </section>
  );
}
