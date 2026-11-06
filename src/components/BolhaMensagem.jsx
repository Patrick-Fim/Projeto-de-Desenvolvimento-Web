import Avatar from './Avatar';
import { getRing } from '../lib/rings';

const formatoHora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

// Uma mensagem do chat: avatar e nome (dos outros), bolha com texto/imagem e horário.
// Cores vêm dos tokens --bolha-propria e --bolha-outra (src/styles/theme.css).
export default function BolhaMensagem({
  mensagem,
  minha = false,
  agrupada = false,
  onAbrirImagem,
  onImagemCarregada,
  acoes,
}) {
  const { autorNome, autorAnel, texto, imagem, apagada, criadoEm } = mensagem;
  const ring = getRing(autorAnel);
  const temImagem = Boolean(imagem) && !apagada;
  const hora = criadoEm ? formatoHora.format(new Date(criadoEm)) : '';

  // Bolhas com foto têm largura fixa (estilo WhatsApp): a foto ocupa a bolha toda.
  const corBolha = minha
    ? 'bg-bolha-propria text-bolha-propria-texto rounded-br-md'
    : 'bg-bolha-outra text-bolha-outra-texto border border-border rounded-bl-md';
  const corHora = minha ? 'text-bolha-propria-texto/90' : 'text-foreground-muted';

  const horario = (classe = '') => (
    <time dateTime={criadoEm} className={`block text-right text-[10px] ${corHora} ${classe}`}>
      {hora}
    </time>
  );

  return (
    <div className={`group flex items-end gap-2 ${minha ? 'flex-row-reverse' : ''} ${agrupada ? 'mt-1' : 'mt-3'}`}>
      {!minha &&
        (agrupada ? <span className="w-8 shrink-0" /> : <Avatar nome={autorNome} anel={autorAnel} tamanho="sm" />)}

      <div className={`flex min-w-0 max-w-[80%] flex-col ${minha ? 'items-end' : 'items-start'}`}>
        {!agrupada && !minha && (
          <span className={`mb-1 ml-1 text-xs font-bold ${ring.text}`}>{autorNome}</span>
        )}

        <div className={`rounded-2xl text-sm shadow-sm ${corBolha} ${temImagem ? 'w-64 max-w-full p-1 sm:w-72' : 'px-3.5 py-2'}`}>
          {apagada ? (
            <>
              <p className="italic opacity-80">Mensagem apagada</p>
              {horario('mt-1')}
            </>
          ) : temImagem ? (
            <>
              <button
                type="button"
                onClick={() => onAbrirImagem?.(imagem)}
                aria-label={`Ampliar imagem enviada por ${autorNome}`}
                className="relative block w-full cursor-zoom-in overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagem}
                  alt={`Imagem enviada por ${autorNome}`}
                  onLoad={onImagemCarregada}
                  className="block h-auto max-h-80 w-full object-cover"
                />
                {/* Sem legenda, o horário fica sobre a foto */}
                {!texto && (
                  <span className="absolute bottom-1.5 right-2 rounded-full bg-slate-950/60 px-1.5 py-0.5 text-[10px] text-white">
                    {hora}
                  </span>
                )}
              </button>
              {texto && (
                <div className="px-2 pb-1 pt-1.5">
                  <p className="whitespace-pre-wrap break-words">{texto}</p>
                  {horario('mt-0.5')}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words">{texto}</p>
              {horario('mt-1')}
            </>
          )}
        </div>
      </div>

      {acoes}
    </div>
  );
}
