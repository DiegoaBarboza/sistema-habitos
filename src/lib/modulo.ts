// O app serve hoje um módulo por vez. Módulos são dados (tabelas modulos e acessos);
// este é o único lugar do código que diz qual deles as telas Hoje, Semanas e Progresso mostram.
export const MODULO_ATUAL = "habitos";

export type Modulo = { id: string; titulo: string; ordem: number };
