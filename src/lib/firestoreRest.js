// Cliente da API REST do Firestore (https://firestore.googleapis.com).
// As missões usam estas chamadas HTTP: GET (listar/obter), POST (criar),
// PATCH (editar) e DELETE (excluir). As regras do Firestore valem igual.
import { auth } from './firebaseAuth';
import { firebaseConfig } from './firebase';

const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

const MENSAGENS = {
  PERMISSION_DENIED: 'Você não tem permissão para fazer isso.',
  NOT_FOUND: 'Registro não encontrado.',
  UNAUTHENTICATED: 'Faça login para continuar.',
  INVALID_ARGUMENT: 'Dados inválidos.',
};

// ---------- Conversão entre objetos JS e o formato do Firestore ----------

function paraValor(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (Array.isArray(v)) return { arrayValue: v.length ? { values: v.map(paraValor) } : {} };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'object') return { mapValue: { fields: paraCampos(v) } };
  return { stringValue: String(v) };
}

const paraCampos = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, paraValor(v)]));

function deValor(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(deValor);
  if ('mapValue' in v) return deCampos(v.mapValue.fields);
  return null;
}

const deCampos = (campos = {}) => Object.fromEntries(Object.entries(campos).map(([k, v]) => [k, deValor(v)]));
const deDocumento = (d) => ({ id: d.name.split('/').pop(), ...deCampos(d.fields) });

// ---------- Requisições ----------

async function requisitar(metodo, caminho, corpo) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth.currentUser) headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;

  const res = await fetch(`${BASE}/${caminho}`, {
    method: metodo,
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const erro = new Error(MENSAGENS[json.error?.status] || 'Não foi possível falar com o banco de dados.');
    erro.status = json.error?.status;
    throw erro;
  }
  return json;
}

// GET - lista os documentos de uma coleção.
export async function listar(colecao) {
  const json = await requisitar('GET', `${colecao}?pageSize=300`);
  return (json.documents || []).map(deDocumento);
}

// GET - um documento (null se não existir).
export async function obter(colecao, id) {
  try {
    return deDocumento(await requisitar('GET', `${colecao}/${encodeURIComponent(id)}`));
  } catch (erro) {
    if (erro.status === 'NOT_FOUND') return null;
    throw erro;
  }
}

// POST - cria um documento com id automático.
export async function criar(colecao, dados) {
  return deDocumento(await requisitar('POST', colecao, { fields: paraCampos(dados) }));
}

// PATCH - altera só os campos enviados (updateMask) de um documento existente.
export async function atualizar(colecao, id, dados) {
  const mascara = Object.keys(dados).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join('&');
  const caminho = `${colecao}/${encodeURIComponent(id)}?${mascara}&currentDocument.exists=true`;
  return deDocumento(await requisitar('PATCH', caminho, { fields: paraCampos(dados) }));
}

// DELETE - exclui um documento.
export async function excluir(colecao, id) {
  await requisitar('DELETE', `${colecao}/${encodeURIComponent(id)}`);
}
