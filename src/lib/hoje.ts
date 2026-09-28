import "server-only";
import { diaNoFuso } from "@/lib/datas";
import {
  adesao,
  diasEntre,
  falhouOntem,
  hoje as indicadorHoje,
  inicioDaSemana,
  previstoNoDia,
  semFalha2x,
  somarDias,
  type CheckinInd,
  type EstadoCheckin,
} from "@/lib/indicadores";
import { obterSessao } from "@/lib/perfil";
import { criarClienteServidor } from "@/lib/supabase/server";
import { obterTrilha } from "@/lib/trilha";

export type HabitoHoje = {
  id: string;
  nome: string;
  criado_em: string;
  removido_em: string | null;
  ativo: boolean;
  horario: string | null;
  lugar: string | null;
  ancora: string | null;
  versao_minima: string | null;
  plano_recuperacao: string | null;
};

export type Ajuste = { id: string; texto: string; aplicado: boolean };

export async function carregarDados() {
  const { perfil } = await obterSessao();
  const supabase = await criarClienteServidor();
  const [habitos, checkins, ajustes] = await Promise.all([
    supabase
      .from("habitos")
      .select("id, nome, criado_em, removido_em, ativo, horario, lugar, ancora, versao_minima, plano_recuperacao")
      .order("criado_em")
      .returns<HabitoHoje[]>(),
    supabase.from("checkins").select("habito_id, dia, estado, registrado_em").returns<CheckinInd[]>(),
    supabase.from("ajustes_ambiente").select("id, texto, aplicado").returns<Ajuste[]>(),
  ]);
  for (const r of [habitos, checkins, ajustes]) if (r.error) throw new Error(r.error.message);
  return { perfil, habitos: habitos.data!, checkins: checkins.data!, ajustes: ajustes.data! };
}

export async function obterHoje() {
  const [{ perfil, habitos, checkins, ajustes }, trilha] = await Promise.all([carregarDados(), obterTrilha()]);
  const fuso = perfil.fuso;
  const agora = new Date();
  const dia = diaNoFuso(agora, fuso);
  const ontem = somarDias(dia, -1);
  const base = { habitos, checkins, fuso };

  const concluida = (n: number) => trilha.find((s) => s.semana === n)?.estado === "concluida";
  const atual = trilha.find((s) => s.estado === "atual");

  const segunda = inicioDaSemana(dia);
  const semana = diasEntre(segunda, somarDias(segunda, 6)).map((d) => ({
    dia: d,
    taxa: d > dia ? null : (adesao(base, d, d).taxa ?? 0),
    hoje: d === dia,
  }));

  const estadoDe = (habitoId: string, d: string) =>
    checkins.find((c) => c.habito_id === habitoId && c.dia === d)?.estado ?? null;

  const cartoes = (d: string) =>
    habitos
      .filter((h) => previstoNoDia(h, d, fuso))
      .map((h) => ({
        id: h.id,
        nome: h.nome,
        detalhe: [h.horario?.slice(0, 5), h.lugar, h.ancora && `depois de ${h.ancora}`].filter(Boolean).join(" · "),
        versaoMinima: h.versao_minima,
        estado: estadoDe(h.id, d) as EstadoCheckin | null,
        diaDeNaoFalhar: d === dia && falhouOntem(base, h, dia),
        planoRecuperacao: concluida(7) ? h.plano_recuperacao : null,
      }));

  const indHoje = indicadorHoje(base, dia);
  const sf = semFalha2x(base, dia);

  return {
    nome: perfil.nome ?? "",
    agora: agora.toISOString(),
    fuso,
    dia,
    ontem,
    // Esperando check-ins para liberar a próxima, a semana em curso é a primeira bloqueada.
    semanaAtual: atual?.semana ?? trilha.find((s) => s.estado === "bloqueada")?.semana ?? 8,
    indicadores: {
      hoje: indHoje,
      adesaoSemana: adesao(base, segunda, dia).taxa,
      semFalha2x: sf.atual,
    },
    semana,
    cartoesHoje: cartoes(dia),
    cartoesOntem: cartoes(ontem),
    ajustesPendentes: concluida(5) ? ajustes.filter((a) => !a.aplicado) : [],
    licao: atual
      ? { id: atual.licao.id, titulo: atual.licao.titulo, duracao: atual.licao.duracao_min }
      : null,
    temHabitos: habitos.some((h) => h.ativo),
  };
}
