'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';
import { checkin } from '../lib/servicos';

const AuthContext = createContext(null);

// Guarda quem está logado e o perfil de gamificação, para todas as telas.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  // Nome digitado no cadastro, usado quando o perfil é criado no primeiro acesso.
  const nomePendente = useRef('');

  // Registra o acesso do dia (foguinho) e traz o perfil atualizado.
  const sincronizarPerfil = useCallback(async () => {
    const dados = await checkin(nomePendente.current);
    nomePendente.current = '';
    setPerfil(dados);
    return dados;
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (novoUsuario) => {
      setUsuario(novoUsuario);
      if (novoUsuario) {
        try {
          await sincronizarPerfil();
        } catch {
          setPerfil(null);
        }
      } else {
        setPerfil(null);
      }
      setCarregando(false);
    });
  }, [sincronizarPerfil]);

  const definirNomePendente = useCallback((nome) => {
    nomePendente.current = nome;
  }, []);

  const sair = useCallback(() => signOut(auth), []);

  return (
    <AuthContext.Provider
      value={{ usuario, perfil, setPerfil, carregando, sincronizarPerfil, definirNomePendente, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return contexto;
}
