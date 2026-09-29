"use client";

import { useTransition } from "react";
import { sair } from "@/app/acoes";
import { limparAparelho } from "@/components/registrar-sw";
import { cancelarPush } from "./acoes-lembrete";

export function BotaoSair() {
  const [saindo, iniciar] = useTransition();
  return (
    <button
      type="button"
      disabled={saindo}
      onClick={() =>
        iniciar(async () => {
          await limparAparelho(cancelarPush).catch(() => {});
          await sair();
        })
      }
      className="w-full cursor-pointer px-4 py-3.5 text-left text-[15px] font-semibold text-warn"
    >
      Sair
    </button>
  );
}
