// Regras de missão compartilhadas entre a API e as telas.

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
  // Imagem comprimida em base64 guardada no Firestore (documento tem limite de 1 MB).
  limiteImagem: 900000,
  limiteArquivo: 15 * 1024 * 1024,
};
