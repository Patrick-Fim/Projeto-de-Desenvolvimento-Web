import Link from 'next/link';
import { FaEarthAmericas } from 'react-icons/fa6';

// Marca da aplicação, usada no cabeçalho e no rodapé.
export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Protetores da Terra, página inicial"
      className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#0096C7] to-[#2E7D32] text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:rotate-12">
        <FaEarthAmericas aria-hidden="true" className="text-lg" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[15px] font-extrabold text-foreground">
          Protetores
        </span>
        <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-primary-text">
          da Terra
        </span>
      </span>
    </Link>
  );
}
