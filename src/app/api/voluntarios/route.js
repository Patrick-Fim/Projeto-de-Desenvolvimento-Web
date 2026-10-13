// API dos voluntários — coleção "voluntarios" no Firestore.
// GET  -> lista todos
// POST -> cadastra um novo
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "voluntarios"));
    const voluntarios = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(voluntarios);
  } catch (erro) {
    return NextResponse.json(
      { erro: "Falha ao listar voluntários" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();

    // Validação no servidor (além da validação do formulário).
    if (!dados?.nome || !dados?.email) {
      return NextResponse.json(
        { erro: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    const ref = await addDoc(collection(db, "voluntarios"), {
      nome: dados.nome,
      email: dados.email,
      anel: dados.anel ?? null,
      compromisso: dados.compromisso ?? null,
      criadoEm: serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (erro) {
    return NextResponse.json(
      { erro: "Falha ao cadastrar voluntário" },
      { status: 500 }
    );
  }
}
