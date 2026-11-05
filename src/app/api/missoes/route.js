import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

const COLECAO = "missoes";

// Exemplos iniciais: inseridos automaticamente apenas se a coleção estiver vazia.
const SEED = [
  {
    id: "seed-1",
    title: "Reflorestamento das Margens do Rio",
    description:
      "Plantio de mudas nativas para conter a erosão e restaurar a mata ciliar da região central.",
    ring: "terra",
    location: "Porto Alegre, RS",
    status: "Ativa",
    participants: 42,
  },
  {
    id: "seed-2",
    title: "Mutirão de Limpeza da Praia",
    description:
      "Recolhimento de resíduos plásticos e conscientização de banhistas sobre o descarte correto.",
    ring: "agua",
    location: "Florianópolis, SC",
    status: "Ativa",
    participants: 128,
  },
  {
    id: "seed-3",
    title: "Combate a Focos de Incêndio Urbano",
    description:
      "Monitoramento comunitário e denúncia de queimadas irregulares em terrenos baldios.",
    ring: "fogo",
    location: "Curitiba, PR",
    status: "Urgente",
    participants: 15,
  },
];

// Popula a coleção com os exemplos na primeira vez que ela é acessada vazia.
async function semearSeVazio() {
  const snap = await getDocs(collection(db, COLECAO));
  if (!snap.empty) return;
  await Promise.all(
    SEED.map(({ id, ...dados }) =>
      setDoc(doc(db, COLECAO, id), {
        ...dados,
        createdAt: new Date().toISOString(),
      })
    )
  );
}

// GET - Listar todas as missões/denúncias (Firestore)
export async function GET() {
  try {
    await semearSeVazio();
    const snap = await getDocs(collection(db, COLECAO));
    const missoes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Mais recentes primeiro.
    missoes.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return NextResponse.json(missoes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar missões ambientais.", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar uma nova denúncia/missão (grava no Firestore)
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, ring, location, reporterName, reporterEmail } =
      body;

    if (
      !title ||
      !description ||
      !ring ||
      !location ||
      !reporterName ||
      !reporterEmail
    ) {
      return NextResponse.json(
        { message: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const novaMissao = {
      title,
      description,
      ring,
      location,
      reporterName,
      reporterEmail,
      status: "Análise",
      participants: 1,
      createdAt: new Date().toISOString(),
    };

    const ref = await addDoc(collection(db, COLECAO), novaMissao);

    return NextResponse.json({ id: ref.id, ...novaMissao }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Falha ao registrar denúncia.", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remover uma denúncia/missão por ID (?id=...) do Firestore
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "O ID da missão é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, COLECAO, id));

    return NextResponse.json(
      { message: "Missão removida com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao excluir missão.", error: error.message },
      { status: 500 }
    );
  }
}
