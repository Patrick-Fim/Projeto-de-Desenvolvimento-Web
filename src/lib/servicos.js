// Serviços de dados da ferramenta (rodam no navegador; o site é estático).
// - Missões: API REST do Firestore (GET, POST, PATCH, DELETE) — ver firestoreRest.js.
// - Perfil, XP, chat, ranking e imagens: SDK do Firebase.
// A segurança fica nas regras do Firestore (firestore.rules).
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  where,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebaseAuth';
import * as rest from './firestoreRest';
import { XP } from './gamificacao';
import { hoje, diaAnterior, chaveSemana, chaveMes } from './datas';
import { perfilNovo, perfilProprio, perfilPublico } from './perfis';
import { validarCamposMissao, aceitaProtetores, CHAT, ANEIS_IDS } from './missoes';
import { RINGS } from './rings';
import { FORMATOS_IMAGEM, FORMATO_DATA_URL } from './imagens';

const refUsuario = (uid) => doc(db, 'usuarios', uid);

function usuarioAtual() {
  const usuario = auth.currentUser;
  if (!usuario) throw new Error('Faça login para continuar.');
  return usuario;
}

// Padroniza listas que podem faltar em missões antigas.
const missaoComListas = (m) => ({ ...m, participantIds: m.participantIds || [], concluidoPor: m.concluidoPor || [] });

// ============================ XP ============================

// Aplica um ganho (ou perda) de XP no total e nos períodos atuais (semana e mês),
// usados pelo ranking semanal e mensal. Só guarda os períodos atuais.
function aplicarXp(perfil, delta) {
  const atuais = [chaveSemana(), chaveMes()];
  const anterior = perfil.xpPorPeriodo || {};
  const xpPorPeriodo = Object.fromEntries(atuais.map((k) => [k, Math.max(0, (anterior[k] || 0) + delta)]));
  return { xp: Math.max(0, (perfil.xp || 0) + delta), xpPorPeriodo };
}

// Campo usado para ordenar cada ranking.
export const PERIODOS_RANKING = [
  { id: 'semanal', rotulo: 'Semanal' },
  { id: 'mensal', rotulo: 'Mensal' },
  { id: 'geral', rotulo: 'Geral' },
];

function campoDoPeriodo(periodo) {
  if (periodo === 'semanal') return `xpPorPeriodo.${chaveSemana()}`;
  if (periodo === 'mensal') return `xpPorPeriodo.${chaveMes()}`;
  return 'xp';
}

function xpDoPeriodo(dados, periodo) {
  if (periodo === 'semanal') return dados.xpPorPeriodo?.[chaveSemana()] || 0;
  if (periodo === 'mensal') return dados.xpPorPeriodo?.[chaveMes()] || 0;
  return dados.xp || 0;
}

// ============================ Perfil ============================

// Acesso do dia: cria o perfil no 1º login, atualiza o foguinho e dá o XP diário.
export async function checkin(nomeInformado = '') {
  const usuario = usuarioAtual();
  const nomeLimpo = String(nomeInformado || '').trim().slice(0, 60);

  const dados = await runTransaction(db, async (transacao) => {
    const ref = refUsuario(usuario.uid);
    const snap = await transacao.get(ref);
    const existia = snap.exists();
    const perfil = existia
      ? { ...snap.data() }
      : perfilNovo({ nome: usuario.displayName || '', email: usuario.email || '' }, nomeLimpo);
    let mudou = !existia;

    // O e-mail não fica no perfil (perfis são públicos).
    if ('email' in perfil) {
      delete perfil.email;
      mudou = true;
    }
    if (perfil.nomeProvisorio && nomeLimpo) {
      perfil.nome = nomeLimpo;
      perfil.nomeProvisorio = false;
      mudou = true;
    }

    const dia = hoje();
    if (perfil.ultimoAcesso !== dia) {
      perfil.sequencia = perfil.ultimoAcesso === diaAnterior(dia) ? (perfil.sequencia || 0) + 1 : 1;
      perfil.melhorSequencia = Math.max(perfil.melhorSequencia || 0, perfil.sequencia);
      perfil.ultimoAcesso = dia;
      Object.assign(perfil, aplicarXp(perfil, XP.checkin));
      mudou = true;
    }

    if (mudou) transacao.set(ref, perfil);
    return perfil;
  });

  return perfilProprio(usuario.uid, dados);
}

