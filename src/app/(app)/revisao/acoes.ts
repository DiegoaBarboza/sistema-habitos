"use server";

import { revalidatePath } from "next/cache";
import { diaNoFuso } from "@/lib/datas";
import { somarDias } from "@/lib/indicadores";
import { exigirModulo } from "@/lib/perfil";
import { proximaRevisao } from "@/lib/progresso";
import { criarClienteServidor } from "@/lib/supabase/server";

type Decisao = "manter" | "ajustar" | "remover";
const DECISOES: Decisao[] = ["manter", "ajustar", "remover"];

// Revisão mensal (seção 7): grava a revisão, agenda a próxima para 30 dias e tira do check-in o que foi removido.
export async function salvarRevisaoMensal(decisoes: Record<string, { decisao: string; nota: string }>) {
  const { perfil } = await exigirModulo();
  const revisao = await proximaRevisao(perfil.fuso);
  if (!revisao || revisao.dias > 0) throw new Error("A revisão mensal ainda não está disponível");

  const supabase = await criarClienteServidor();
  const { data: ativos, error } = await supabase.from("habitos").select("id").eq("ativo", true);
  if (error) throw new Error(error.message);

  const dados = ativos.map((h) => {
    const d = decisoes[h.id];
    if (!d || !DECISOES.includes(d.decisao as Decisao)) throw new Error("Revise todos os hábitos");
    return { habito_id: h.id, decisao: d.decisao, nota: d.decisao === "ajustar" ? d.nota.trim().slice(0, 120) : "" };
  });

  const agora = new Date();
  const hoje = diaNoFuso(agora, perfil.fuso);
  const inserido = await supabase
    .from("revisoes")
    .insert({ user_id: perfil.user_id, tipo: "mensal", dados, proxima_em: somarDias(hoje, 30) });
  if (inserido.error) throw new Error(inserido.error.message);

  const remover = dados.filter((d) => d.decisao === "remover").map((d) => d.habito_id);
  if (remover.length) {
    const r = await supabase
      .from("habitos")
      .update({ ativo: false, removido_em: agora.toISOString() })
      .in("id", remover)
      .eq("ativo", true);
    if (r.error) throw new Error(r.error.message);
  }

  revalidatePath("/", "layout");
}
