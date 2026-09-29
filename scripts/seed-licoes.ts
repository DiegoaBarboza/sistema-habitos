// Carrega as 8 lições de docs/conteudo-modulo1-habitos.md na tabela licoes.
// Uso: npm run seed-licoes   (rode de novo sempre que o arquivo de conteúdo mudar)
// Precisa de NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.

import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { lerLicoes } from "../src/lib/conteudo/ler-licoes.ts";
import { MODULO_ATUAL } from "../src/lib/modulo.ts";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !chave) {
  const faltando = [!url && "NEXT_PUBLIC_SUPABASE_URL", !chave && "SUPABASE_SERVICE_ROLE_KEY"].filter(Boolean);
  console.error(`Falta no .env.local: ${faltando.join(" e ")}`);
  process.exit(1);
}

const markdown = readFileSync(new URL("../docs/conteudo-modulo1-habitos.md", import.meta.url), "utf8");
const licoes = lerLicoes(markdown, MODULO_ATUAL);

const supabase = createClient(url, chave, { auth: { persistSession: false } });
const { error } = await supabase.from("licoes").upsert(licoes, { onConflict: "id" });

if (error) {
  console.error(`Não foi possível gravar as lições: ${error.message}`);
  process.exit(1);
}

for (const l of licoes) console.log(`Semana ${l.semana} · ${l.titulo} (${l.tipo_exercicio}, ${l.duracao_min} min)`);
console.log(`${licoes.length} lições gravadas.`);
