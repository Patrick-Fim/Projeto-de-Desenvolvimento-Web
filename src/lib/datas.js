// Datas no fuso de Brasília, no formato AAAA-MM-DD (usado pelo foguinho).
const FORMATO = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function hoje() {
  return FORMATO.format(new Date());
}

export function diaAnterior(dia) {
  const data = new Date(`${dia}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() - 1);
  return data.toISOString().slice(0, 10);
}

// Quantos dias a pessoa está na plataforma (o dia do cadastro conta como 1).
export function diasDesde(iso) {
  if (!iso) return 0;
  const inicio = new Date(`${FORMATO.format(new Date(iso))}T12:00:00Z`);
  const agora = new Date(`${hoje()}T12:00:00Z`);
  return Math.round((agora - inicio) / 86400000) + 1;
}

// A sequência só vale se o último acesso foi hoje ou ontem; senão, a chama apagou.
export function sequenciaAtual(perfil) {
  const dia = hoje();
  if (perfil.ultimoAcesso === dia || perfil.ultimoAcesso === diaAnterior(dia)) {
    return perfil.sequencia || 0;
  }
  return 0;
}

// Chave da semana (ISO, começa na segunda) para o ranking semanal. Ex.: "s2026_45".
export function chaveSemana(dia = hoje()) {
  const data = new Date(`${dia}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() - ((data.getUTCDay() + 6) % 7) + 3); // quinta-feira da semana
  const ano = data.getUTCFullYear();
  const quatroDeJaneiro = new Date(Date.UTC(ano, 0, 4, 12));
  const semana =
    1 + Math.round(((data - quatroDeJaneiro) / 86400000 - 3 + ((quatroDeJaneiro.getUTCDay() + 6) % 7)) / 7);
  return `s${ano}_${String(semana).padStart(2, '0')}`;
}

// Chave do mês para o ranking mensal. Ex.: "m2026_11".
export const chaveMes = (dia = hoje()) => `m${dia.slice(0, 4)}_${dia.slice(5, 7)}`;
