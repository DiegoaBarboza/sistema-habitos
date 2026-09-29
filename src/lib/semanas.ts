import "server-only";
import { cache } from "react";
import type { ConteudoLicao, TipoExercicio } from "@/lib/conteudo/ler-licoes";
import { MODULO_ATUAL } from "@/lib/modulo";
import { obterSessao } from "@/lib/perfil";
import { calcularSemanas, type EstadoSemana } from "@/lib/regras/liberacao";
import { criarClienteServidor } from "@/lib/supabase/server";

export type LicaoResumo = {
  id: string;
  semana: number;
  titulo: string;
  duracao_min: number;
  tipo_exercicio: TipoExercicio;
  conteudo: ConteudoLicao;
};

export type ProgressoLicao = {
  licao_id: string;
  respostas: Record<string, unknown>;
  etapa: "entenda" | "faca" | "compromisso" | "concluida";
  iniciada_em: string | null;
  concluida_em: string | null;
};

export type SemanaDoModulo = EstadoSemana & { licao: LicaoResumo; progresso?: ProgressoLicao };

export const obterSemanas = cache(async () => {
  const { perfil } = await obterSessao();
  const supabase = await criarClienteServidor();

  const [licoes, progresso, checkins] = await Promise.all([
    supabase
      .from("licoes")
      .select("id, semana, titulo, duracao_min, tipo_exercicio, conteudo")
      .eq("modulo_id", MODULO_ATUAL)
      .order("semana")
      .returns<LicaoResumo[]>(),
    supabase
      .from("progresso_licao")
      .select("licao_id, respostas, etapa, iniciada_em, concluida_em")
      .returns<ProgressoLicao[]>(),
    supabase.from("checkins").select("dia").in("estado", ["feito", "minimo"]),
  ]);
  for (const r of [licoes, progresso, checkins]) {
    if (r.error) throw new Error(`Não foi possível carregar as semanas: ${r.error.message}`);
  }
  if (!licoes.data?.length) throw new Error("Nenhuma lição cadastrada. Rode npm run seed-licoes.");

  const porLicao = new Map(progresso.data!.map((p) => [p.licao_id, p]));
  const porSemana = new Map(
    licoes.data.map((l) => {
      const p = porLicao.get(l.id);
      return [l.semana, { iniciadaEm: p?.iniciada_em ?? null, concluidaEm: p?.concluida_em ?? null }];
    }),
  );

  const estados = calcularSemanas({
    progresso: porSemana,
    diasComCheckin: checkins.data!.map((c) => c.dia as string),
    fuso: perfil.fuso,
  });

  return estados.map<SemanaDoModulo>((e) => {
    const licao = licoes.data.find((l) => l.semana === e.semana)!;
    return { ...e, licao, progresso: porLicao.get(licao.id) };
  });
});
