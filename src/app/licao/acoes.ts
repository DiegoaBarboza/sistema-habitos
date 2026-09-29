"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { TipoExercicio } from "@/lib/conteudo/ler-licoes";
import { diaNoFuso } from "@/lib/datas";
import {
  alavancas,
  cartoesAmbiente,
  correntesCompletas,
  etapaAtual,
  HABITO_NOVO,
  normalizar,
  podeConcluir,
  type Contexto,
  type Respostas,
} from "@/lib/exercicios/regras";
import { carregarContexto } from "@/lib/licao-contexto";
import { MODULO_ATUAL } from "@/lib/modulo";
import { obterSessao } from "@/lib/perfil";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterSemanas } from "@/lib/semanas";

type Interno = Record<string, unknown>;

async function prepararLicao(licaoId: string) {
  const { perfil } = await obterSessao();
  const semana = (await obterSemanas()).find((s) => s.licao.id === licaoId);
  if (!semana || semana.estado === "bloqueada") throw new Error("Lição indisponível");
  const supabase = await criarClienteServidor();
  return { perfil, semana, supabase };
}

export async function iniciarLicao(licaoId: string) {
  const { perfil, supabase } = await prepararLicao(licaoId);
  const { error } = await supabase
    .from("progresso_licao")
    .upsert({ user_id: perfil.user_id, licao_id: licaoId }, { onConflict: "user_id,licao_id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
  revalidatePath("/semanas");
}

// Salvamento automático. Chaves "_" (ids gravados na conclusão) nunca vêm do navegador.
export async function salvarRespostas(licaoId: string, respostas: unknown) {
  const { perfil, semana, supabase } = await prepararLicao(licaoId);
  const tipo = semana.licao.tipo_exercicio;
  const ctx = await carregarContexto(supabase);
  const limpas = normalizar(tipo, respostas, ctx);
  const anteriores = (semana.progresso?.respostas ?? {}) as Interno;

  const concluida = semana.progresso?.etapa === "concluida";
  const { error } = await supabase
    .from("progresso_licao")
    .upsert(
      {
        user_id: perfil.user_id,
        licao_id: licaoId,
        respostas: { ...limpas, ...internas(anteriores) },
        etapa: concluida ? "concluida" : etapaAtual(tipo, limpas, ctx),
      },
      { onConflict: "user_id,licao_id" },
    );
  if (error) throw new Error(error.message);
}

export async function concluirLicao(licaoId: string, respostas: unknown) {
  const { perfil, semana, supabase } = await prepararLicao(licaoId);
  const tipo = semana.licao.tipo_exercicio;
  const ctx = await carregarContexto(supabase);
  const limpas = normalizar(tipo, respostas, ctx);
  if (!podeConcluir(tipo, limpas, ctx)) throw new Error("Exercício incompleto");

  const anteriores = internas((semana.progresso?.respostas ?? {}) as Interno);
  const novasInternas = await aplicarEfeito(supabase, perfil.user_id, perfil.fuso, tipo, limpas, ctx, anteriores);

  const { error } = await supabase.from("progresso_licao").upsert(
    {
      user_id: perfil.user_id,
      licao_id: licaoId,
      respostas: { ...limpas, ...anteriores, ...novasInternas },
      etapa: "concluida",
      // Reabrir e editar não muda a data original de conclusão.
      concluida_em: semana.progresso?.concluida_em ?? new Date().toISOString(),
    },
    { onConflict: "user_id,licao_id" },
  );
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

function internas(r: Interno): Interno {
  return Object.fromEntries(Object.entries(r).filter(([k]) => k.startsWith("_")));
}

function falhou(r: { error: { message: string } | null }) {
  if (r.error) throw new Error(r.error.message);
}

// Seção 8 do handoff, coluna "Efeito ao concluir".
async function aplicarEfeito(
  supabase: SupabaseClient,
  userId: string,
  fuso: string,
  tipo: TipoExercicio,
  respostas: Respostas[TipoExercicio],
  ctx: Contexto,
  anteriores: Interno,
): Promise<Interno> {
  switch (tipo) {
    case "inventario":
      // O foco fica nas próprias respostas da semana 1 e é lido pelas semanas seguintes.
      return {};

    case "identidade": {
      const r = respostas as Respostas["identidade"];
      const ids = Array.isArray(anteriores._habito_ids) ? [...(anteriores._habito_ids as string[])] : [];
      for (let i = 0; i < 3; i++) {
        const dados = { nome: r.evidencias[i].texto.trim(), foco: r.foco_evidencia === i };
        if (ids[i]) {
          falhou(await supabase.from("habitos").update(dados).eq("id", ids[i]));
        } else {
          const novo = await supabase
            .from("habitos")
            .insert({ ...dados, user_id: userId, modulo_id: MODULO_ATUAL })
            .select("id")
            .single();
          falhou(novo);
          ids[i] = novo.data!.id;
        }
      }
      return { _habito_ids: ids };
    }

    case "plano_gatilho": {
      const r = respostas as Respostas["plano_gatilho"];
      for (const h of ctx.habitos) {
        const p = r.planos[h.id];
        falhou(
          await supabase
            .from("habitos")
            .update({ horario: p.horario, lugar: p.lugar.trim(), ancora: p.depois_de.trim() })
            .eq("id", h.id),
        );
      }
      return {};
    }

    case "encadeamento": {
      const r = respostas as Respostas["encadeamento"];
      const novos = { ...((anteriores._novos as Record<string, string>) ?? {}) };
      const datas = { ...((anteriores._correntes_em as Record<string, string>) ?? {}) };
      const hoje = diaNoFuso(new Date(), fuso);
      for (const [i, c] of r.correntes.entries()) {
        if (!correntesCompletas({ ...r, correntes: [c] }).length) continue;
        const chave = String(i);
        datas[chave] ??= hoje;
        if (c.habito === HABITO_NOVO) {
          if (novos[chave]) {
            falhou(await supabase.from("habitos").update({ nome: c.novo_nome.trim(), ancora: c.ancora }).eq("id", novos[chave]));
          } else {
            const novo = await supabase
              .from("habitos")
              .insert({ user_id: userId, modulo_id: MODULO_ATUAL, nome: c.novo_nome.trim(), ancora: c.ancora })
              .select("id")
              .single();
            falhou(novo);
            novos[chave] = novo.data!.id;
          }
        } else {
          falhou(await supabase.from("habitos").update({ ancora: c.ancora }).eq("id", c.habito));
        }
      }
      return { _novos: novos, _correntes_em: datas };
    }

    case "ambiente": {
      const r = respostas as Respostas["ambiente"];
      const linhas = cartoesAmbiente(ctx).flatMap((cartao) =>
        r.acoes[cartao.chave]
          .map((a, i) => ({ a, alavanca: alavancas(cartao.tipo)[i] }))
          .filter(({ a }) => a.texto.trim())
          .map(({ a, alavanca }) => ({
            id: a.id,
            user_id: userId,
            habito_id: cartao.habitoId,
            alavanca,
            texto: a.texto.trim(),
            aplicado: a.aplicado,
          })),
      );
      falhou(await supabase.from("ajustes_ambiente").upsert(linhas, { onConflict: "id" }));
      const manter = linhas.map((l) => l.id);
      falhou(await supabase.from("ajustes_ambiente").delete().eq("user_id", userId).not("id", "in", `(${manter.join(",")})`));
      return {};
    }

    case "versao_minima": {
      const r = respostas as Respostas["versao_minima"];
      for (const h of ctx.habitos) {
        falhou(await supabase.from("habitos").update({ versao_minima: r.minimas[h.id].trim() }).eq("id", h.id));
      }
      return {};
    }

    case "recuperacao": {
      const r = respostas as Respostas["recuperacao"];
      for (const h of ctx.habitos) {
        const p = r.planos[h.id];
        falhou(
          await supabase
            .from("habitos")
            .update({ plano_recuperacao: p.plano.trim(), aviso_falha: p.aviso })
            .eq("id", h.id),
        );
      }
      return {};
    }

    case "contrato_revisao": {
      const r = respostas as Respostas["contrato_revisao"];
      const agora = new Date();
      const proxima = somarDias(diaNoFuso(agora, fuso), 30);
      const ids = (anteriores._revisao_ids as { contrato?: string; mensal?: string }) ?? {};

      const contrato = {
        compromisso: r.contrato.compromisso.trim(),
        consequencia: r.contrato.consequencia.trim(),
        testemunha: r.contrato.testemunha.trim(),
        assinado_em: (anteriores._assinado_em as string) ?? agora.toISOString(),
      };
      const mensal = ctx.habitos.map((h) => ({
        habito_id: h.id,
        decisao: r.revisao[h.id].decisao,
        nota: r.revisao[h.id].nota.trim(),
      }));

      const gravar = async (tipoRev: "contrato" | "mensal", dados: unknown, id?: string) => {
        const linha = { user_id: userId, tipo: tipoRev, dados, proxima_em: tipoRev === "mensal" ? proxima : null };
        const res = id
          ? await supabase.from("revisoes").update(linha).eq("id", id).select("id").single()
          : await supabase.from("revisoes").insert(linha).select("id").single();
        falhou(res);
        return res.data!.id as string;
      };
      const novosIds = {
        contrato: await gravar("contrato", contrato, ids.contrato),
        mensal: await gravar("mensal", mensal, ids.mensal),
      };

      const remover = mensal.filter((m) => m.decisao === "remover").map((m) => m.habito_id);
      if (remover.length) {
        falhou(
          await supabase
            .from("habitos")
            .update({ ativo: false, removido_em: agora.toISOString() })
            .in("id", remover)
            .eq("ativo", true),
        );
      }
      return { _revisao_ids: novosIds, _assinado_em: contrato.assinado_em };
    }
  }
}

function somarDias(dia: string, n: number) {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
