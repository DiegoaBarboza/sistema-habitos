"use client";

import { useOptimistic, useTransition } from "react";
import type { Ajuste } from "@/lib/hoje";
import { marcarAjuste } from "./acoes";

export function AjustesPendentes({ ajustes }: { ajustes: Ajuste[] }) {
  const [lista, remover] = useOptimistic(ajustes, (atual: Ajuste[], id: string) => atual.filter((a) => a.id !== id));
  const [, iniciar] = useTransition();
  if (!lista.length) return null;

  return (
    <details className="rounded-xl border border-line bg-surface px-4 py-3">
      <summary className="min-h-6 cursor-pointer text-[15px] font-semibold">
        {lista.length} {lista.length === 1 ? "ajuste de ambiente pendente" : "ajustes de ambiente pendentes"}
      </summary>
      <ul className="mt-2 flex flex-col">
        {lista.map((a) => (
          <li key={a.id}>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="size-5 shrink-0 accent-[var(--accent)]"
                onChange={() =>
                  iniciar(async () => {
                    remover(a.id);
                    await marcarAjuste(a.id, true).catch(() => {});
                  })
                }
              />
              {a.texto}
            </label>
          </li>
        ))}
      </ul>
    </details>
  );
}
