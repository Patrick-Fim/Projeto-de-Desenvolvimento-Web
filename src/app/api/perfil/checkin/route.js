import { NextResponse } from 'next/server';
import { runTransaction } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { usuarioDaRequisicao, naoAutorizado } from '../../../../lib/servidor/autenticacao';
import { refUsuario, perfilNovo, perfilProprio } from '../../../../lib/servidor/perfis';
import { hoje, diaAnterior } from '../../../../lib/datas';
import { XP } from '../../../../lib/gamificacao';

// POST - Registra o acesso do dia: cria o perfil se for o primeiro login,
// atualiza o foguinho (dias seguidos) e dá o XP diário.
export async function POST(request) {
  const usuario = await usuarioDaRequisicao(request);
  if (!usuario) return naoAutorizado();

  const corpo = await request.json().catch(() => ({}));
  const nomeInformado = typeof corpo.nome === 'string' ? corpo.nome.trim().slice(0, 60) : '';

  try {
    const perfil = await runTransaction(db, async (transacao) => {
      const ref = refUsuario(usuario.uid);
      const snap = await transacao.get(ref);
      const existia = snap.exists();
      const dados = existia ? snap.data() : perfilNovo(usuario, nomeInformado);
      let mudou = !existia;

      // Troca o nome provisório (tirado do e-mail) pelo nome digitado no cadastro.
      if (dados.nomeProvisorio && nomeInformado) {
        dados.nome = nomeInformado;
        dados.nomeProvisorio = false;
        mudou = true;
      }

      const dia = hoje();
      if (dados.ultimoAcesso !== dia) {
        dados.sequencia = dados.ultimoAcesso === diaAnterior(dia) ? (dados.sequencia || 0) + 1 : 1;
        dados.melhorSequencia = Math.max(dados.melhorSequencia || 0, dados.sequencia);
        dados.ultimoAcesso = dia;
        dados.xp = (dados.xp || 0) + XP.checkin;
        mudou = true;
      }

      if (mudou) transacao.set(ref, dados);
      return dados;
    });

    return NextResponse.json(perfilProprio(usuario.uid, perfil), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao registrar o acesso.', error: error.message },
      { status: 500 }
    );
  }
}
