// Regra do lembrete diário (seção 7 do handoff). O agendador chama a cada 15 minutos.

import { diaNoFuso } from "@/lib/datas";
import { falhouOntem, hoje, type CheckinInd, type HabitoInd } from "@/lib/indicadores";

export const JANELA_MIN = 15;

export type HabitoLembrete = HabitoInd & { nome: string; aviso_falha: boolean };

type Entrada = {
  agora: Date;
  fuso: string;
  lembreteHora: string; // "HH:MM" ou "HH:MM:SS"
  enviadoEm: string | null; // dia (fuso do usuário) do último envio
  habitos: HabitoLembrete[];
  checkins: CheckinInd[];
};

function minutosNoFuso(agora: Date, fuso: string) {
  const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: fuso, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .format(agora)
    .split(":")
    .map(Number);
  return h * 60 + m;
}

const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

// texto null = não enviar agora; motivo explica a decisão (usado no diagnóstico da rota).
export function decidirLembrete({ agora, fuso, lembreteHora, enviadoEm, habitos, checkins }: Entrada) {
  const dia = diaNoFuso(agora, fuso);
  if (enviadoEm === dia) return { texto: null, motivo: "já recebeu o lembrete hoje" };

  const [h, m] = lembreteHora.split(":").map(Number);
  const alvo = h * 60 + m;
  const atual = minutosNoFuso(agora, fuso);
  if (atual < alvo || atual >= alvo + JANELA_MIN) {
    return { texto: null, motivo: `fora da janela: agora ${hhmm(atual)} (${fuso}), janela ${hhmm(alvo)}–${hhmm(alvo + JANELA_MIN - 1)}` };
  }

  const base = { habitos, checkins, fuso };
  const { feitos, previstos } = hoje(base, dia);
  if (previstos === 0) return { texto: null, motivo: "nenhum hábito ativo hoje" };
  if (feitos >= previstos) return { texto: null, motivo: "todos os hábitos de hoje já foram feitos" };

  const emRisco = habitos.find((h) => h.aviso_falha && falhouOntem(base, h, dia));
  const texto = emRisco
    ? `Hoje é dia de não falhar 2x: ${emRisco.nome}.`
    : `Check-in de hoje: ${feitos} de ${previstos} feitos.`;
  return { texto, motivo: "enviar" };
}

export function montarLembrete(entrada: Entrada): string | null {
  return decidirLembrete(entrada).texto;
}
