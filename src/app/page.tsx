import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteTrilho } from "@/components/site/site-trilho";
import { criarClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Trilho · Hábito é processo. Processo se mede.",
  description:
    "App pra construir hábitos em 8 semanas: uma ferramenta por semana, check-in de 10 segundos por dia e números que mostram se está funcionando.",
};

// Quem já entrou vai direto pro app; quem chega pelo endereço vê o site.
export default async function Inicio() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/hoje");
  return <SiteTrilho urlCompra={process.env.URL_PAGINA_VENDA ?? null} />;
}
