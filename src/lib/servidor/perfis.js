import { doc } from 'firebase/firestore';
import { db } from '../firebase';
import { sequenciaAtual } from '../datas';

export const COLECAO_USUARIOS = 'usuarios';
export const ANEIS_VALIDOS = ['terra', 'fogo', 'vento', 'agua', 'coracao'];

export const refUsuario = (uid) => doc(db, COLECAO_USUARIOS, uid);

// Perfil inicial de quem acabou de criar a conta.
export function perfilNovo(usuario, nomeInformado = '') {
  const nome = (nomeInformado || usuario.nome || usuario.email.split('@')[0] || 'Protetor').trim().slice(0, 60);
  return {
    nome,
    nomeProvisorio: !(nomeInformado || usuario.nome),
    email: usuario.email,
    bio: '',
    cidade: '',
    anel: 'terra',
    avatarId: null,
    bannerId: null,
    xp: 0,
    missoesCriadas: 0,
    engajadas: [],
    concluidas: [],
    aneisConcluidos: [],
    sequencia: 0,
    melhorSequencia: 0,
    ultimoAcesso: null,
    criadoEm: new Date().toISOString(),
  };
}

// Perfil completo do próprio usuário.
export function perfilProprio(uid, dados) {
  return { uid, ...dados, sequenciaAtual: sequenciaAtual(dados) };
}

// Dados que podem aparecer para outras pessoas (sem e-mail).
export function perfilPublico(uid, dados) {
  return {
    uid,
    nome: dados.nome,
    anel: dados.anel,
    avatarId: dados.avatarId || null,
    bannerId: dados.bannerId || null,
    cidade: dados.cidade,
    xp: dados.xp || 0,
    sequenciaAtual: sequenciaAtual(dados),
    concluidas: (dados.concluidas || []).length,
    missoesCriadas: dados.missoesCriadas || 0,
    criadoEm: dados.criadoEm,
  };
}
