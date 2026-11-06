import { FaFire } from 'react-icons/fa6';

// Selo do foguinho: quantos dias seguidos o protetor acessou a plataforma.
export default function Foguinho({ dias = 0, grande = false, className = '' }) {
  const aceso = dias > 0;
  const rotulo = aceso
    ? `${dias} ${dias === 1 ? 'dia seguido' : 'dias seguidos'} na plataforma`
    : 'Foguinho apagado';

  return (
    <span
      title={rotulo}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${
        aceso
          ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
          : 'bg-foreground/5 text-foreground-muted'
      } ${grande ? 'px-4 py-2 text-lg' : 'px-2.5 py-1 text-xs'} ${className}`}
    >
      <FaFire aria-hidden="true" className={aceso ? 'animate-chama' : ''} />
      <span aria-hidden="true">{dias}</span>
      <span className="sr-only">{rotulo}</span>
    </span>
  );
}
