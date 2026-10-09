// Campo de busca reutilizável. Ícone vem da central de ícones.
import { Icones } from "@/components/icons";

export function CampoBusca({
  value,
  onChange,
  placeholder = "Buscar...",
  rotulo = "Buscar",
  ...props
}) {
  const IconeBusca = Icones.search;

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="campo-busca" className="sr-only">
        {rotulo}
      </label>

      <IconeBusca
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />

      <input
        id="campo-busca"
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        {...props}
      />
    </div>
  );
}
