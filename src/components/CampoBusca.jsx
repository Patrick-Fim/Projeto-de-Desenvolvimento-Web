import { FaMagnifyingGlass } from 'react-icons/fa6';

// Campo de busca padrão (lupa + campo), usado em listas como Amigos.
export default function CampoBusca({ id = 'campo-busca', value, onChange, placeholder = 'Buscar...', rotulo = 'Buscar' }) {
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">{rotulo}</label>
      <FaMagnifyingGlass
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
