// Remove o e-mail de quem denunciou antes de enviar a missão para o navegador.
export function missaoPublica(id, dados) {
  // eslint-disable-next-line no-unused-vars
  const { reporterEmail, ...resto } = dados;
  return {
    id,
    ...resto,
    participantIds: resto.participantIds || [],
    concluidoPor: resto.concluidoPor || [],
  };
}
