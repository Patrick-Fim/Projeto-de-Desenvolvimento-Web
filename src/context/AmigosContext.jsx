'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  aceitarAmizade,
  carregarPerfisPublicos,
  enviarPedidoAmizade,
  idPar,
  removerAmizade,
} from '../lib/servicos';

const AmigosContext = createContext(null);

// Amizades do usuário logado (em tempo real) e o estado do balão de conversas privadas.
export function AmigosProvider({ children }) {
  const { usuario } = useAuth();
  const [amizades, setAmizades] = useState([]);
  const [perfis, setPerfis] = useState({});
  const [chatAberto, setChatAberto] = useState(false);
  const [conversaCom, setConversaCom] = useState(null);
  const [conversaTime, setConversaTime] = useState(false);

  // Escuta as amizades em que o usuário aparece.
  useEffect(() => {
    if (!usuario) {
      setAmizades([]);
      return undefined;
    }
    const consulta = query(collection(db, 'amizades'), where('usuarios', 'array-contains', usuario.uid));
    return onSnapshot(
      consulta,
      (snap) => setAmizades(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      () => setAmizades([])
    );
  }, [usuario]);

  // Carrega nome, foto e anel de cada pessoa das amizades.
  useEffect(() => {
    if (!usuario || !amizades.length) return;
    const outros = amizades.map((a) => a.usuarios.find((uid) => uid !== usuario.uid));
    carregarPerfisPublicos(outros).then(setPerfis).catch(() => {});
  }, [amizades, usuario]);

  const outroDe = useCallback((amizade) => amizade.usuarios.find((uid) => uid !== usuario?.uid), [usuario]);

  const listas = useMemo(() => {
    const aceitas = amizades.filter((a) => a.status === 'aceita');
    const pendentes = amizades.filter((a) => a.status === 'pendente');
    return {
      amigos: aceitas.map((a) => ({ par: a.id, uid: outroDe(a), perfil: perfis[outroDe(a)] })),
      recebidos: pendentes.filter((a) => a.para === usuario?.uid).map((a) => ({ par: a.id, uid: a.de, perfil: perfis[a.de] })),
      enviados: pendentes.filter((a) => a.de === usuario?.uid).map((a) => ({ par: a.id, uid: a.para, perfil: perfis[a.para] })),
    };
  }, [amizades, perfis, usuario, outroDe]);

  // Situação da amizade com outra pessoa: 'nenhuma', 'enviado', 'recebido' ou 'amigos'.
  const estadoCom = useCallback(
    (uid) => {
      const amizade = amizades.find((a) => a.id === idPar(usuario?.uid || '', uid));
      if (!amizade) return 'nenhuma';
      if (amizade.status === 'aceita') return 'amigos';
      return amizade.de === usuario?.uid ? 'enviado' : 'recebido';
    },
    [amizades, usuario]
  );

  const abrirConversa = useCallback((uid) => {
    setConversaTime(false);
    setConversaCom(uid);
    setChatAberto(true);
  }, []);

  // Abre o chat do time (anel favorito) dentro do balão de conversas.
  const abrirTime = useCallback(() => {
    setConversaCom(null);
    setConversaTime(true);
    setChatAberto(true);
  }, []);

  const valor = {
    ...listas,
    perfis,
    estadoCom,
    enviarPedido: enviarPedidoAmizade,
    aceitar: aceitarAmizade,
    remover: removerAmizade,
    parCom: (uid) => idPar(usuario?.uid || '', uid),
    chatAberto,
    setChatAberto,
    conversaCom,
    setConversaCom,
    conversaTime,
    setConversaTime,
    abrirConversa,
    abrirTime,
  };

  return <AmigosContext.Provider value={valor}>{children}</AmigosContext.Provider>;
}

export function useAmigos() {
  const contexto = useContext(AmigosContext);
  if (!contexto) throw new Error('useAmigos precisa estar dentro de <AmigosProvider>.');
  return contexto;
}
