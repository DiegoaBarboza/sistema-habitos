"use client";

import { useEffect } from "react";

// Em desenvolvimento o cache atrapalharia ver as mudanças; o service worker só entra no build de produção.
export function RegistrarSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}

// Antes de sair: apaga as páginas salvas e cancela o push deste aparelho para esta conta.
export async function limparAparelho(cancelar: (endpoint: string) => Promise<void>) {
  if (!("serviceWorker" in navigator)) return;
  const registro = await navigator.serviceWorker.getRegistration();
  registro?.active?.postMessage("limpar");
  const inscricao = await registro?.pushManager.getSubscription();
  if (inscricao) {
    await cancelar(inscricao.endpoint).catch(() => {});
    await inscricao.unsubscribe().catch(() => {});
  }
}
