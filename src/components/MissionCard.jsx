import Link from 'next/link';
import Button from './Button';
import { getRing, STATUS_STYLES } from '../lib/rings';
import { FaLocationDot, FaUsers, FaArrowRight, FaCircleCheck, FaHandshake, FaUserPen } from 'react-icons/fa6';

// Selos opcionais mostrando a relação do usuário logado com a missão.
const SELOS_USUARIO = {
  concluida: { texto: 'Você concluiu', Icon: FaCircleCheck, classe: 'bg-accent/10 text-accent-text' },
  engajada: { texto: 'Você está engajado', Icon: FaHandshake, classe: 'bg-primary/10 text-primary-text' },
  criada: { texto: 'Sua denúncia', Icon: FaUserPen, classe: 'bg-ring-wind/10 text-ring-wind' },
};

export default function MissionCard({ mission, onSelectMission, estadoUsuario, destaque = false }) {
  const { title, description, ring = 'terra', location, status = 'Ativa', participants = 0, creatorName } = mission;
  const currentRing = getRing(ring);
  const RingIcon = currentRing.Icon;
  const statusClass = STATUS_STYLES[status] || STATUS_STYLES.Ativa;
  const selo = SELOS_USUARIO[estadoUsuario];

  return (
    <article
      id={`missao-${mission.id}`}
      className={`group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 ${
        destaque ? `ring-4 ring-offset-4 ring-offset-background shadow-2xl animate-destaque ${currentRing.realce}` : ''
      }`}
    >
      {/* Faixa com a cor do anel */}
      <span className={`h-1.5 w-full ${currentRing.bg}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6">
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white dark:text-slate-950 ${currentRing.bg}`}>
            <RingIcon aria-hidden="true" />
            {currentRing.label}
          </span>
          <span className="flex items-center gap-1.5">
            {destaque && (
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black uppercase text-amber-950 animate-pulse">
                Nova
              </span>
            )}
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass}`}>
              {status}
            </span>
          </span>
        </div>

        {/* Título e Descrição */}
        <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-foreground">{title}</h3>
        {creatorName && <p className="mt-1 text-xs text-foreground-muted">por {creatorName}</p>}
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-foreground-muted">{description}</p>

        {selo && (
          <span className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-bold ${selo.classe}`}>
            <selo.Icon aria-hidden="true" />
            {selo.texto}
          </span>
        )}

        {/* Rodapé do Card */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs font-medium text-foreground-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <FaLocationDot aria-hidden="true" className="shrink-0 text-primary-text" />
            <span className="truncate">{location}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <FaUsers aria-hidden="true" className="text-primary-text" />
            {participants} <span className="sr-only">protetores</span>
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectMission && onSelectMission(mission)}
            ariaLabel={`Ver detalhes da missão ${title}`}
          >
            Detalhes
          </Button>
          {/* Página da missão, com o chat dos participantes */}
          <Link
            href={`/missoes/${mission.id}`}
            aria-label={`Entrar na missão ${title}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-dark px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card dark:text-slate-950"
          >
            Entrar na missão
            <FaArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
