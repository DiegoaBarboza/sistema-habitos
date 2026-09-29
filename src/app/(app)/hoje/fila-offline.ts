"use client";

import type { EstadoCheckin } from "@/lib/indicadores";

// Check-ins feitos sem conexão ficam no aparelho até a internet voltar.
export type ItemFila = { habitoId: string; dia: string; estado: EstadoCheckin | null };

const CHAVE = "trilho-fila-checkins";
const EVENTO = "trilho-fila";

export function lerFilaBruta(): string {
  try {
    return localStorage.getItem(CHAVE) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseFila(bruta: string): ItemFila[] {
  try {
    const v = JSON.parse(bruta);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function gravar(fila: ItemFila[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(fila));
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}

// O último toque no mesmo hábito e dia vale.
export function enfileirar(item: ItemFila) {
  const fila = parseFila(lerFilaBruta()).filter((i) => !(i.habitoId === item.habitoId && i.dia === item.dia));
  gravar([...fila, item]);
}

export function remover(item: ItemFila) {
  gravar(parseFila(lerFilaBruta()).filter((i) => !(i.habitoId === item.habitoId && i.dia === item.dia)));
}

export function assinarFila(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

export function assinarConexao(avisar: () => void) {
  window.addEventListener("online", avisar);
  window.addEventListener("offline", avisar);
  return () => {
    window.removeEventListener("online", avisar);
    window.removeEventListener("offline", avisar);
  };
}
