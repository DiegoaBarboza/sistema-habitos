"use client";

import { useEffect } from "react";
import { useTema } from "@/components/tema-provider";
import type { Tema } from "@/lib/tema";

// O perfil é a fonte da verdade; o localStorage só evita o flash na carga.
// Num aparelho novo, traz a escolha salva no perfil para este navegador.
export function SincronizarTema({ temaDoPerfil }: { temaDoPerfil: Tema }) {
  const { tema, setTema } = useTema();

  useEffect(() => {
    if (temaDoPerfil !== tema) setTema(temaDoPerfil);
    // Só quando o perfil muda; trocar o tema local não deve disparar de novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temaDoPerfil]);

  return null;
}