// Edita nome, cidade, bio, anel, foto de perfil e banner.
export async function editarPerfil(campos, perfilAtual) {
  const usuario = usuarioAtual();
  const nome = String(campos.nome || '').trim();
  const cidade = String(campos.cidade || '').trim();
  const bio = String(campos.bio || '').trim();

  if (nome.length < 3 || nome.length > 60) throw new Error('O nome deve ter entre 3 e 60 caracteres.');
  if (cidade.length > 60) throw new Error('A cidade deve ter no máximo 60 caracteres.');
  if (bio.length > 160) throw new Error('A bio deve ter no máximo 160 caracteres.');
  if (!ANEIS_IDS.includes(campos.anel)) throw new Error('Anel elemental inválido.');

  const [avatarId, bannerId] = await Promise.all([
    salvarImagemSeNova(campos.avatar, perfilAtual.avatarId, 'avatar'),
    salvarImagemSeNova(campos.banner, perfilAtual.bannerId, 'banner'),
  ]);

  const ref = refUsuario(usuario.uid);
  await updateDoc(ref, { nome, nomeProvisorio: false, cidade, bio, anel: campos.anel, avatarId, bannerId });

  // Apaga as imagens trocadas ou removidas.
  if (perfilAtual.avatarId && perfilAtual.avatarId !== avatarId) await apagarImagem(perfilAtual.avatarId);
  if (perfilAtual.bannerId && perfilAtual.bannerId !== bannerId) await apagarImagem(perfilAtual.bannerId);

  return perfilProprio(usuario.uid, (await getDoc(ref)).data());
}

// Soma (ou subtrai) valores no perfil, sem deixar ficar negativo.
async function somarAoPerfil(uid, deltas) {
  const ref = refUsuario(uid);
  const dados = await runTransaction(db, async (transacao) => {
    const perfil = { ...(await transacao.get(ref)).data() };
    const alterados = {};
    for (const [campo, delta] of Object.entries(deltas)) {
      if (campo === 'xp') {
        Object.assign(alterados, aplicarXp(perfil, delta));
      } else {
        alterados[campo] = Math.max(0, (perfil[campo] || 0) + delta);
      }
    }
    Object.assign(perfil, alterados);
    transacao.update(ref, alterados);
    return perfil;
  });
  return perfilProprio(uid, dados);
}

// Os 20 protetores com mais XP no período: 'semanal', 'mensal' ou 'geral'.
export async function ranking(periodo = 'geral') {
  const snap = await getDocs(
    query(collection(db, 'usuarios'), orderBy(campoDoPeriodo(periodo), 'desc'), limit(20))
  );
  return snap.docs
    .map((d) => ({ ...perfilPublico(d.id, d.data()), xpPeriodo: xpDoPeriodo(d.data(), periodo) }))
    .filter((p) => periodo === 'geral' || p.xpPeriodo > 0)
    .map((p, i) => ({ ...p, posicao: i + 1 }));
}

// Ranking dos times (anel favorito): XP somado e quantidade de protetores de cada elemento.
// A soma é feita no navegador para não depender de índices do Firestore por período.
export async function rankingElementos(periodo = 'geral') {
  const snap = await getDocs(query(collection(db, 'usuarios'), limit(1000)));
  const placar = Object.fromEntries(RINGS.map((ring) => [ring.id, { id: ring.id, xp: 0, protetores: 0 }]));
  snap.docs.forEach((d) => {
    const time = placar[d.data().anel] || placar.terra;
    time.xp += xpDoPeriodo(d.data(), periodo);
    time.protetores += 1;
  });
  return Object.values(placar)
    .sort((a, b) => b.xp - a.xp)
    .map((time, i) => ({ ...time, posicao: i + 1 }));
}

// Protetores de um time (anel), do maior para o menor XP.
export async function membrosDoTime(anel) {
  const snap = await getDocs(query(collection(db, 'usuarios'), where('anel', '==', anel), limit(100)));
  return snap.docs.map((d) => perfilPublico(d.id, d.data())).sort((a, b) => b.xp - a.xp);
}

