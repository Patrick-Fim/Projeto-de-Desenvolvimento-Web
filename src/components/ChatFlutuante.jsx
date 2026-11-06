'use client';

import Link from 'next/link';
import { FaComments, FaXmark, FaArrowLeft, FaUserPlus } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useAmigos } from '../context/AmigosContext';
import Avatar from './Avatar';
import Conversa from './Conversa';

// Balão no canto inferior direito com as conversas privadas entre amigos.
export default function ChatFlutuante() {
  const { usuario } = useAuth();
  const { amigos, recebidos, chatAberto, setChatAberto, conversaCom, setConversaCom, parCom } = useAmigos();

  if (!usuario) return null;

  const amigoAtual = amigos.find((a) => a.uid === conversaCom);
  const pedidos = recebidos.length;

  return (
    <>
      {/* Painel de conversas */}
      {chatAberto && (
        <section
          aria-label="Conversas privadas"
          className="fixed bottom-24 right-4 z-[70] flex h-[min(34rem,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scaleUp sm:right-6"
        >
          <header className="flex items-center gap-2 border-b border-border px-3 py-3">
            {amigoAtual ? (
              <>
                <button
                  type="button"
                  onClick={() => setConversaCom(null)}
                  aria-label="Voltar para a lista de amigos"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-muted hover:bg-foreground/5"
                >
                  <FaArrowLeft aria-hidden="true" />
                </button>
                <Avatar nome={amigoAtual.perfil?.nome} anel={amigoAtual.perfil?.anel} fotoId={amigoAtual.perfil?.avatarId} tamanho="sm" />
                <p className="min-w-0 flex-1 truncate font-bold text-foreground">{amigoAtual.perfil?.nome || 'Amigo'}</p>
              </>
            ) : (
              <p className="flex-1 px-2 font-bold text-foreground">Conversas</p>
            )}
            <button
              type="button"
              onClick={() => setChatAberto(false)}
              aria-label="Fechar conversas"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-muted hover:bg-foreground/5"
            >
              <FaXmark aria-hidden="true" />
            </button>
          </header>

          {amigoAtual ? (
            <div className="min-h-0 flex-1">
              <Conversa
                key={amigoAtual.uid}
                caminho={['conversas', parCom(amigoAtual.uid), 'mensagens']}
                titulo={`Conversa com ${amigoAtual.perfil?.nome || 'amigo'}`}
                subtitulo="Só vocês dois veem estas mensagens"
                usuarioUid={usuario.uid}
                fotosMembros={{ [amigoAtual.uid]: amigoAtual.perfil?.avatarId }}
                compacto
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              {pedidos > 0 && (
                <Link
                  href="/amigos"
                  onClick={() => setChatAberto(false)}
                  className="mb-2 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-bold text-primary-text hover:bg-primary/15"
                >
                  <FaUserPlus aria-hidden="true" />
                  {pedidos} {pedidos === 1 ? 'pedido de amizade' : 'pedidos de amizade'}
                </Link>
              )}

              {amigos.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <FaComments aria-hidden="true" className="text-3xl text-primary/40" />
                  <p className="mt-3 font-bold text-foreground">Nenhum amigo ainda</p>
                  <p className="mt-1 text-sm text-foreground-muted">Adicione protetores para conversar em particular.</p>
                  <Link
                    href="/amigos"
                    onClick={() => setChatAberto(false)}
                    className="mt-4 rounded-lg bg-primary-dark px-4 py-2 text-sm font-bold text-white dark:text-slate-950"
                  >
                    Encontrar amigos
                  </Link>
                </div>
              ) : (
                <ul>
                  {amigos.map((amigo) => (
                    <li key={amigo.uid}>
                      <button
                        type="button"
                        onClick={() => setConversaCom(amigo.uid)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-foreground/5"
                      >
                        <Avatar nome={amigo.perfil?.nome} anel={amigo.perfil?.anel} fotoId={amigo.perfil?.avatarId} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-foreground">{amigo.perfil?.nome || 'Carregando...'}</span>
                          <span className="block truncate text-xs text-foreground-muted">{amigo.perfil?.cidade || 'Protetor da Terra'}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* Balão */}
      <button
        type="button"
        onClick={() => setChatAberto(!chatAberto)}
        aria-label={chatAberto ? 'Fechar conversas' : 'Abrir conversas com amigos'}
        aria-expanded={chatAberto}
        className="fixed bottom-6 right-4 z-[70] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary-dark text-xl text-white shadow-xl shadow-primary/30 transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:right-6 dark:text-slate-950"
      >
        {chatAberto ? <FaXmark aria-hidden="true" /> : <FaComments aria-hidden="true" />}
        {!chatAberto && pedidos > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ring-fire px-1 text-[11px] font-black text-white">
            {pedidos}
          </span>
        )}
      </button>
    </>
  );
}
