import { NextResponse } from 'next/server';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { COLECAO_USUARIOS, perfilPublico } from '../../../lib/servidor/perfis';

// GET - Os 20 protetores com mais XP (sem dados privados como o e-mail).
export async function GET() {
  try {
    const consulta = query(collection(db, COLECAO_USUARIOS), orderBy('xp', 'desc'), limit(20));
    const snap = await getDocs(consulta);
    const ranking = snap.docs.map((d, i) => ({ posicao: i + 1, ...perfilPublico(d.id, d.data()) }));
    return NextResponse.json(ranking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao carregar o ranking.', error: error.message },
      { status: 500 }
    );
  }
}
