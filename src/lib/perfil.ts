import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
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

  const { data: perfil, error } = await supabase
    .from("perfis")
    .select("user_id, nome, tema, fuso, lembrete_ativo, lembrete_hora, onboarding_ok")
    .eq("user_id", claims.sub)
    .single<Perfil>();
  if (error) throw new Error(`Não foi possível carregar o perfil: ${error.message}`);

  return { email: (claims.email as string | undefined) ?? "", perfil };
});

export function iniciais(nome: string | null, email: string) {
  const base = nome?.trim() || email.split("@")[0];
  const partes = base.split(/\s+/).filter(Boolean);
  const letras = partes.length > 1 ? partes[0][0] + partes[partes.length - 1][0] : base.slice(0, 2);
  return letras.toUpperCase();
}
