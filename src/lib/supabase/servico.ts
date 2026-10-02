import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente com a chave de serviço: ignora a RLS. Só pra rotas do servidor que não têm usuário logado.
export function criarClienteServico() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