// Números reais da plataforma (página inicial).
export async function estatisticas() {
  const [usuarios, missoes] = await Promise.all([
    getCountFromServer(collection(db, 'usuarios')),
    rest.listar('missoes'),
  ]);
  return {
    protetores: usuarios.data().count,
    missoes: missoes.length,
    concluidas: missoes.reduce((total, m) => total + (m.concluidoPor || []).length, 0),
    cidades: new Set(missoes.map((m) => (m.location || '').trim().toLowerCase()).filter(Boolean)).size,
  };
}

// ============================ Imagens ============================

// Envia uma imagem (data URL já comprimida) e devolve o id.
export async function enviarImagem(dados, formato) {
  const usuario = usuarioAtual();
  const config = FORMATOS_IMAGEM[formato];
  if (!config || typeof dados !== 'string' || dados.length > config.limite || !FORMATO_DATA_URL.test(dados)) {
    throw new Error(`A ${config?.rotulo || 'imagem'} é inválida ou grande demais.`);
  }
  const ref = await addDoc(collection(db, 'imagens'), {
    dados,
    formato,
    donoUid: usuario.uid,
    criadoEm: new Date().toISOString(),
  });
  return ref.id;
}

// Valor do formulário → id final: null = removida · data URL = nova · id = mantém.
export async function salvarImagemSeNova(valor, idAtual, formato) {
  if (!valor) return null;
  if (!valor.startsWith('data:')) return idAtual || valor;
  return enviarImagem(valor, formato);
}

async function apagarImagem(id) {
  if (!id) return;
  try {
    await deleteDoc(doc(db, 'imagens', id));
  } catch {
    // Se falhar, a imagem antiga só fica sem uso.
  }
}

// Carrega uma imagem salva (com cache em memória, para não buscar duas vezes).
const cacheImagens = new Map();
export function carregarImagem(id) {
  if (!id) return Promise.resolve(null);
  if (!cacheImagens.has(id)) {
    cacheImagens.set(
      id,
      getDoc(doc(db, 'imagens', id))
        .then((snap) => (snap.exists() ? snap.data().dados : null))
        .catch(() => {
          cacheImagens.delete(id);
          return null;
        })
    );
  }
  return cacheImagens.get(id);
}

// ============================ Missões (API REST) ============================

