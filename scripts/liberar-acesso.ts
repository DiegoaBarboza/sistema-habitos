// Libera um módulo para um e-mail (testadores e casos manuais).
// Uso: npm run liberar-acesso -- email@exemplo.com [modulo]
// Precisa de NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.

import { createClient } from "@supabase/supabase-js";

const [emailBruto, modulo = "habitos"] = process.argv.slice(2);
const email = emailBruto?.trim().toLowerCase();

if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Uso: npm run liberar-acesso -- email@exemplo.com [modulo]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !chave) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local.");
  process.exit(1);
}

const supabase = createClient(url, chave, { auth: { persistSession: false } });

const { data, error } = await supabase
  .from("acessos")
  .upsert(
    { email, modulo_id: modulo, origem: "manual", status: "ativo" },
    { onConflict: "email,modulo_id" },
  )
  .select("email, modulo_id, origem, status")
  .single();

if (error) {
  const motivo = error.code === "23503" ? `o módulo "${modulo}" não existe` : error.message;
  console.error(`Não foi possível liberar: ${motivo}`);
  process.exit(1);
}

console.log(`Liberado: ${data.email} → ${data.modulo_id} (${data.origem}, ${data.status})`);
