import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const COLECAO_IMAGENS = 'imagens';

// Confere se a imagem existe e foi enviada pelo usuário (null/vazio é sempre aceito).
export async function imagemPertenceA(id, uid) {
  if (!id) return true;
  if (typeof id !== 'string' || id.length > 64) return false;
  const snap = await getDoc(doc(db, COLECAO_IMAGENS, id));
  return snap.exists() && snap.data().donoUid === uid;
}

// Apaga uma imagem substituída ou removida, se for do usuário. Falhas aqui não travam a ação.
export async function apagarImagemDoDono(id, uid) {
  if (!id) return;
  try {
    const ref = doc(db, COLECAO_IMAGENS, id);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().donoUid === uid) await deleteDoc(ref);
  } catch {
    // A imagem antiga fica órfã, sem prejudicar o usuário.
  }
}
