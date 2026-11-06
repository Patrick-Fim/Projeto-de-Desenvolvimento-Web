'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CONQUISTAS } from '../lib/gamificacao';
import AvisoConquista from './AvisoConquista';

const DOIS_MINUTOS = 2 * 60 * 1000;
const chave = (uid) => `conquistas-anunciadas:${uid}`;

// Conquistas já comemoradas neste navegador (para não repetir a animação).
function lerAnunciadas(uid) {
  try {
    const salvo = localStorage.getItem(chave(uid));
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
}

function salvarAnunciadas(uid, ids) {
  try {
    localStorage.setItem(chave(uid), JSON.stringify(ids));
  } catch {
    // Sem armazenamento disponível: só não lembra entre visitas.
  }
}

// Observa o perfil e mostra um aviso para cada conquista recém-desbloqueada, uma de cada vez.
export default function NotificadorConquistas() {
  const { usuario, perfil } = useAuth();
  const [fila, setFila] = useState([]);

  useEffect(() => {
    if (!usuario || !perfil || perfil.uid !== usuario.uid) return;

    const desbloqueadas = CONQUISTAS.filter((c) => c.teste(perfil)).map((c) => c.id);
    let anunciadas = lerAnunciadas(usuario.uid);

    if (!anunciadas) {
      // Primeira vez neste navegador: conta nova comemora tudo; conta antiga não recomemora o passado.
      const contaNova = Date.now() - new Date(perfil.criadoEm).getTime() < DOIS_MINUTOS;
      anunciadas = contaNova ? [] : desbloqueadas;
    }

    const novas = desbloqueadas.filter((id) => !anunciadas.includes(id));
    salvarAnunciadas(usuario.uid, [...new Set([...anunciadas, ...desbloqueadas])]);
    if (novas.length) {
      setFila((atual) => [...atual, ...CONQUISTAS.filter((c) => novas.includes(c.id))]);
    }
  }, [usuario, perfil]);

  if (!fila.length) return null;

  return (
    <AvisoConquista
      key={fila[0].id}
      conquista={fila[0]}
      onFechar={() => setFila((atual) => atual.slice(1))}
    />
  );
}
