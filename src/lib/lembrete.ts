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

// null = não enviar agora.
export function montarLembrete({ agora, fuso, lembreteHora, enviadoEm, habitos, checkins }: Entrada): string | null {
  const dia = diaNoFuso(agora, fuso);
  if (enviadoEm === dia) return null; // no máximo 1 por dia

  const [h, m] = lembreteHora.split(":").map(Number);
  const alvo = h * 60 + m;
  const atual = minutosNoFuso(agora, fuso);
  if (atual < alvo || atual >= alvo + JANELA_MIN) return null;

  const base = { habitos, checkins, fuso };
  const { feitos, previstos } = hoje(base, dia);
  if (previstos === 0 || feitos >= previstos) return null; // nada pendente hoje

  const emRisco = habitos.find((h) => h.aviso_falha && falhouOntem(base, h, dia));
  if (emRisco) return `Hoje é dia de não falhar 2x: ${emRisco.nome}.`;
  return `Check-in de hoje: ${feitos} de ${previstos} feitos.`;
}
