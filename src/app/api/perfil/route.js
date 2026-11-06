import { NextResponse } from 'next/server';
import { getDoc, updateDoc } from 'firebase/firestore';
import { usuarioDaRequisicao, naoAutorizado } from '../../../lib/servidor/autenticacao';
import { refUsuario, perfilProprio, ANEIS_VALIDOS } from '../../../lib/servidor/perfis';

// GET - Retorna o perfil do usuário logado.
export async function GET(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const snap = await getDoc(refUsuario(usuario.uid));
    if (!snap.exists()) {
      return NextResponse.json({ message: 'Perfil não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(perfilProprio(usuario.uid, snap.data()), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar o perfil.', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Edita nome, cidade, bio e anel favorito do usuário logado.
export async function PATCH(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const { nome, cidade = '', bio = '', anel } = await request.json();
    const nomeLimpo = String(nome || '').trim();

    // Validação no servidor (além da validação do formulário).
    if (nomeLimpo.length < 3 || nomeLimpo.length > 60) {
      return NextResponse.json({ message: 'O nome deve ter entre 3 e 60 caracteres.' }, { status: 400 });
    }
    if (String(cidade).length > 60) {
      return NextResponse.json({ message: 'A cidade deve ter no máximo 60 caracteres.' }, { status: 400 });
    }
    if (String(bio).length > 160) {
      return NextResponse.json({ message: 'A bio deve ter no máximo 160 caracteres.' }, { status: 400 });
    }
    if (!ANEIS_VALIDOS.includes(anel)) {
      return NextResponse.json({ message: 'Anel elemental inválido.' }, { status: 400 });
    }

    const ref = refUsuario(usuario.uid);
    await updateDoc(ref, {
      nome: nomeLimpo,
      nomeProvisorio: false,
      cidade: String(cidade).trim(),
      bio: String(bio).trim(),
      anel,
    });

    const snap = await getDoc(ref);
    return NextResponse.json(perfilProprio(usuario.uid, snap.data()), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao salvar o perfil.', error: error.message },
      { status: 500 }
    );
  }
}
