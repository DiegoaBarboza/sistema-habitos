import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { focoDoInventario, normalizar, type Contexto, type HabitoCtx } from "@/lib/exercicios/regras";
import { obterSemanas } from "@/lib/semanas";

// O que os exercícios das semanas 2 a 8 precisam saber: hábitos ativos e o hábito-foco do inventário (semana 1).
export async function carregarContexto(supabase: SupabaseClient): Promise<Contexto> {
  const [habitos, semanas] = await Promise.all([
    supabase
      .from("habitos")
      .select("id, nome, tipo")
      .eq("ativo", true)
      .order("criado_em")
      .returns<HabitoCtx[]>(),
    obterSemanas(),
  ]);
  if (habitos.error) throw new Error(habitos.error.message);
  const inventario = semanas.find((s) => s.licao.tipo_exercicio === "inventario")?.progresso;

  const semHabitos: Contexto = { habitos: [], foco: null };
  const foco = inventario
    ? focoDoInventario(normalizar("inventario", inventario.respostas, semHabitos))
    : null;

  return { habitos: habitos.data, foco };
}
