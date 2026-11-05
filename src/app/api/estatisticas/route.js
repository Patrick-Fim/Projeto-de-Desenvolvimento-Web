import { NextResponse } from 'next/server';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { COLECAO_USUARIOS } from '../../../lib/servidor/perfis';

// GET - Números reais da plataforma, exibidos na página inicial.
export async function GET() {
  try {
    const [usuarios, missoesSnap] = await Promise.all([
      getCountFromServer(collection(db, COLECAO_USUARIOS)),
      getDocs(collection(db, 'missoes')),
    ]);

    const missoes = missoesSnap.docs.map((d) => d.data());
    const concluidas = missoes.reduce((total, m) => total + (m.concluidoPor || []).length, 0);
    const cidades = new Set(
      missoes.map((m) => (m.location || '').trim().toLowerCase()).filter(Boolean)
    ).size;

    return NextResponse.json(
      {
        protetores: usuarios.data().count,
        missoes: missoes.length,
        concluidas,
        cidades,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao carregar as estatísticas.', error: error.message },
      { status: 500 }
    );
  }
}
