import { NextResponse } from 'next/server';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { usuarioDaRequisicao, naoAutorizado } from '../../../lib/servidor/autenticacao';
import { COLECAO_IMAGENS } from '../../../lib/servidor/imagens';
import { FORMATOS_IMAGEM, FORMATO_DATA_URL, urlImagem } from '../../../lib/imagens';

// Formatos que podem ser enviados por esta rota (as fotos do chat ficam na própria mensagem).
const FORMATOS_PERMITIDOS = ['avatar', 'banner', 'capa'];

// POST - Envia uma imagem (foto de perfil, banner ou capa de missão) e devolve o id dela.
export async function POST(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const { dados, formato } = await request.json().catch(() => ({}));
    if (!FORMATOS_PERMITIDOS.includes(formato)) {
      return NextResponse.json({ message: 'Formato de imagem inválido.' }, { status: 400 });
    }
    const config = FORMATOS_IMAGEM[formato];
    if (typeof dados !== 'string' || dados.length > config.limite || !FORMATO_DATA_URL.test(dados)) {
      return NextResponse.json({ message: `A ${config.rotulo} é inválida ou grande demais.` }, { status: 400 });
    }

    const ref = await addDoc(collection(db, COLECAO_IMAGENS), {
      dados,
      formato,
      donoUid: usuario.uid,
      criadoEm: new Date().toISOString(),
    });

    return NextResponse.json({ id: ref.id, url: urlImagem(ref.id) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao salvar a imagem.', error: error.message },
      { status: 500 }
    );
  }
}
