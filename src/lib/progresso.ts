import "server-only";
import { diaNoFuso } from "@/lib/datas";
import { carregarDados } from "@/lib/hoje";
import {
  adesao,
  adesaoPorSemana,
  checkinsEDiasAtivos,
  diasEntre,
  diasSalvosPeloMinimo,
  mapaDoHabito,
  semFalha2x,
  somarDias,
} from "@/lib/indicadores";
import { obterSemanas } from "@/lib/semanas";
import { criarClienteServidor } from "@/lib/supabase/server";

export const PERIODOS = ["7d", "30d", "tudo"] as const;
export type Periodo = (typeof PERIODOS)[number];

// Próxima revisão mensal: existe depois de concluir a última semana (o contrato agenda a primeira).
export async function proximaRevisao(fuso: string) {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("revisoes")
    .select("proxima_em")
    .eq("tipo", "mensal")
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data?.proxima_em) return null;
  const hoje = diaNoFuso(new Date(), fuso);
  const dias = Math.round((Date.parse(data.proxima_em) - Date.parse(hoje)) / 86_400_000);
  return { data: data.proxima_em as string, dias: Math.max(0, dias) };
}

export async function obterProgresso(periodo: Periodo) {
  const [{ perfil, habitos, checkins }, semanas] = await Promise.all([carregarDados(), obterSemanas()]);
  const fuso = perfil.fuso;
  const hoje = diaNoFuso(new Date(), fuso);
  const base = { habitos, checkins, fuso };

  const primeiroDia = habitos.map((h) => diaNoFuso(h.criado_em, fuso)).sort()[0] ?? hoje;
  const inicio = periodo === "7d" ? somarDias(hoje, -6) : periodo === "30d" ? somarDias(hoje, -29) : primeiroDia;

  const atual = semanas.find((s) => s.estado === "atual") ?? semanas.find((s) => s.estado === "bloqueada");
  const taxas = adesaoPorSemana(
    base,
    semanas.map((s) => (s.progresso?.iniciada_em ? diaNoFuso(s.progresso.iniciada_em, fuso) : null)),
    hoje,
  );

  const catorze = diasEntre(somarDias(hoje, -13), hoje);
  const ativos = habitos.filter((h) => h.ativo);

  return {
    temHabitos: habitos.length > 0,
    adesao: adesao(base, inicio, hoje),
    desde: inicio,
    semFalha2x: semFalha2x(base, hoje),
    checkins: checkinsEDiasAtivos(base, inicio, hoje),
    minimo: diasSalvosPeloMinimo(base, inicio, hoje),
    porSemana: semanas.map((s, i) => ({ semana: s.semana, taxa: taxas[i], atual: s.semana === atual?.semana })),
    porHabito: ativos.map((h) => {
      const so = { ...base, habitos: [h] };
      return { id: h.id, nome: h.nome, taxa: adesao(so, catorze[0], hoje).taxa, dias: mapaDoHabito(so, h, catorze) };
    }),
    moduloConcluido: semanas.every((s) => s.estado === "concluida"),
    revisao: await proximaRevisao(fuso),
  };
}

// Semana 8 e revisão mensal: adesão e sem falha 2x de cada hábito nos últimos 30 dias.
export async function dadosUltimos30Dias(ids: string[]) {
  const { perfil, habitos, checkins } = await carregarDados();
  const hoje = diaNoFuso(new Date(), perfil.fuso);
  const inicio = somarDias(hoje, -29);
  return Object.fromEntries(
    ids.map((id) => {
      const base = {
        habitos: habitos.filter((h) => h.id === id),
        checkins: checkins.filter((c) => c.habito_id === id),
        fuso: perfil.fuso,
      };
      return [id, { adesao: adesao(base, inicio, hoje).taxa, semFalha2x: semFalha2x(base, hoje).atual }];
    }),
  );
}
