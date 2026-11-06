// Regras de missão compartilhadas entre a API e as telas.
import { hoje } from './datas';
import { FORMATOS_IMAGEM, TAMANHO_MAX_ARQUIVO } from './imagens';

export const ANEIS_IDS = ['terra', 'fogo', 'vento', 'agua', 'coracao'];

// Membros de uma missão: quem a criou e quem entrou nela.
export function ehMembro(missao, uid) {
  if (!missao || !uid) return false;
  return missao.creatorUid === uid || (missao.participantIds || []).includes(uid);
}

// Total de protetores na missão: quem entrou nela + o criador (quando houver).
export function totalProtetores(missao) {
  if (!missao) return 0;
  return (missao.participants || 0) + (missao.creatorUid ? 1 : 0);
}

// Limites do chat da missão.
export const CHAT = {
  limiteTexto: 1000,
  limiteImagem: FORMATOS_IMAGEM.chat.limite,
  limiteArquivo: TAMANHO_MAX_ARQUIVO,
};

// ---------- Prazo (data limite, no formato AAAA-MM-DD) ----------

const FORMATO_PRAZO = /^\d{4}-\d{2}-\d{2}$/;
const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

const diasAte = (prazo) =>
  Math.round((new Date(`${prazo}T12:00:00Z`) - new Date(`${hoje()}T12:00:00Z`)) / 86400000);

// Texto e situação do prazo de uma missão (null quando não há prazo).
export function infoPrazo(prazo) {
  if (!prazo || !FORMATO_PRAZO.test(prazo)) return null;
  const dias = diasAte(prazo);
  const data = formatoData.format(new Date(`${prazo}T12:00:00Z`));
  if (dias < 0) return { encerrada: true, urgente: false, data, texto: 'Prazo encerrado' };
  if (dias === 0) return { encerrada: false, urgente: true, data, texto: 'Termina hoje' };
  return { encerrada: false, urgente: dias <= 3, data, texto: `Faltam ${dias} ${dias === 1 ? 'dia' : 'dias'}` };
}

// Mensagem de erro do prazo, ou '' se estiver válido. Um prazo já salvo pode ser mantido.
export function erroPrazo(prazo, prazoAtual = null) {
  if (!prazo) return '';
  if (!FORMATO_PRAZO.test(prazo) || Number.isNaN(new Date(`${prazo}T12:00:00Z`).getTime())) {
    return 'Informe uma data válida.';
  }
  if (prazo === prazoAtual) return '';
  const dias = diasAte(prazo);
  if (dias < 0) return 'O prazo não pode estar no passado.';
  if (dias > 730) return 'O prazo deve ser de no máximo 2 anos.';
  return '';
}

// Validação dos campos editáveis de uma missão (usada no formulário e na API).
export function validarCamposMissao({ title, description, ring, location, prazo }, prazoAtual = null) {
  const erros = {};
  if (String(title || '').trim().length < 5) erros.title = 'O título deve ter no mínimo 5 caracteres.';
  if (String(description || '').trim().length < 15) erros.description = 'A descrição deve ter pelo menos 15 caracteres.';
  if (String(location || '').trim().length < 3) erros.location = 'Informe Cidade e Estado válidos (ex: Ijuí, RS).';
  if (!ANEIS_IDS.includes(ring)) erros.ring = 'Escolha um anel elemental.';
  const prazoInvalido = erroPrazo(prazo, prazoAtual);
  if (prazoInvalido) erros.prazo = prazoInvalido;
  return erros;
}
