import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { focoDoInventario, normalizar, type Contexto, type HabitoCtx } from "@/lib/exercicios/regras";

// O que os exercícios das semanas 2 a 8 precisam saber: hábitos ativos e o hábito-foco da semana 1.
export async function carregarContexto(supabase: SupabaseClient): Promise<Contexto> {
  const [habitos, inventario] = await Promise.all([
    supabase
      .from("habitos")
      .select("id, nome, tipo")
      .eq("ativo", true)
      .order("criado_em")
      .returns<HabitoCtx[]>(),
    supabase.from("progresso_licao").select("respostas").eq("licao_id", "habitos-s1").maybeSingle(),
  ]);
  if (habitos.error) throw new Error(habitos.error.message);
  if (inventario.error) throw new Error(inventario.error.message);

  const semHabitos: Contexto = { habitos: [], foco: null };
  const foco = inventario.data
    ? focoDoInventario(normalizar("inventario", inventario.data.respostas, semHabitos))
    : null;

  return { habitos: habitos.data, foco };
}
