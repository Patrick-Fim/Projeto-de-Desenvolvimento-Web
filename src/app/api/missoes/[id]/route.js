import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { refUsuario, perfilPublico } from '../../../../lib/servidor/perfis';
import { missaoPublica } from '../../../../lib/servidor/missoes';

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
