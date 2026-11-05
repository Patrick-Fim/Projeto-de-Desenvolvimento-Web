import {
  FaShoePrints,
  FaEye,
  FaHandshake,
  FaFlagCheckered,
  FaMedal,
  FaStar,
  FaFire,
  FaFireFlameCurved,
  FaIdCard,
  FaBullhorn,
} from 'react-icons/fa6';

// Pontos de experiência ganhos em cada ação.
export const XP = {
  checkin: 5,
  criarMissao: 20,
  engajar: 10,
  concluir: 50,
};

// Níveis do protetor, do iniciante ao lendário.
export const NIVEIS = [
  { min: 0, nome: 'Semente' },
  { min: 100, nome: 'Broto' },
  { min: 250, nome: 'Muda' },
  { min: 500, nome: 'Árvore' },
  { min: 1000, nome: 'Guardião da Floresta' },
  { min: 2000, nome: 'Capitão Planeta' },
];

export function nivelDe(xp = 0) {
  let indice = 0;
  while (indice + 1 < NIVEIS.length && xp >= NIVEIS[indice + 1].min) indice++;
  const atual = NIVEIS[indice];
  const proximo = NIVEIS[indice + 1] || null;
  return {
    numero: indice + 1,
    nome: atual.nome,
    proximo,
    progresso: proximo ? (xp - atual.min) / (proximo.min - atual.min) : 1,
    faltam: proximo ? proximo.min - xp : 0,
  };
}

// Conquistas calculadas a partir do perfil (não precisam ser salvas no banco).
export const CONQUISTAS = [
  {
    id: 'primeiro-passo',
    titulo: 'Primeiro Passo',
    descricao: 'Entrou para os Protetores da Terra.',
    Icon: FaShoePrints,
    teste: () => true,
  },
  {
    id: 'identidade',
    titulo: 'Identidade Verde',
    descricao: 'Completou o perfil com cidade e bio.',
    Icon: FaIdCard,
    teste: (p) => Boolean(p.cidade && p.bio),
  },
  {
    id: 'olhos-da-terra',
    titulo: 'Olhos da Terra',
    descricao: 'Registrou a primeira denúncia.',
    Icon: FaEye,
    teste: (p) => (p.missoesCriadas || 0) >= 1,
  },
  {
    id: 'voz-da-comunidade',
    titulo: 'Voz da Comunidade',
    descricao: 'Registrou 5 denúncias.',
    Icon: FaBullhorn,
    teste: (p) => (p.missoesCriadas || 0) >= 5,
  },
  {
    id: 'maos-a-obra',
    titulo: 'Mãos à Obra',
    descricao: 'Engajou na primeira missão.',
    Icon: FaHandshake,
    teste: (p) => (p.engajadas || []).length >= 1,
  },
  {
    id: 'missao-cumprida',
    titulo: 'Missão Cumprida',
    descricao: 'Concluiu a primeira missão.',
    Icon: FaFlagCheckered,
    teste: (p) => (p.concluidas || []).length >= 1,
  },
  {
    id: 'veterano',
    titulo: 'Protetor Veterano',
    descricao: 'Concluiu 5 missões.',
    Icon: FaMedal,
    teste: (p) => (p.concluidas || []).length >= 5,
  },
  {
    id: 'poderes-combinados',
    titulo: 'Poderes Combinados',
    descricao: 'Concluiu missões dos 5 anéis.',
    Icon: FaStar,
    teste: (p) => (p.aneisConcluidos || []).length >= 5,
  },
  {
    id: 'chama-acesa',
    titulo: 'Chama Acesa',
    descricao: 'Manteve o foguinho por 3 dias seguidos.',
    Icon: FaFire,
    teste: (p) => (p.melhorSequencia || 0) >= 3,
  },
  {
    id: 'fogo-eterno',
    titulo: 'Fogo Eterno',
    descricao: 'Manteve o foguinho por 7 dias seguidos.',
    Icon: FaFireFlameCurved,
    teste: (p) => (p.melhorSequencia || 0) >= 7,
  },
];
