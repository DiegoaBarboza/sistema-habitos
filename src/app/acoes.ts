"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { SENHA_MIN } from "@/lib/senha";
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

// Depois do primeiro acesso pelo link, a pessoa pode criar uma senha no Perfil.
export async function entrarComSenha(email: string, senha: string): Promise<{ erro: string | null }> {
  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
  if (error) {
    if (error.status === 429) return { erro: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo." };
    if (error.code === "invalid_credentials") {
      return { erro: "E-mail ou senha incorretos. Ainda não criou uma senha? Entre pelo link de acesso." };
    }
    return { erro: "Não foi possível entrar. Confira a conexão e tente de novo." };
  }
  await supabase.rpc("vincular_acessos");
  return { erro: null };
}

export async function definirSenha(senha: string): Promise<{ erro: string | null }> {
  if (senha.length < SENHA_MIN) return { erro: `A senha precisa ter pelo menos ${SENHA_MIN} caracteres.` };
  const { supabase } = await usuarioAtual();
  const { error } = await supabase.auth.updateUser({ password: senha, data: { tem_senha: true } });
  if (error) {
    if (error.code === "same_password") return { erro: "Essa já é a sua senha atual." };
    if (error.code === "weak_password") return { erro: "Senha fraca. Use uma senha mais longa ou menos óbvia." };
    if (error.code === "reauthentication_needed") {
      return { erro: "Por segurança, saia e entre de novo pelo link de acesso antes de trocar a senha." };
    }
    return { erro: "Não foi possível salvar a senha. Confira a conexão e tente de novo." };
  }
  // Renova o token para que o Perfil já mostre "Trocar senha".
  await supabase.auth.refreshSession();
  revalidatePath("/perfil");
  return { erro: null };
}

export async function sair() {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/entrar");
}
