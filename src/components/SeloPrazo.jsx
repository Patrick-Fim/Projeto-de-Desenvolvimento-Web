import { FaCalendarDays, FaHourglassHalf } from 'react-icons/fa6';
import { infoPrazo } from '../lib/missoes';

// Selo com a data limite da missão: "Faltam X dias", "Termina hoje" ou "Prazo encerrado".
export default function SeloPrazo({ prazo, completo = false, className = '' }) {
  const info = infoPrazo(prazo);
  if (!info) return null;

  const cor = info.encerrada
    ? 'border-border bg-foreground/5 text-foreground-muted'
    : info.urgente
      ? 'border-danger-text/30 bg-danger-text/10 text-danger-text'
      : 'border-primary/25 bg-primary/10 text-primary-text';
  const Icon = info.encerrada ? FaCalendarDays : FaHourglassHalf;

  return (
    <span
      title={`Prazo: ${info.data}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${cor} ${className}`}
    >
      <Icon aria-hidden="true" />
      {info.texto}
      {completo && <span className="font-semibold opacity-80">· {info.data}</span>}
    </span>
  );
}
