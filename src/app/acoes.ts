"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { ehTema } from "@/lib/tema";

const HORARIOS_LEMBRETE = ["07:00", "12:30", "18:30", "21:00"];
const FUSO_PADRAO = "America/Sao_Paulo";

async function usuarioAtual() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/entrar");
  return { supabase, userId: data.claims.sub };
}

function fusoValido(fuso: string) {
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: fuso });
    return fuso;
  } catch {
    return FUSO_PADRAO;
  }
}

export async function salvarTema(tema: string) {
  if (!ehTema(tema)) throw new Error("Tema inválido");
  const { supabase, userId } = await usuarioAtual();
  const { error } = await supabase.from("perfis").update({ tema }).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function concluirOnboarding(dados: { nome: string; hora: string; fuso: string }) {
  const nome = dados.nome.trim().slice(0, 40);
  if (!nome) throw new Error("Nome obrigatório");
  if (!HORARIOS_LEMBRETE.includes(dados.hora)) throw new Error("Horário inválido");

  const { supabase, userId } = await usuarioAtual();
  const { error } = await supabase
    .from("perfis")
    .update({
      nome,
      lembrete_hora: dados.hora,
      fuso: fusoValido(dados.fuso),
      onboarding_ok: true,
    })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/entrar");
}