// GET - todas as missões, mais recentes primeiro.
export async function listarMissoes() {
  const missoes = (await rest.listar('missoes')).map(missaoComListas);
  return missoes.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

// GET - uma missão e seus membros (criador + participantes).
export async function obterMissao(id) {
  const missao = await rest.obter('missoes', id);
  if (!missao) throw new Error('Missão ambiental não encontrada.');

  const uids = [...new Set([missao.creatorUid, ...(missao.participantIds || [])].filter(Boolean))];
  const perfis = await Promise.all(uids.map((uid) => getDoc(refUsuario(uid))));
  const membros = perfis
    .filter((p) => p.exists())
    .map((p) => ({ ...perfilPublico(p.id, p.data()), papel: p.id === missao.creatorUid ? 'criador' : 'participante' }));

  return { missao: missaoComListas(missao), membros };
}

// POST - registra uma denúncia (vira missão). Quem cria ganha XP.
export async function criarMissao(formulario, capa, perfil) {
  const usuario = usuarioAtual();
  const prazo = formulario.prazo || null;
  const erros = validarCamposMissao({ ...formulario, prazo });
  if (Object.keys(erros).length) throw new Error(Object.values(erros)[0]);

  const capaId = await salvarImagemSeNova(capa, null, 'capa');
  const missao = await rest.criar('missoes', {
    title: formulario.title.trim(),
    description: formulario.description.trim(),
    ring: formulario.ring,
    location: formulario.location.trim(),
    reporterName: formulario.reporterName.trim(),
    prazo,
    capaId,
    creatorUid: usuario.uid,
    creatorName: perfil?.nome || usuario.displayName || 'Protetor',
    status: 'Análise',
    participants: 0,
    participantIds: [],
    concluidoPor: [],
    createdAt: new Date().toISOString(),
  });

  // O e-mail de contato fica numa área que só o dono da missão lê.
  await setDoc(doc(db, 'missoes', missao.id, 'contatos', 'denunciante'), {
    reporterName: formulario.reporterName.trim(),
    reporterEmail: formulario.reporterEmail.trim(),
  });

  const perfilAtualizado = await somarAoPerfil(usuario.uid, { xp: XP.criarMissao, missoesCriadas: 1 });
  return { missao: missaoComListas(missao), perfil: perfilAtualizado, xpGanho: XP.criarMissao };
}

// PATCH - o dono edita título, descrição, anel, local, prazo e capa.
export async function editarMissao(id, campos, missaoAtual) {
  const usuario = usuarioAtual();
  if (missaoAtual.creatorUid !== usuario.uid) throw new Error('Só quem registrou a missão pode editá-la.');

  const prazo = campos.prazo || null;
  const erros = validarCamposMissao({ ...campos, prazo }, missaoAtual.prazo || null);
  if (Object.keys(erros).length) throw new Error(Object.values(erros)[0]);

  const capaId = await salvarImagemSeNova(campos.capa, missaoAtual.capaId, 'capa');
  const missao = await rest.atualizar('missoes', id, {
    title: campos.title.trim(),
    description: campos.description.trim(),
    ring: campos.ring,
    location: campos.location.trim(),
    prazo,
    capaId,
    atualizadoEm: new Date().toISOString(),
  });

  if (missaoAtual.capaId && missaoAtual.capaId !== capaId) await apagarImagem(missaoAtual.capaId);
  return missaoComListas(missao);
}

// DELETE - o dono exclui a missão (e devolve o XP da criação).
export async function excluirMissao(id, missaoAtual) {
  const usuario = usuarioAtual();
  if (missaoAtual.creatorUid !== usuario.uid) throw new Error('Só quem registrou a missão pode excluí-la.');

  try {
    await deleteDoc(doc(db, 'missoes', id, 'contatos', 'denunciante'));
  } catch {
    // Missões antigas não têm contato separado.
  }
  await rest.excluir('missoes', id);
  await apagarImagem(missaoAtual.capaId);

  const perfil = await somarAoPerfil(usuario.uid, { xp: -XP.criarMissao, missoesCriadas: -1 });
  return { perfil };
}

// PATCH - o líder (criador) encerra a missão: ela vai para a lista de concluídas.
export async function encerrarMissao(id, missaoAtual) {
  const usuario = usuarioAtual();
  if (missaoAtual.creatorUid !== usuario.uid) throw new Error('Só o líder da missão pode encerrá-la.');
  if (missaoAtual.status === 'Concluída') throw new Error('Esta missão já foi encerrada.');

  const missao = await rest.atualizar('missoes', id, {
    status: 'Concluída',
    encerradaEm: new Date().toISOString(),
  });
  const perfil = await somarAoPerfil(usuario.uid, { xp: XP.encerrarMissao, missoesLideradas: 1 });
  return { missao: missaoComListas(missao), perfil, xpGanho: XP.encerrarMissao };
}

// Entrar (engajar) ou concluir uma missão, com o XP correspondente.
export async function acaoMissao(id, acao) {
  const usuario = usuarioAtual();
  const uid = usuario.uid;

  const resultado = await runTransaction(db, async (transacao) => {
    const refMissao = doc(db, 'missoes', id);
    const refPerfil = refUsuario(uid);
    const [snapMissao, snapPerfil] = await Promise.all([transacao.get(refMissao), transacao.get(refPerfil)]);
    if (!snapMissao.exists()) throw new Error('Missão ambiental não encontrada.');

    const missao = missaoComListas(snapMissao.data());
    const perfil = { ...snapPerfil.data() };
    if (missao.creatorUid === uid) throw new Error('Você registrou esta missão; ela é para outros protetores.');

    let xpGanho;
    let mudancaMissao;
    let mudancaPerfil;

    if (acao === 'engajar') {
      if (missao.participantIds.includes(uid)) throw new Error('Você já está engajado nesta missão.');
      if (!aceitaProtetores(missao)) throw new Error('Esta missão não aceita mais novos protetores.');
      mudancaMissao = { participantIds: [...missao.participantIds, uid], participants: (missao.participants || 0) + 1 };
      xpGanho = XP.engajar;
      mudancaPerfil = { engajadas: [...(perfil.engajadas || []), id] };
    } else {
      if (!missao.participantIds.includes(uid)) throw new Error('Engaje-se na missão antes de concluí-la.');
      if (missao.concluidoPor.includes(uid)) throw new Error('Você já concluiu esta missão.');
      mudancaMissao = { concluidoPor: [...missao.concluidoPor, uid] };
      xpGanho = XP.concluir;
      const aneis = perfil.aneisConcluidos || [];
      mudancaPerfil = {
        concluidas: [...(perfil.concluidas || []), id],
        aneisConcluidos: missao.ring && !aneis.includes(missao.ring) ? [...aneis, missao.ring] : aneis,
      };
    }
    Object.assign(mudancaPerfil, aplicarXp(perfil, xpGanho));

    transacao.update(refMissao, mudancaMissao);
    transacao.update(refPerfil, mudancaPerfil);
    return {
      missao: { id, ...missao, ...mudancaMissao },
      perfil: perfilProprio(uid, { ...perfil, ...mudancaPerfil }),
      xpGanho,
    };
  });

  return resultado;
}

// ============================ Chat ============================

// Envia uma mensagem (texto e/ou imagem) em qualquer conversa.
// caminho: onde ficam as mensagens, ex.: ['missoes', id, 'mensagens'], ['times', 'fogo', 'mensagens'].
export async function enviarMensagem(caminho, { texto, imagem }, perfil) {
  const usuario = usuarioAtual();
  const conteudo = String(texto || '').trim();
  if (!conteudo && !imagem) throw new Error('Escreva uma mensagem ou envie uma imagem.');
  if (conteudo.length > CHAT.limiteTexto) throw new Error(`A mensagem deve ter no máximo ${CHAT.limiteTexto} caracteres.`);
  if (imagem && (imagem.length > CHAT.limiteImagem || !FORMATO_DATA_URL.test(imagem))) {
    throw new Error('Imagem inválida ou grande demais.');
  }

  await addDoc(collection(db, ...caminho), {
    autorUid: usuario.uid,
    autorNome: perfil?.nome || usuario.displayName || 'Protetor',
    autorAnel: perfil?.anel || 'terra',
    autorAvatarId: perfil?.avatarId || null,
    texto: conteudo,
    imagem: imagem || null,
    apagada: false,
    criadoEm: new Date().toISOString(),
  });
}

// Apaga a própria mensagem (fica como "Mensagem apagada").
export async function apagarMensagem(caminho, mensagemId) {
  usuarioAtual();
  await updateDoc(doc(db, ...caminho, mensagemId), { apagada: true, texto: '', imagem: null });
}

// ============================ Amigos ============================

// Id da amizade (e da conversa privada) entre duas pessoas: os dois uids em ordem.
export const idPar = (a, b) => [a, b].sort().join('_');

// Envia um pedido de amizade.
export async function enviarPedidoAmizade(outroUid) {
  const usuario = usuarioAtual();
  if (outroUid === usuario.uid) throw new Error('Você não pode adicionar a si mesmo.');
  const usuarios = [usuario.uid, outroUid].sort();
  await setDoc(doc(db, 'amizades', idPar(usuario.uid, outroUid)), {
    usuarios,
    de: usuario.uid,
    para: outroUid,
    status: 'pendente',
    criadoEm: new Date().toISOString(),
  });
}

// Aceita um pedido recebido.
export async function aceitarAmizade(par) {
  usuarioAtual();
  await updateDoc(doc(db, 'amizades', par), { status: 'aceita', aceitaEm: new Date().toISOString() });
}

// Recusa, cancela ou desfaz uma amizade.
export async function removerAmizade(par) {
  usuarioAtual();
  await deleteDoc(doc(db, 'amizades', par));
}

// Perfis públicos por uid (com cache em memória).
const cachePerfis = new Map();
export async function carregarPerfisPublicos(uids) {
  const faltando = [...new Set(uids)].filter((uid) => uid && !cachePerfis.has(uid));
  await Promise.all(
    faltando.map(async (uid) => {
      const snap = await getDoc(refUsuario(uid));
      if (snap.exists()) cachePerfis.set(uid, perfilPublico(uid, snap.data()));
    })
  );
  return Object.fromEntries(uids.filter((uid) => cachePerfis.has(uid)).map((uid) => [uid, cachePerfis.get(uid)]));
}

// Procura protetores pelo nome (busca simples entre os perfis cadastrados).
export async function buscarProtetores(termo) {
  const busca = String(termo || '').trim().toLowerCase();
  const snap = await getDocs(query(collection(db, 'usuarios'), orderBy('xp', 'desc'), limit(200)));
  return snap.docs
    .map((d) => perfilPublico(d.id, d.data()))
    .filter((p) => !busca || (p.nome || '').toLowerCase().includes(busca))
    .slice(0, 30);
}
