import { NextResponse } from 'next/server';
import { getDoc, updateDoc } from 'firebase/firestore';
import { usuarioDaRequisicao, naoAutorizado } from '../../../lib/servidor/autenticacao';
import { refUsuario, perfilProprio, ANEIS_VALIDOS } from '../../../lib/servidor/perfis';
import { imagemPertenceA, apagarImagemDoDono } from '../../../lib/servidor/imagens';

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

// PATCH - Edita nome, cidade, bio, anel favorito, foto de perfil e banner do usuário logado.
export async function PATCH(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const corpo = await request.json();
    const { nome, cidade = '', bio = '', anel } = corpo;
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
    const atual = (await getDoc(ref)).data() || {};
    const campos = {
      nome: nomeLimpo,
      nomeProvisorio: false,
      cidade: String(cidade).trim(),
      bio: String(bio).trim(),
      anel,
    };

    // Foto e banner: só aceita imagens enviadas pelo próprio usuário (undefined = não mexe).
    for (const campo of ['avatarId', 'bannerId']) {
      if (corpo[campo] === undefined) continue;
      const novo = corpo[campo] || null;
      if (novo !== atual[campo] && !(await imagemPertenceA(novo, usuario.uid))) {
        return NextResponse.json({ message: 'Imagem inválida.' }, { status: 400 });
      }
      campos[campo] = novo;
    }

    await updateDoc(ref, campos);

    // Apaga as imagens que foram trocadas ou removidas.
    for (const campo of ['avatarId', 'bannerId']) {
      if (campo in campos && atual[campo] && atual[campo] !== campos[campo]) {
        await apagarImagemDoDono(atual[campo], usuario.uid);
      }
    }

    const snap = await getDoc(ref);
    return NextResponse.json(perfilProprio(usuario.uid, snap.data()), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao salvar o perfil.', error: error.message },
      { status: 500 }
    );
  }
}
