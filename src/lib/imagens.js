// Imagens da ferramenta: formatos, compressão no navegador e endereço público.

// Tamanho máximo (px) de cada formato e limite do arquivo final (caracteres em base64).
export const FORMATOS_IMAGEM = {
  avatar: { largura: 400, altura: 400, limite: 200000, rotulo: 'foto de perfil' },
  banner: { largura: 1600, altura: 600, limite: 600000, rotulo: 'banner' },
  capa: { largura: 1280, altura: 720, limite: 800000, rotulo: 'capa da missão' },
  chat: { largura: 1280, altura: 1280, limite: 900000, rotulo: 'imagem' },
};

export const TAMANHO_MAX_ARQUIVO = 15 * 1024 * 1024;

// Imagem aceita: data URL em base64 de um formato de imagem comum.
export const FORMATO_DATA_URL = /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/;

// Reduz a imagem ao tamanho do formato (JPEG) para caber no Firestore sem pesar.
export async function comprimirImagem(arquivo, formato = 'chat') {
  const { largura, altura, limite } = FORMATOS_IMAGEM[formato];
  if (!arquivo?.type?.startsWith('image/')) throw new Error('Envie apenas arquivos de imagem.');
  if (arquivo.size > TAMANHO_MAX_ARQUIVO) throw new Error('A imagem deve ter no máximo 15 MB.');

  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, largura / bitmap.width, altura / bitmap.height);
  const w = Math.round(bitmap.width * escala);
  const h = Math.round(bitmap.height * escala);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // fundo branco para PNGs com transparência
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  let qualidade = 0.82;
  let resultado = canvas.toDataURL('image/jpeg', qualidade);
  while (resultado.length > limite && qualidade > 0.35) {
    qualidade -= 0.1;
    resultado = canvas.toDataURL('image/jpeg', qualidade);
  }
  if (resultado.length > limite) throw new Error('Não foi possível reduzir esta imagem. Tente outra.');
  return resultado;
}

