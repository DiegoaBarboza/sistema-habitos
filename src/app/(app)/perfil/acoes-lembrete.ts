"use server";

import { revalidatePath } from "next/cache";
import { exigirModulo } from "@/lib/perfil";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function salvarLembrete(dados: { ativo: boolean; hora: string }) {
  const { perfil } = await exigirModulo();
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(dados.hora)) throw new Error("Horário inválido");
  const supabase = await criarClienteServidor();
  const { error } = await supabase
    .from("perfis")
    .update({ lembrete_ativo: dados.ativo, lembrete_hora: dados.hora })
    .eq("user_id", perfil.user_id);
  if (error) throw new Error(error.message);
  revalidatePath("/perfil");
}

export async function inscreverPush(inscricao: { endpoint: string; keys: { p256dh: string; auth: string } }) {
  const { perfil } = await exigirModulo();
  if (!inscricao?.endpoint?.startsWith("https://") || !inscricao.keys?.p256dh || !inscricao.keys?.auth) {
    throw new Error("Inscrição inválida");
  }
  const supabase = await criarClienteServidor();
  // O mesmo aparelho pode trocar de conta: a inscrição vai para quem está logado agora.
  await supabase.from("push_inscricoes").delete().eq("endpoint", inscricao.endpoint);
  const { error } = await supabase.from("push_inscricoes").insert({
    user_id: perfil.user_id,
    endpoint: inscricao.endpoint,
    chaves: { p256dh: inscricao.keys.p256dh, auth: inscricao.keys.auth },
  });
  if (error) throw new Error(error.message);
}

export async function cancelarPush(endpoint: string) {
  await exigirModulo();
  const supabase = await criarClienteServidor();
  const { error } = await supabase.from("push_inscricoes").delete().eq("endpoint", endpoint);
  if (error) throw new Error(error.message);
}
