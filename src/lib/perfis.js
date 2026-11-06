// Regras de perfil compartilhadas pelas telas e pelos serviços de dados.
import { sequenciaAtual } from './datas';

// Perfil inicial de quem acabou de criar a conta (sem e-mail: o perfil é público).
export function perfilNovo(usuario, nomeInformado = '') {
  const doEmail = (usuario.email || '').split('@')[0];
  const nome = (nomeInformado || usuario.nome || doEmail || 'Protetor').trim().slice(0, 60);
  return {
    nome,
    nomeProvisorio: !(nomeInformado || usuario.nome),
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

// Dados que aparecem para outras pessoas (ranking, membros).
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
