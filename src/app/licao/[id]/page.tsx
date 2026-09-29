import { notFound, redirect } from "next/navigation";
import { normalizar } from "@/lib/exercicios/regras";
import { carregarContexto } from "@/lib/licao-contexto";
import { exigirModulo } from "@/lib/perfil";
import { dadosUltimos30Dias } from "@/lib/progresso";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterSemanas } from "@/lib/semanas";
import { LicaoTela } from "./licao-tela";

export default async function Licao({ params }: PageProps<"/licao/[id]">) {
  const { id } = await params;
  const { perfil } = await exigirModulo();
  if (!perfil.onboarding_ok) redirect("/boas-vindas");

  const semanas = await obterSemanas();
  const semana = semanas.find((s) => s.licao.id === id);
  if (!semana) notFound();
  if (semana.estado === "bloqueada") redirect("/semanas");

  const supabase = await criarClienteServidor();
  const ctx = await carregarContexto(supabase);
  const { licao, progresso } = semana;

  // Semana 4: âncoras sugeridas a partir do inventário (itens + e =).
  const inventario = semanas.find((s) => s.licao.tipo_exercicio === "inventario")?.progresso?.respostas;
  const sugestoesAncora =
    licao.tipo_exercicio === "encadeamento"
      ? normalizar("inventario", inventario, ctx)
          .itens.filter((i) => i.texto.trim() && (i.classificacao === "+" || i.classificacao === "="))
          .map((i) => i.texto.trim())
      : [];

  // Semana 8: adesão e sem falha 2x de cada hábito nos últimos 30 dias.
  const dados30d =
    licao.tipo_exercicio === "contrato_revisao" ? await dadosUltimos30Dias(ctx.habitos.map((h) => h.id)) : {};

  return (
    <LicaoTela
      key={licao.id}
      licao={licao}
      respostasIniciais={normalizar(licao.tipo_exercicio, progresso?.respostas, ctx)}
      iniciada={Boolean(progresso)}
      concluida={progresso?.etapa === "concluida"}
      ctx={ctx}
      sugestoesAncora={sugestoesAncora}
      dados30d={dados30d}
    />
  );
}
