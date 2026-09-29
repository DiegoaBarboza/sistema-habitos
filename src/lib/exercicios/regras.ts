// Formato das respostas de cada tipo de exercício (progresso_licao.respostas),
// validação para concluir (seção 8 do handoff) e etapa atual da lição.
// Chaves que começam com "_" são gravadas só pelo servidor (ids criados na conclusão).

import type { TipoExercicio } from "@/lib/conteudo/ler-licoes";

export type Classificacao = "+" | "=" | "-" | "";
export type HabitoCtx = { id: string; nome: string; tipo: "construir" | "largar" };
export type FocoCtx = { texto: string; classificacao: Classificacao } | null;
export type Contexto = { habitos: HabitoCtx[]; foco: FocoCtx };

export type Inventario = { itens: { texto: string; classificacao: Classificacao }[]; foco: number | null };
export type Identidade = { frase: string; evidencias: { texto: string }[]; foco_evidencia: number | null };
export type PlanoGatilho = { planos: Record<string, { horario: string; lugar: string; depois_de: string }> };
export type Corrente = { ancora: string; habito: string; novo_nome: string };
export type Encadeamento = { ancoras: string[]; outra: string; correntes: Corrente[] };
export type Acao = { id: string; texto: string; aplicado: boolean };
export type Ambiente = { acoes: Record<string, Acao[]> };
export type VersaoMinima = { minimas: Record<string, string> };
export type Recuperacao = { planos: Record<string, { plano: string; aviso: boolean }> };
export type Decisao = "manter" | "ajustar" | "remover" | "";
export type ContratoRevisao = {
  contrato: { compromisso: string; consequencia: string; testemunha: string; assinado: boolean };
  revisao: Record<string, { decisao: Decisao; nota: string }>;
};

export type Respostas = {
  inventario: Inventario;
  identidade: Identidade;
  plano_gatilho: PlanoGatilho;
  encadeamento: Encadeamento;
  ambiente: Ambiente;
  versao_minima: VersaoMinima;
  recuperacao: Recuperacao;
  contrato_revisao: ContratoRevisao;
};

export const MIN_INVENTARIO = 5;
export const MAX_INVENTARIO = 12;
export const HABITO_NOVO = "novo";
export const CHAVE_FOCO = "foco";

const cheio = (s: unknown) => typeof s === "string" && s.trim().length > 0;
const novoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ROTULO_PENDENTE: Record<TipoExercicio, string> = {
  inventario: "Classifique os 5 e escolha 1 hábito",
  identidade: "Preencha a frase e as 3 evidências",
  plano_gatilho: "Complete o plano de cada hábito",
  encadeamento: "Monte pelo menos 1 corrente",
  ambiente: "Escreva pelo menos 2 ações",
  versao_minima: "Defina a versão mínima de cada hábito",
  recuperacao: "Escreva o plano de cada hábito",
  contrato_revisao: "Assine o compromisso e revise cada hábito",
};

// ---------- semana 1 ----------

export function itensCompletos(r: Inventario) {
  return r.itens.filter((i) => cheio(i.texto) && i.classificacao !== "");
}

// Opções do hábito-foco: os marcados com −; se não houver nenhum, os marcados com +.
export function opcoesFoco(r: Inventario) {
  const comIndice = r.itens.map((item, i) => ({ item, i })).filter(({ item }) => cheio(item.texto));
  const negativos = comIndice.filter(({ item }) => item.classificacao === "-");
  return {
    semNegativo: negativos.length === 0,
    opcoes: negativos.length ? negativos : comIndice.filter(({ item }) => item.classificacao === "+"),
  };
}

export function focoDoInventario(r: Inventario): FocoCtx {
  if (r.foco === null) return null;
  const item = r.itens[r.foco];
  return item && cheio(item.texto) ? { texto: item.texto.trim(), classificacao: item.classificacao } : null;
}

// ---------- semana 5 ----------

// Cartões do ambiente: um por hábito ativo, mais o hábito-foco se ele for um −.
export function cartoesAmbiente(ctx: Contexto) {
  const cartoes: { chave: string; nome: string; tipo: "construir" | "largar"; habitoId: string | null }[] =
    ctx.habitos.map((h) => ({ chave: h.id, nome: h.nome, tipo: h.tipo, habitoId: h.id }));
  if (ctx.foco?.classificacao === "-") {
    cartoes.push({ chave: CHAVE_FOCO, nome: ctx.foco.texto, tipo: "largar", habitoId: null });
  }
  return cartoes;
}

export function alavancas(tipo: "construir" | "largar") {
  return tipo === "construir" ? (["a_vista", "tirar_passos"] as const) : (["esconder_gatilho", "colocar_passos"] as const);
}

// ---------- normalização ----------

