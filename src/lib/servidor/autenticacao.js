import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { firebaseConfig } from '../firebase';

// Chaves públicas do Google que assinam os tokens do Firebase Auth.
const CHAVES_GOOGLE = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

// Lê e valida o token enviado no cabeçalho "Authorization: Bearer <token>".
// Retorna { uid, email, nome } do usuário logado, ou null se não houver login válido.
export async function usuarioDaRequisicao(request) {
  const cabecalho = request.headers.get('authorization') || '';
  if (!cabecalho.startsWith('Bearer ')) return null;

  try {
    const { payload } = await jwtVerify(cabecalho.slice(7), CHAVES_GOOGLE, {
      issuer: `https://securetoken.google.com/${firebaseConfig.projectId}`,
      audience: firebaseConfig.projectId,
    });
    return { uid: payload.sub, email: payload.email || '', nome: payload.name || '' };
  } catch {
    return null;
  }
}

export function naoAutorizado() {
  return NextResponse.json({ message: 'Faça login para continuar.' }, { status: 401 });
}
