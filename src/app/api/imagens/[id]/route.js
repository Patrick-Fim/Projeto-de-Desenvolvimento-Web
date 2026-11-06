import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { COLECAO_IMAGENS } from '../../../../lib/servidor/imagens';

// GET - Devolve a imagem como arquivo de verdade, para usar em <img src="/api/imagens/...">.
// Cada imagem nova ganha um id novo, então o navegador pode guardar em cache para sempre.
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const snap = await getDoc(doc(db, COLECAO_IMAGENS, id));
    if (!snap.exists()) return new Response('Imagem não encontrada.', { status: 404 });

    const [, tipo, base64] = String(snap.data().dados).match(/^data:(image\/[a-z]+);base64,(.+)$/) || [];
    if (!base64) return new Response('Imagem inválida.', { status: 404 });

    return new Response(Buffer.from(base64, 'base64'), {
      status: 200,
      headers: {
        'Content-Type': tipo,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Erro ao carregar a imagem.', { status: 500 });
  }
}
