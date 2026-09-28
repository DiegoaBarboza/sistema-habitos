import { notFound, redirect } from "next/navigation";
import { diaNoFuso } from "@/lib/datas";
import { normalizar } from "@/lib/exercicios/regras";
import { carregarDados } from "@/lib/hoje";
import { adesao, semFalha2x, somarDias } from "@/lib/indicadores";
import { carregarContexto } from "@/lib/licao-contexto";
import { exigirModuloHabitos } from "@/lib/perfil";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterTrilha } from "@/lib/trilha";
import { LicaoTela } from "./licao-tela";

export default async function Licao({ params }: PageProps<"/licao/[id]">) {
  const { id } = await params;
  const { perfil } = await exigirModuloHabitos();
  if (!perfil.onboarding_ok) redirect("/boas-vindas");

  const trilha = await obterTrilha();
  const semana = trilha.find((s) => s.licao.id === id);
  if (!semana) notFound();
  if (semana.estado === "bloqueada") redirect("/trilha");

  const supabase = await criarClienteServidor();
  const ctx = await carregarContexto(supabase);
  const { licao, progresso } = semana;

  // Semana 4: âncoras sugeridas a partir do inventário (itens + e =).
  const inventario = trilha.find((s) => s.licao.tipo_exercicio === "inventario")?.progresso?.respostas;
  const sugestoesAncora =
    licao.tipo_exercicio === "encadeamento"
      ? normalizar("inventario", inventario, ctx)
          .itens.filter((i) => i.texto.trim() && (i.classificacao === "+" || i.classificacao === "="))
          .map((i) => i.texto.trim())
      : [];

  // Semana 8: adesão e sem falha 2x de cada hábito nos últimos 30 dias.
  let dados30d = {};
  if (licao.tipo_exercicio === "contrato_revisao") {
    const { habitos, checkins } = await carregarDados();
    const hoje = diaNoFuso(new Date(), perfil.fuso);
    const inicio = somarDias(hoje, -29);
    dados30d = Object.fromEntries(
      ctx.habitos.map((c) => {
        const h = habitos.filter((x) => x.id === c.id);
        const base = { habitos: h, checkins: checkins.filter((k) => k.habito_id === c.id), fuso: perfil.fuso };
        return [c.id, { adesao: adesao(base, inicio, hoje).taxa, semFalha2x: semFalha2x(base, hoje).atual }];
      }),
    );
  }

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
