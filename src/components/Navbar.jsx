"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/alistamento", label: "Alistamento" },
  { href: "/planeteers", label: "Planeteers" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-primary">
          Planeteers
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex gap-6">
            {LINKS.map((link) => {
              const ativo = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={ativo ? "page" : undefined}
                    className={`text-sm font-medium transition hover:text-primary ${
                      ativo ? "text-primary" : "text-zinc-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
