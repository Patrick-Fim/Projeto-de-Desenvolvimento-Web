import { FaLeaf, FaFire, FaWind, FaDroplet, FaHeart } from 'react-icons/fa6';

// Fonte única dos 5 Anéis Elementais: rótulo, ícone, classes de cor e textos.
export const RINGS = [
  {
    id: 'terra',
    label: 'Terra',
    Icon: FaLeaf,
    bg: 'bg-ring-earth',
    text: 'text-ring-earth',
    border: 'border-ring-earth',
    soft: 'bg-ring-earth/10',
    realce: 'ring-ring-earth',
    desc: 'Preservação de matas, hortas comunitárias e reflorestamento urbano.',
    hint: 'Desmatamento, vegetação e áreas verdes.',
  },
  {
    id: 'fogo',
    label: 'Fogo',
    Icon: FaFire,
    bg: 'bg-ring-fire',
    text: 'text-ring-fire',
    border: 'border-ring-fire',
    soft: 'bg-ring-fire/10',
    realce: 'ring-ring-fire',
    desc: 'Prevenção, monitoramento e denúncia de queimadas ilegais.',
    hint: 'Queimadas e focos de incêndio.',
  },
  {
    id: 'vento',
    label: 'Vento',
    Icon: FaWind,
    bg: 'bg-ring-wind',
    text: 'text-ring-wind',
    border: 'border-ring-wind',
    soft: 'bg-ring-wind/10',
    realce: 'ring-ring-wind',
    desc: 'Monitoramento da qualidade do ar e combate a emissões poluentes.',
    hint: 'Poluição do ar e odores industriais.',
  },
  {
    id: 'agua',
    label: 'Água',
    Icon: FaDroplet,
    bg: 'bg-ring-water',
    text: 'text-ring-water',
    border: 'border-ring-water',
    soft: 'bg-ring-water/10',
    realce: 'ring-ring-water',
    desc: 'Despoluição de rios, nascentes, praias e proteção hídrica.',
    hint: 'Poluição hídrica e esgoto em rios.',
  },
  {
    id: 'coracao',
    label: 'Coração',
    Icon: FaHeart,
    bg: 'bg-ring-heart',
    text: 'text-ring-heart',
    border: 'border-ring-heart',
    soft: 'bg-ring-heart/10',
    realce: 'ring-ring-heart',
    desc: 'Mobilização comunitária, educação ambiental e redes de apoio.',
    hint: 'Mobilização comunitária e maus-tratos a animais.',
  },
];

const POR_ID = Object.fromEntries(RINGS.map((r) => [r.id, r]));

// Usa Terra como padrão quando o anel recebido não é reconhecido.
export function getRing(id) {
  return POR_ID[String(id || '').toLowerCase()] || POR_ID.terra;
}

// Cores dos selos de status das missões.
export const STATUS_STYLES = {
  Ativa: 'border-accent/30 bg-accent/10 text-accent-text',
  Urgente: 'border-danger-text/30 bg-danger-text/10 text-danger-text',
  'Análise': 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
};
