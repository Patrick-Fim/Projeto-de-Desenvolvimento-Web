import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { usuarioDaRequisicao, naoAutorizado } from "../../../lib/servidor/autenticacao";
import { refUsuario, perfilNovo, perfilProprio } from "../../../lib/servidor/perfis";
import { XP } from "../../../lib/gamificacao";
import { missaoPublica } from "../../../lib/servidor/missoes";
import { imagemPertenceA, apagarImagemDoDono } from "../../../lib/servidor/imagens";
import { infoPrazo, validarCamposMissao } from "../../../lib/missoes";

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
        creatorName: "Comunidade",
        participantIds: [],
        concluidoPor: [],
        createdAt: new Date().toISOString(),
      })
    )
  );
}

function erro(mensagem, status) {
  return NextResponse.json({ message: mensagem }, { status });
}

// GET - Listar todas as missões/denúncias (Firestore)
export async function GET() {
  try {
    await semearSeVazio();
    const snap = await getDocs(collection(db, COLECAO));
    const missoes = snap.docs.map((d) => missaoPublica(d.id, d.data()));
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

// POST - Criar uma nova denúncia/missão. Exige login: quem cria vira o dono e ganha XP.
export async function POST(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const body = await request.json();
    const { title, description, ring, location, reporterName, reporterEmail } = body;
    const prazo = body.prazo || null;
    const capaId = body.capaId || null;

    if (!title || !description || !ring || !location || !reporterName || !reporterEmail) {
      return erro("Todos os campos obrigatórios devem ser preenchidos.", 400);
    }
    const erros = validarCamposMissao({ title, description, ring, location, prazo });
    if (Object.keys(erros).length) return erro(Object.values(erros)[0], 400);
    if (!(await imagemPertenceA(capaId, usuario.uid))) return erro("Imagem de capa inválida.", 400);

    const refMissao = doc(collection(db, COLECAO));
    const resultado = await runTransaction(db, async (transacao) => {
      const refPerfil = refUsuario(usuario.uid);
      const snapPerfil = await transacao.get(refPerfil);
      const perfil = snapPerfil.exists() ? snapPerfil.data() : perfilNovo(usuario);

      const novaMissao = {
        title,
        description,
        ring,
        location,
        reporterName,
        reporterEmail,
        prazo,
        capaId,
        creatorUid: usuario.uid,
        creatorName: perfil.nome,
        status: "Análise",
        participants: 0,
        participantIds: [],
        concluidoPor: [],
        createdAt: new Date().toISOString(),
      };

      perfil.missoesCriadas = (perfil.missoesCriadas || 0) + 1;
      perfil.xp = (perfil.xp || 0) + XP.criarMissao;

      transacao.set(refMissao, novaMissao);
      transacao.set(refPerfil, perfil);
      return { novaMissao, perfil };
    });

    return NextResponse.json(
      {
        missao: missaoPublica(refMissao.id, resultado.novaMissao),
        perfil: perfilProprio(usuario.uid, resultado.perfil),
        xpGanho: XP.criarMissao,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Falha ao registrar denúncia.", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Engajar em uma missão ou marcar como concluída (?id=...).
// Corpo: { "acao": "engajar" } ou { "acao": "concluir" }
export async function PATCH(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return erro("O ID da missão é obrigatório.", 400);

  const { acao } = await request.json().catch(() => ({}));
  if (acao !== "engajar" && acao !== "concluir") {
    return erro('A ação deve ser "engajar" ou "concluir".', 400);
  }

  try {
    const resultado = await runTransaction(db, async (transacao) => {
      const refMissao = doc(db, COLECAO, id);
      const refPerfil = refUsuario(usuario.uid);
      const [snapMissao, snapPerfil] = await Promise.all([
        transacao.get(refMissao),
        transacao.get(refPerfil),
      ]);

      if (!snapMissao.exists()) return { falha: ["Missão ambiental não encontrada.", 404] };

      const missao = snapMissao.data();
      const perfil = snapPerfil.exists() ? snapPerfil.data() : perfilNovo(usuario);
      const participantes = missao.participantIds || [];
      const concluiram = missao.concluidoPor || [];

      if (missao.creatorUid === usuario.uid) {
        return { falha: ["Você registrou esta missão; ela é para outros protetores.", 400] };
      }

      let xpGanho = 0;
      if (acao === "engajar") {
        if (participantes.includes(usuario.uid)) return { falha: ["Você já está engajado nesta missão.", 409] };
        if (infoPrazo(missao.prazo)?.encerrada) return { falha: ["O prazo desta missão já terminou.", 400] };
        missao.participantIds = [...participantes, usuario.uid];
        missao.participants = (missao.participants || 0) + 1;
        perfil.engajadas = [...(perfil.engajadas || []), id];
        xpGanho = XP.engajar;
      } else {
        if (!participantes.includes(usuario.uid)) return { falha: ["Engaje-se na missão antes de concluí-la.", 400] };
        if (concluiram.includes(usuario.uid)) return { falha: ["Você já concluiu esta missão.", 409] };
        missao.concluidoPor = [...concluiram, usuario.uid];
        perfil.concluidas = [...(perfil.concluidas || []), id];
        const aneis = perfil.aneisConcluidos || [];
        if (missao.ring && !aneis.includes(missao.ring)) perfil.aneisConcluidos = [...aneis, missao.ring];
        xpGanho = XP.concluir;
      }

      perfil.xp = (perfil.xp || 0) + xpGanho;
      transacao.set(refMissao, missao);
      transacao.set(refPerfil, perfil);
      return { missao, perfil, xpGanho };
    });

    if (resultado.falha) return erro(...resultado.falha);

    return NextResponse.json(
      {
        missao: missaoPublica(id, resultado.missao),
        perfil: perfilProprio(usuario.uid, resultado.perfil),
        xpGanho: resultado.xpGanho,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar a missão.", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remover uma denúncia/missão por ID (?id=...). Só o criador pode excluir.
export async function DELETE(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return erro("O ID da missão é obrigatório para exclusão.", 400);

    const resultado = await runTransaction(db, async (transacao) => {
      const refMissao = doc(db, COLECAO, id);
      const refPerfil = refUsuario(usuario.uid);
      const [snapMissao, snapPerfil] = await Promise.all([
        transacao.get(refMissao),
        transacao.get(refPerfil),
      ]);

      if (!snapMissao.exists()) return { falha: ["Missão ambiental não encontrada.", 404] };
      if (snapMissao.data().creatorUid !== usuario.uid) {
        return { falha: ["Só quem registrou a missão pode excluí-la.", 403] };
      }

      transacao.delete(refMissao);
      const capaId = snapMissao.data().capaId || null;

      // Devolve o XP da criação, para que criar e apagar não vire "farm" de pontos.
      if (snapPerfil.exists()) {
        const perfil = snapPerfil.data();
        perfil.missoesCriadas = Math.max(0, (perfil.missoesCriadas || 0) - 1);
        perfil.xp = Math.max(0, (perfil.xp || 0) - XP.criarMissao);
        transacao.set(refPerfil, perfil);
        return { perfil, capaId };
      }
      return { capaId };
    });

    if (resultado.falha) return erro(...resultado.falha);
    await apagarImagemDoDono(resultado.capaId, usuario.uid);

    return NextResponse.json(
      {
        message: "Missão removida com sucesso.",
        perfil: resultado.perfil ? perfilProprio(usuario.uid, resultado.perfil) : null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao excluir missão.", error: error.message },
      { status: 500 }
    );
  }
}
