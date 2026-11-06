import { FaTriangleExclamation } from 'react-icons/fa6';

// Estilo padrão dos campos de formulário; a borda muda quando há erro.
export const classeCampo = (temErro) =>
  `w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted/70 transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
    temErro ? 'border-danger-text focus:border-danger-text' : 'border-border focus:border-primary'
  }`;

// Atributos de acessibilidade que ligam o campo à sua mensagem de erro.
export const a11yCampo = (id, erro) => ({
  'aria-invalid': erro ? true : undefined,
  'aria-describedby': erro ? `${id}-erro` : undefined,
});

// Rótulo + campo + mensagem de erro (ou dica), no padrão de todos os formulários.
export default function Campo({ id, label, error, obrigatorio = true, dica, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-bold text-foreground">
        {label}
        {obrigatorio && <span className="text-danger-text" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className="flex items-center gap-1.5 text-xs font-semibold text-danger-text animate-fadeIn">
          <FaTriangleExclamation aria-hidden="true" />
          {error}
        </p>
      ) : (
        dica && <p className="text-xs text-foreground-muted">{dica}</p>
      )}
    </div>
  );
}
