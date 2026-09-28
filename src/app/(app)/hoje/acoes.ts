"use server";

import { revalidatePath } from "next/cache";
import { diaNoFuso } from "@/lib/datas";
import { previstoNoDia, somarDias, type EstadoCheckin } from "@/lib/indicadores";
import { exigirModuloHabitos } from "@/lib/perfil";
import { criarClienteServidor } from "@/lib/supabase/server";

const ESTADOS: EstadoCheckin[] = ["feito", "minimo", "nao_feito"];

// estado null = volta para pendente (apaga o registro).
export async function registrarCheckin(habitoId: string, dia: string, estado: EstadoCheckin | null) {
  const { perfil } = await exigirModuloHabitos();
  if (estado !== null && !ESTADOS.includes(estado)) throw new Error("Estado inválido");

  // Só hoje e ontem, no fuso do usuário; dias mais antigos ficam travados.
  const hoje = diaNoFuso(new Date(), perfil.fuso);
  if (dia !== hoje && dia !== somarDias(hoje, -1)) throw new Error("Só dá para registrar hoje ou ontem");

  const supabase = await criarClienteServidor();
  const { data: habito, error: erroHabito } = await supabase
    .from("habitos")
    .select("id, criado_em, removido_em")
    .eq("id", habitoId)
    .single();
  if (erroHabito || !habito) throw new Error("Hábito não encontrado");
  if (!previstoNoDia(habito, dia, perfil.fuso)) throw new Error("Hábito não previsto nesse dia");

  const { error } =
    estado === null
      ? await supabase.from("checkins").delete().eq("habito_id", habitoId).eq("dia", dia)
      : await supabase.from("checkins").upsert(
          {
            user_id: perfil.user_id,
            habito_id: habitoId,
            dia,
            estado,
            registrado_em: new Date().toISOString(),
          },
          { onConflict: "habito_id,dia" },
        );
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export async function marcarAjuste(id: string, aplicado: boolean) {
  await exigirModuloHabitos();
  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("ajustes_ambiente").update({ aplicado }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/hoje");
}
