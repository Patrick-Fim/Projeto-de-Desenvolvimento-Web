import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { refUsuario, perfilPublico } from '../../../../lib/servidor/perfis';
import { missaoPublica } from '../../../../lib/servidor/missoes';
import { usuarioDaRequisicao, naoAutorizado } from '../../../../lib/servidor/autenticacao';
import { imagemPertenceA, apagarImagemDoDono } from '../../../../lib/servidor/imagens';
import { validarCamposMissao } from '../../../../lib/missoes';

// GET - Uma missão e seus membros (criador e participantes), para a página da missão.
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const snap = await getDoc(doc(db, 'missoes', id));
    if (!snap.exists()) {
      return NextResponse.json({ message: 'Missão ambiental não encontrada.' }, { status: 404 });
    }

    const dados = snap.data();
    const uids = [...new Set([dados.creatorUid, ...(dados.participantIds || [])].filter(Boolean))];
    const perfis = await Promise.all(uids.map((uid) => getDoc(refUsuario(uid))));

    const membros = perfis
      .filter((p) => p.exists())
      .map((p) => ({
        ...perfilPublico(p.id, p.data()),
        papel: p.id === dados.creatorUid ? 'criador' : 'participante',
      }));

    return NextResponse.json({ missao: missaoPublica(id, dados), membros }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao carregar a missão.', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Edita título, descrição, anel, local, prazo e capa. Só o criador da missão pode.
export async function PUT(request, { params }) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();
  const { id } = await params;

  try {
    const corpo = await request.json().catch(() => ({}));
    const ref = doc(db, 'missoes', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ message: 'Missão ambiental não encontrada.' }, { status: 404 });
    }
    const atual = snap.data();
    if (atual.creatorUid !== usuario.uid) {
      return NextResponse.json({ message: 'Só quem registrou a missão pode editá-la.' }, { status: 403 });
    }

    const prazo = corpo.prazo || null;
    const erros = validarCamposMissao({ ...corpo, prazo }, atual.prazo || null);
    if (Object.keys(erros).length) {
      return NextResponse.json({ message: Object.values(erros)[0], erros }, { status: 400 });
    }

    const campos = {
      title: String(corpo.title).trim(),
      description: String(corpo.description).trim(),
      ring: corpo.ring,
      location: String(corpo.location).trim(),
      prazo,
      atualizadoEm: new Date().toISOString(),
    };

    // Capa: só aceita imagem enviada pelo próprio dono (undefined = não mexe).
    if (corpo.capaId !== undefined) {
      const novaCapa = corpo.capaId || null;
      if (novaCapa !== atual.capaId && !(await imagemPertenceA(novaCapa, usuario.uid))) {
        return NextResponse.json({ message: 'Imagem de capa inválida.' }, { status: 400 });
      }
      campos.capaId = novaCapa;
    }

    await updateDoc(ref, campos);
    if ('capaId' in campos && atual.capaId && atual.capaId !== campos.capaId) {
      await apagarImagemDoDono(atual.capaId, usuario.uid);
    }

    return NextResponse.json({ missao: missaoPublica(id, { ...atual, ...campos }) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao editar a missão.', error: error.message },
      { status: 500 }
    );
  }
}
