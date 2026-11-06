// DELETE -> remove um voluntário pelo id.
import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteDoc(doc(db, "voluntarios", id));
    return NextResponse.json({ ok: true });
  } catch (erro) {
    return NextResponse.json(
      { erro: "Falha ao remover voluntário" },
      { status: 500 }
    );
  }
}
