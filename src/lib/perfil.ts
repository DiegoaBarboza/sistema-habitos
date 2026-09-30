import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { MODULO_ATUAL } from "@/lib/modulo";
import type { Tema } from "@/lib/tema";

export type Perfil = {
  user_id: string;
  nome: string | null;
  tema: Tema;
  fuso: string;
  lembrete_ativo: boolean;
  lembrete_hora: string;
  onboarding_ok: boolean;
};

// Uma consulta por requisição, mesmo chamada do layout e da página.
export const obterSessao = cache(async () => {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/entrar");

  const [{ data: perfil, error }, { data: acessos, error: erroAcessos }] = await Promise.all([
    supabase
      .from("perfis")
      .select("user_id, nome, tema, fuso, lembrete_ativo, lembrete_hora, onboarding_ok")
      .eq("user_id", claims.sub)
      .single<Perfil>(),
    // A RLS já limita aos acessos do próprio usuário (por user_id ou e-mail).
    supabase.from("acessos").select("modulo_id").eq("status", "ativo"),
  ]);
  if (error) throw new Error(`Não foi possível carregar o perfil: ${error.message}`);
  if (erroAcessos) throw new Error(`Não foi possível carregar os acessos: ${erroAcessos.message}`);

  return {
    email: (claims.email as string | undefined) ?? "",
    temSenha: claims.user_metadata?.tem_senha === true,
    perfil,
    modulosLiberados: acessos.map((a) => a.modulo_id as string),
  };
});

// Para as telas do módulo atual: sem acesso vai para /sem-acesso.
export async function exigirModulo() {
  const sessao = await obterSessao();
  if (!sessao.modulosLiberados.includes(MODULO_ATUAL)) redirect("/sem-acesso");
  return sessao;
}

export function iniciais(nome: string | null, email: string) {
  const base = nome?.trim() || email.split("@")[0];
  const partes = base.split(/\s+/).filter(Boolean);
  const letras = partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : base.slice(0, 2);
  return letras.toUpperCase();
}
