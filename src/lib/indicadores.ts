// Indicadores da seção 7 do handoff. Tudo em "dias" (AAAA-MM-DD) no fuso do usuário.

import { diaNoFuso } from "@/lib/datas";

export type EstadoCheckin = "feito" | "minimo" | "nao_feito";
export type HabitoInd = { id: string; criado_em: string; removido_em: string | null; horario?: string | null };
export type CheckinInd = { habito_id: string; dia: string; estado: EstadoCheckin; registrado_em?: string };

export const META_ADESAO = 0.8;

// ---------- datas ----------

export function somarDias(dia: string, n: number): string {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function diasEntre(inicio: string, fim: string): string[] {
  const dias: string[] = [];
  for (let d = inicio; d <= fim; d = somarDias(d, 1)) dias.push(d);
  return dias;
}

// Segunda-feira da semana do dia (a semana do app vai de segunda a domingo).
export function inicioDaSemana(dia: string): string {
  const semana = new Date(`${dia}T12:00:00Z`).getUTCDay(); // 0 = domingo
  return somarDias(dia, -((semana + 6) % 7));
}

// ---------- base ----------

// Previsto num dia: criado até aquele dia e não removido antes dele (removido no dia 10 sai a partir do dia 10).
export function previstoNoDia(h: HabitoInd, dia: string, fuso: string) {
  if (dia < diaNoFuso(h.criado_em, fuso)) return false;
  return !h.removido_em || dia < diaNoFuso(h.removido_em, fuso);
}

function indexar(checkins: CheckinInd[]) {
  const mapa = new Map<string, CheckinInd>();
  for (const c of checkins) mapa.set(`${c.habito_id}|${c.dia}`, c);
  return (habitoId: string, dia: string) => mapa.get(`${habitoId}|${dia}`);
}

const cumpriu = (c?: CheckinInd) => c?.estado === "feito" || c?.estado === "minimo";

type Base = { habitos: HabitoInd[]; checkins: CheckinInd[]; fuso: string };

// ---------- adesão ----------

export function adesao({ habitos, checkins, fuso }: Base, inicio: string, fim: string) {
  const ver = indexar(checkins);
  let previstos = 0;
  let cumpridos = 0;
  for (const dia of diasEntre(inicio, fim)) {
    for (const h of habitos) {
      if (!previstoNoDia(h, dia, fuso)) continue;
      previstos++;
      if (cumpriu(ver(h.id, dia))) cumpridos++;
    }
  }
  return { previstos, cumpridos, taxa: previstos ? cumpridos / previstos : null };
}

export function hoje(base: Base, dia: string) {
  const { previstos, cumpridos } = adesao(base, dia, dia);
  return { feitos: cumpridos, previstos };
}

// ---------- sem falha 2x ----------

// Dia bom: nenhum hábito previsto falhou nele e no dia anterior (falha = não feito ou sem registro).
function diaBom({ habitos, fuso }: Base, ver: ReturnType<typeof indexar>, dia: string) {
  const ontem = somarDias(dia, -1);
  return habitos.every((h) => {
    if (!previstoNoDia(h, dia, fuso) || !previstoNoDia(h, ontem, fuso)) return true;
    return cumpriu(ver(h.id, dia)) || cumpriu(ver(h.id, ontem));
  });
}

// Conta até ontem; hoje entra se todos os hábitos previstos já tiverem registro.
export function semFalha2x(base: Base, hojeDia: string) {
  const { habitos, checkins, fuso } = base;
  if (!habitos.length) return { atual: 0, recorde: 0 };
  const ver = indexar(checkins);
  const primeiro = habitos.map((h) => diaNoFuso(h.criado_em, fuso)).sort()[0];
  const hojeCompleto = habitos.every((h) => !previstoNoDia(h, hojeDia, fuso) || ver(h.id, hojeDia));
  const fim = hojeCompleto ? hojeDia : somarDias(hojeDia, -1);

  let atual = 0;
  let recorde = 0;
  for (const dia of diasEntre(primeiro, fim)) {
    if (!habitos.some((h) => previstoNoDia(h, dia, fuso))) continue;
    atual = diaBom(base, ver, dia) ? atual + 1 : 0;
    recorde = Math.max(recorde, atual);
  }
  return { atual, recorde };
}

// Hábito que falhou ontem (não feito ou sem registro num dia previsto): hoje é dia de não falhar 2x.
export function falhouOntem(base: Base, habito: HabitoInd, hojeDia: string) {
  const ontem = somarDias(hojeDia, -1);
  if (!previstoNoDia(habito, ontem, base.fuso)) return false;
  return !cumpriu(indexar(base.checkins)(habito.id, ontem));
}

// ---------- outros ----------

export function diasSalvosPeloMinimo({ checkins }: Base, inicio: string, fim: string) {
  return checkins.filter((c) => c.estado === "minimo" && c.dia >= inicio && c.dia <= fim).length;
}

export function checkinsEDiasAtivos({ checkins }: Base, inicio: string, fim: string) {
  const noPeriodo = checkins.filter((c) => cumpriu(c) && c.dia >= inicio && c.dia <= fim);
  return { checkins: noPeriodo.length, diasAtivos: new Set(noPeriodo.map((c) => c.dia)).size };
}

// % no horário (estimativa): "feito" registrado no mesmo dia até 90 min depois do horário planejado.
export function noHorario({ checkins, fuso }: Base, habito: HabitoInd) {
  if (!habito.horario) return null;
  const [hh, mm] = habito.horario.split(":").map(Number);
  const limite = hh * 60 + mm + 90;
  const feitos = checkins.filter((c) => c.habito_id === habito.id && c.estado === "feito" && c.registrado_em);
  if (!feitos.length) return null;
  const hora = new Intl.DateTimeFormat("en-GB", { timeZone: fuso, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const noPrazo = feitos.filter((c) => {
    if (diaNoFuso(c.registrado_em!, fuso) !== c.dia) return false;
    const [h, m] = hora.format(new Date(c.registrado_em!)).split(":").map(Number);
    return h * 60 + m <= limite;
  });
  return noPrazo.length / feitos.length;
}

// Adesão do elo (semana 4): 7 dias depois da corrente − 7 dias antes, em pontos percentuais.
export function adesaoDoElo(base: Base, habito: HabitoInd, diaCorrente: string) {
  const so = { ...base, habitos: [habito] };
  const antes = adesao(so, somarDias(diaCorrente, -7), somarDias(diaCorrente, -1)).taxa;
  const depois = adesao(so, diaCorrente, somarDias(diaCorrente, 6)).taxa;
  if (antes === null || depois === null) return null;
  return Math.round((depois - antes) * 100);
}