// Completa o que falta em respostas vindas do banco (ou vazias) sem perder o que já foi preenchido.
export function normalizar<T extends TipoExercicio>(tipo: T, bruto: unknown, ctx: Contexto): Respostas[T] {
  const r = (bruto && typeof bruto === "object" ? bruto : {}) as Record<string, unknown>;
  const obj = <V>(v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, V>) : {});
  const lista = <V>(v: unknown) => (Array.isArray(v) ? (v as V[]) : []);
  const txt = (v: unknown) => (typeof v === "string" ? v : "");
  const porHabito = <V>(v: unknown, vazio: () => V) => {
    const atual = obj<V>(v);
    return Object.fromEntries(ctx.habitos.map((h) => [h.id, { ...vazio(), ...(atual[h.id] ?? {}) }]));
  };

  const saida: Record<TipoExercicio, () => unknown> = {
    inventario: () => {
      const itens = lista<{ texto?: string; classificacao?: Classificacao }>(r.itens)
        .slice(0, MAX_INVENTARIO)
        .map((i) => ({ texto: txt(i?.texto), classificacao: (i?.classificacao ?? "") as Classificacao }));
      while (itens.length < MIN_INVENTARIO) itens.push({ texto: "", classificacao: "" });
      return { itens, foco: typeof r.foco === "number" ? r.foco : null };
    },
    identidade: () => {
      const evidencias = lista<{ texto?: string }>(r.evidencias).slice(0, 3).map((e) => ({ texto: txt(e?.texto) }));
      while (evidencias.length < 3) evidencias.push({ texto: "" });
      return {
        frase: txt(r.frase),
        evidencias,
        foco_evidencia: typeof r.foco_evidencia === "number" ? r.foco_evidencia : null,
      };
    },
    plano_gatilho: () => ({ planos: porHabito(r.planos, () => ({ horario: "", lugar: "", depois_de: "" })) }),
    encadeamento: () => ({
      ancoras: lista<string>(r.ancoras).filter(cheio),
      outra: txt(r.outra),
      correntes: lista<Partial<Corrente>>(r.correntes).map((c) => ({
        ancora: txt(c?.ancora),
        habito: txt(c?.habito),
        novo_nome: txt(c?.novo_nome),
      })),
    }),
    ambiente: () => {
      const atual = obj<Acao[]>(r.acoes);
      return {
        acoes: Object.fromEntries(
          cartoesAmbiente(ctx).map((c) => {
            const acoes = lista<Partial<Acao>>(atual[c.chave])
              .slice(0, 2)
              .map((a) => ({ id: txt(a?.id) || novoId(), texto: txt(a?.texto), aplicado: Boolean(a?.aplicado) }));
            while (acoes.length < 2) acoes.push({ id: novoId(), texto: "", aplicado: false });
            return [c.chave, acoes];
          }),
        ),
      };
    },
    versao_minima: () => {
      const atual = obj<string>(r.minimas);
      return { minimas: Object.fromEntries(ctx.habitos.map((h) => [h.id, txt(atual[h.id])])) };
    },
    recuperacao: () => ({ planos: porHabito(r.planos, () => ({ plano: "", aviso: true })) }),
    contrato_revisao: () => {
      const c = obj<unknown>(r.contrato);
      return {
        contrato: {
          compromisso: typeof c.compromisso === "string" ? c.compromisso : ctx.habitos.map((h) => h.nome).join("; "),
          consequencia: txt(c.consequencia),
          testemunha: txt(c.testemunha),
          assinado: Boolean(c.assinado),
        },
        revisao: porHabito(r.revisao, () => ({ decisao: "" as Decisao, nota: "" })),
      };
    },
  };
  return saida[tipo]() as Respostas[T];
}

// ---------- validação ----------

export function podeConcluir(tipo: TipoExercicio, respostas: unknown, ctx: Contexto): boolean {
  switch (tipo) {
    case "inventario": {
      const r = respostas as Inventario;
      const { opcoes } = opcoesFoco(r);
      return itensCompletos(r).length >= MIN_INVENTARIO && opcoes.some((o) => o.i === r.foco);
    }
    case "identidade": {
      const r = respostas as Identidade;
      return cheio(r.frase) && r.evidencias.length === 3 && r.evidencias.every((e) => cheio(e.texto));
    }
    case "plano_gatilho": {
      const r = respostas as PlanoGatilho;
      return ctx.habitos.length > 0 && ctx.habitos.every((h) => {
        const p = r.planos[h.id];
        return p && cheio(p.horario) && cheio(p.lugar) && cheio(p.depois_de);
      });
    }
    case "encadeamento":
      return correntesCompletas(respostas as Encadeamento).length >= 1;
    case "ambiente": {
      const r = respostas as Ambiente;
      return Object.values(r.acoes).flat().filter((a) => cheio(a.texto)).length >= 2;
    }
    case "versao_minima": {
      const r = respostas as VersaoMinima;
      return ctx.habitos.length > 0 && ctx.habitos.every((h) => cheio(r.minimas[h.id]));
    }
    case "recuperacao": {
      const r = respostas as Recuperacao;
      return ctx.habitos.length > 0 && ctx.habitos.every((h) => cheio(r.planos[h.id]?.plano));
    }
    case "contrato_revisao": {
      const r = respostas as ContratoRevisao;
      return r.contrato.assinado && ctx.habitos.every((h) => r.revisao[h.id]?.decisao);
    }
  }
}

export function correntesCompletas(r: Encadeamento) {
  return r.correntes.filter(
    (c) => cheio(c.ancora) && (c.habito === HABITO_NOVO ? cheio(c.novo_nome) : cheio(c.habito)),
  );
}

// "entenda" até o primeiro campo preenchido; "faca" enquanto o exercício não fecha;
// "compromisso" quando falta só a escolha final (semana 1) ou quando já dá para concluir.
export function etapaAtual(tipo: TipoExercicio, respostas: unknown, ctx: Contexto) {
  if (podeConcluir(tipo, respostas, ctx)) return "compromisso" as const;
  if (tipo === "inventario" && itensCompletos(respostas as Inventario).length >= MIN_INVENTARIO) {
    return "compromisso" as const;
  }
  return algoPreenchido(respostas) ? ("faca" as const) : ("entenda" as const);
}

function algoPreenchido(v: unknown): boolean {
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return v.some(algoPreenchido);
  if (v && typeof v === "object") {
    return Object.entries(v).some(([k, x]) => k !== "id" && k !== "compromisso" && algoPreenchido(x));
  }
  return false;
}
