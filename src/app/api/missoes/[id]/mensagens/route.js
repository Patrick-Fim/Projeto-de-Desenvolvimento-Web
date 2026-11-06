import { NextResponse } from 'next/server';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { usuarioDaRequisicao, naoAutorizado } from '../../../../../lib/servidor/autenticacao';
import { refUsuario } from '../../../../../lib/servidor/perfis';
import { ehMembro, CHAT } from '../../../../../lib/missoes';

// Imagem aceita: data URL em base64 de um formato de imagem comum.
const FORMATO_IMAGEM = /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/;

function erro(mensagem, status) {
  return NextResponse.json({ message: mensagem }, { status });
}

// POST - Envia uma mensagem (texto e/ou imagem) no chat da missão. Só para membros.
export async function POST(request, { params }) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();
  const { id } = await params;

  try {
    const corpo = await request.json().catch(() => ({}));
    const texto = typeof corpo.texto === 'string' ? corpo.texto.trim() : '';
    const imagem = typeof corpo.imagem === 'string' && corpo.imagem ? corpo.imagem : null;

    if (!texto && !imagem) return erro('Escreva uma mensagem ou envie uma imagem.', 400);
    if (texto.length > CHAT.limiteTexto) {
      return erro(`A mensagem deve ter no máximo ${CHAT.limiteTexto} caracteres.`, 400);
    }
    if (imagem && (imagem.length > CHAT.limiteImagem || !FORMATO_IMAGEM.test(imagem))) {
      return erro('Imagem inválida ou grande demais.', 400);
    }

    const [snapMissao, snapPerfil] = await Promise.all([
      getDoc(doc(db, 'missoes', id)),
      getDoc(refUsuario(usuario.uid)),
    ]);
    if (!snapMissao.exists()) return erro('Missão ambiental não encontrada.', 404);
    if (!ehMembro(snapMissao.data(), usuario.uid)) {
      return erro('Entre na missão para participar da conversa.', 403);
    }

    const perfil = snapPerfil.exists() ? snapPerfil.data() : {};
    const mensagem = {
      autorUid: usuario.uid,
      autorNome: perfil.nome || usuario.nome || 'Protetor',
      autorAnel: perfil.anel || 'terra',
      texto,
      imagem,
      apagada: false,
      criadoEm: new Date().toISOString(),
    };

    const ref = await addDoc(collection(db, 'missoes', id, 'mensagens'), mensagem);
    return NextResponse.json({ id: ref.id, ...mensagem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao enviar a mensagem.', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Apaga a própria mensagem (?mensagem=...). Ela continua na conversa como "apagada".
export async function DELETE(request, { params }) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();
  const { id } = await params;

  try {
    const idMensagem = new URL(request.url).searchParams.get('mensagem');
    if (!idMensagem) return erro('O ID da mensagem é obrigatório.', 400);

    const ref = doc(db, 'missoes', id, 'mensagens', idMensagem);
    const snap = await getDoc(ref);
    if (!snap.exists()) return erro('Mensagem não encontrada.', 404);
    if (snap.data().autorUid !== usuario.uid) return erro('Você só pode apagar suas próprias mensagens.', 403);

    await updateDoc(ref, { apagada: true, texto: '', imagem: null });
    return NextResponse.json({ message: 'Mensagem apagada.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao apagar a mensagem.', error: error.message },
      { status: 500 }
    );
  }
}
