"use client";

import { useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { CampoBusca } from "@/components/ui/CampoBusca";
import { Icones } from "@/components/icons";

export default function Home() {
  const [busca, setBusca] = useState("");

  const variantes = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
  ];

  const IconeAddUser = Icones.addUser;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 p-8">
      <h1 className="text-3xl font-bold text-primary">Design System</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Botões</h2>
        <div className="flex flex-wrap gap-3">
          {variantes.map((v) => (
            <Botao key={v} variante={v}>
              {v}
            </Botao>
          ))}
        </div>
        <div>
          <Botao variante="primary">
            <IconeAddUser aria-hidden="true" />
            Botão com ícone
          </Botao>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Campo de busca</h2>
        <CampoBusca
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar..."
        />
        <p className="text-sm text-zinc-500">
          Você digitou: <strong>{busca || "nada ainda"}</strong>
        </p>
      </section>
    </main>
  );
}
