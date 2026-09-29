import { diaNoFuso } from "@/lib/datas";

export const TOTAL_SEMANAS = 8;
export const CHECKINS_PARA_LIBERAR = 5;

export type ProgressoSemana = { iniciadaEm: string | null; concluidaEm: string | null };

export type EstadoSemana = {
  semana: number;
  estado: "concluida" | "atual" | "bloqueada";
  // Só na primeira semana bloqueada: o que falta para liberar.
  motivo?: string;
};

type Entrada = {
  progresso: Map<number, ProgressoSemana>;
  // Dias distintos (AAAA-MM-DD, fuso do usuário) com check-in feito ou mínimo.
  diasComCheckin: string[];
  fuso: string;
};

// Seção 7 do handoff: S1 livre; S2 após concluir S1; SN (3–8) após concluir S(N−1)
// e ter 5 dias distintos com check-in desde que S(N−1) foi iniciada.
export function calcularSemanas({ progresso, diasComCheckin, fuso }: Entrada): EstadoSemana[] {
  const concluida = (n: number) => Boolean(progresso.get(n)?.concluidaEm);

  const checkinsDesdeInicio = (n: number) => {
    const inicio = progresso.get(n)?.iniciadaEm;
    if (!inicio) return 0;
    const desde = diaNoFuso(inicio, fuso);
    return new Set(diasComCheckin.filter((d) => d >= desde)).size;
  };

  const liberada = (n: number) => {
    if (n === 1) return true;
    if (n === 2) return concluida(1);
    return concluida(n - 1) && checkinsDesdeInicio(n - 1) >= CHECKINS_PARA_LIBERAR;
  };

  const semanas: EstadoSemana[] = [];
  let jaTemAtual = false;
  let jaExplicouBloqueio = false;

  for (let n = 1; n <= TOTAL_SEMANAS; n++) {
    if (concluida(n)) {
      semanas.push({ semana: n, estado: "concluida" });
    } else if (liberada(n) && !jaTemAtual) {
      semanas.push({ semana: n, estado: "atual" });
      jaTemAtual = true;
    } else {
      const item: EstadoSemana = { semana: n, estado: "bloqueada" };
      if (!jaExplicouBloqueio) {
        item.motivo = motivoDoBloqueio(n, concluida(n - 1), checkinsDesdeInicio(n - 1));
        jaExplicouBloqueio = true;
      }
      semanas.push(item);
    }
  }
  return semanas;
}

function motivoDoBloqueio(n: number, anteriorConcluida: boolean, checkins: number) {
  if (n === 2) return "Libera ao concluir a semana 1";
  const contador = `${Math.min(checkins, CHECKINS_PARA_LIBERAR)}/${CHECKINS_PARA_LIBERAR}`;
  if (anteriorConcluida) return `Libera com ${CHECKINS_PARA_LIBERAR} check-ins (${contador})`;
  return `Libera ao concluir a semana ${n - 1} + ${CHECKINS_PARA_LIBERAR} check-ins (${contador})`;
}
