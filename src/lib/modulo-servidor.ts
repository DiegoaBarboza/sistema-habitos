import "server-only";
import { cache } from "react";
import { MODULO_ATUAL, type Modulo } from "@/lib/modulo";
import { criarClienteServidor } from "@/lib/supabase/server";

export const obterModuloAtual = cache(async (): Promise<Modulo> => {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase
    .from("modulos")
    .select("id, titulo, ordem")
    .eq("id", MODULO_ATUAL)
    .single<Modulo>();
  if (error) throw new Error(`Não foi possível carregar o módulo: ${error.message}`);
  return data;
});
