"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
} from "react";
import { CHAVE_TEMA, ehTema, resolverTema, type Tema, type TemaEfetivo } from "@/lib/tema";

type ContextoTema = {
  tema: Tema;
  efetivo: TemaEfetivo;
  sistemaEscuro: boolean;
  setTema: (tema: Tema) => void;
};

const Contexto = createContext<ContextoTema | null>(null);

const ouvintesTema = new Set<() => void>();

function lerTemaSalvo(): Tema {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    return ehTema(salvo) ? salvo : "auto";
  } catch {
    return "auto";
  }
}

function assinarTema(avisar: () => void) {
  ouvintesTema.add(avisar);
  const aoMudarEmOutraAba = (e: StorageEvent) => {
    if (e.key === CHAVE_TEMA) avisar();
  };
  window.addEventListener("storage", aoMudarEmOutraAba);
  return () => {
    ouvintesTema.delete(avisar);
    window.removeEventListener("storage", aoMudarEmOutraAba);
  };
}

const consultaEscuro = "(prefers-color-scheme: dark)";

function assinarSistema(avisar: () => void) {
  const mq = window.matchMedia(consultaEscuro);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const tema = useSyncExternalStore(assinarTema, lerTemaSalvo, () => "auto" as Tema);
  const sistemaEscuro = useSyncExternalStore(
    assinarSistema,
    () => window.matchMedia(consultaEscuro).matches,
    () => true,
  );
  const efetivo = resolverTema(tema, sistemaEscuro);

  // Também reaplica depois do remount do Strict Mode em dev, que limpa o atributo do <html>.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", efetivo);
  }, [efetivo]);

  const setTema = useCallback((novo: Tema) => {
    try {
      localStorage.setItem(CHAVE_TEMA, novo);
    } catch {}
    ouvintesTema.forEach((avisar) => avisar());
  }, []);

  return (
    <Contexto.Provider value={{ tema, efetivo, sistemaEscuro, setTema }}>
      {children}
    </Contexto.Provider>
  );
}

export function useTema() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useTema precisa estar dentro de <TemaProvider>");
  return ctx;
}
