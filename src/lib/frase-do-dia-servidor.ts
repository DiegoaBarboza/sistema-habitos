import "server-only";
import type { Frase } from "@/lib/conteudo/ler-licoes";
import { diaNoFuso } from "@/lib/datas";
import { temaDoDia, type TemaArte } from "@/lib/frase-arte";
import { diaDaJornada, indiceDaFrase } from "@/lib/frase-do-dia";
import { obterSessao } from "@/lib/perfil";
import { obterSemanas } from "@/lib/semanas";
import { criarClienteServidor } from "@/lib/supabase/server";

export type FraseMostrada = { licaoId: string; indice: number; frase: Frase; dia: number; tema: TemaArte };

// A frase de hoje vem da semana em andamento (ou da última concluída) e fica registrada em Minhas frases.
export async function obterFraseDoDia(): Promise<FraseMostrada | null> {
  const [{ perfil }, semanas] = await Promise.all([obterSessao(), obterSemanas()]);
  const hoje = diaNoFuso(new Date(), perfil.fuso);
  const dia = (instante: string | null | undefined) => (instante ? diaNoFuso(instante, perfil.fuso) : hoje);

  const alvo =
    semanas.find((s) => s.estado === "atual") ?? [...semanas].reverse().find((s) => s.estado === "concluida") ?? semanas[0];
  const frases = alvo.licao.conteudo.frases ?? [];
  const indice = indiceDaFrase(frases.length, dia(alvo.progresso?.iniciada_em), hoje);
  if (indice === null) return null;

  const diaJornada = diaDaJornada(dia(semanas[0].progresso?.iniciada_em), hoje);
  const supabase = await criarClienteServidor();
  // Se o registro falhar, a frase aparece mesmo assim; ela só não entra em Minhas frases.
  await supabase
    .from("frases_vistas")
    .upsert(
      { licao_id: alvo.licao.id, indice, vista_em: hoje, dia_jornada: diaJornada },
      { onConflict: "user_id,licao_id,indice", ignoreDuplicates: true },
    );

  return { licaoId: alvo.licao.id, indice, frase: frases[indice], dia: diaJornada, tema: temaDoDia(diaJornada) };
}

// Todas as frases já vistas, da mais recente para a mais antiga.
export async function obterFrasesVistas(): Promise<FraseMostrada[]> {
  const supabase = await criarClienteServidor();
  const [semanas, { data, error }] = await Promise.all([
    obterSemanas(),
    supabase
      .from("frases_vistas")
      .select("licao_id, indice, dia_jornada")
      .order("vista_em", { ascending: false })
      .order("indice", { ascending: false }),
  ]);
  if (error) throw new Error(`Não foi possível carregar as frases: ${error.message}`);
  const porLicao = new Map(semanas.map((s) => [s.licao.id, s.licao.conteudo.frases ?? []]));
  return data.flatMap((v) => {
    const frase = porLicao.get(v.licao_id)?.[v.indice];
    return frase ? [{ licaoId: v.licao_id, indice: v.indice, frase, dia: v.dia_jornada, tema: temaDoDia(v.dia_jornada) }] : [];
  });
}
