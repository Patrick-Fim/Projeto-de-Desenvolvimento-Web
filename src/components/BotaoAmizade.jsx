'use client';

import { useState } from 'react';
import { FaUserPlus, FaUserCheck, FaUserClock, FaComments, FaCheck } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useAmigos } from '../context/AmigosContext';
import Button from './Button';

// Botão de amizade com outro protetor: adicionar, pedido enviado, aceitar ou conversar.
export default function BotaoAmizade({ uid, nome = '', compacto = false }) {
  const { usuario } = useAuth();
  const { estadoCom, enviarPedido, aceitar, parCom, abrirConversa } = useAmigos();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  if (!usuario || !uid || uid === usuario.uid) return null;
  const estado = estadoCom(uid);

  const executar = async (acao) => {
    try {
      setSalvando(true);
      setErro('');
      await acao();
    } catch (err) {
      setErro(err.message || 'Não foi possível concluir.');
    } finally {
      setSalvando(false);
    }
  };

  const rotuloCompleto = (texto) => (compacto ? `${texto} ${nome}`.trim() : undefined);
  let botao;

  if (estado === 'amigos') {
    botao = (
      <Button variant="ghost" size="sm" ariaLabel={rotuloCompleto('Conversar com')} title="Conversar" onClick={() => abrirConversa(uid)}>
        <FaComments aria-hidden="true" />
        {!compacto && 'Conversar'}
      </Button>
    );
  } else if (estado === 'recebido') {
    botao = (
      <Button variant="ecological" size="sm" disabled={salvando} ariaLabel={rotuloCompleto('Aceitar amizade de')} title="Aceitar amizade" onClick={() => executar(() => aceitar(parCom(uid)))}>
        <FaCheck aria-hidden="true" />
        {!compacto && 'Aceitar'}
      </Button>
    );
  } else if (estado === 'enviado') {
    botao = (
      <span title="Pedido enviado" className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/5 px-3 py-2 text-xs font-bold text-foreground-muted">
        <FaUserClock aria-hidden="true" />
        {compacto ? <span className="sr-only">Pedido de amizade enviado para {nome}</span> : 'Pedido enviado'}
      </span>
    );
  } else {
    botao = (
      <Button variant="outline" size="sm" disabled={salvando} ariaLabel={rotuloCompleto('Adicionar como amigo')} title="Adicionar amigo" onClick={() => executar(() => enviarPedido(uid))}>
        <FaUserPlus aria-hidden="true" />
        {!compacto && 'Adicionar'}
      </Button>
    );
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      {botao}
      {erro && <span role="alert" className="text-[11px] font-semibold text-danger-text">{erro}</span>}
    </span>
  );
}

// Ícone usado em listas de amigos já confirmados.
export const IconeAmigo = FaUserCheck;
