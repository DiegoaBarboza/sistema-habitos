import { describe, expect, it } from "vitest";
import {
  cartoesAmbiente,
  etapaAtual,
  normalizar,
  opcoesFoco,
  podeConcluir,
  type Contexto,
} from "./regras";

const semHabitos: Contexto = { habitos: [], foco: null };
const ctx: Contexto = {
  habitos: [
    { id: "h1", nome: "Revisar a agenda", tipo: "construir" },
    { id: "h2", nome: "Ler 2 páginas", tipo: "construir" },
  ],
  foco: { texto: "checar o celular ao acordar", classificacao: "-" },
};

describe("inventário (semana 1)", () => {
  const cinco = (cls: string[]) =>
    normalizar("inventario", { itens: cls.map((c, i) => ({ texto: `hábito ${i}`, classificacao: c })) }, semHabitos);

  it("começa com 5 linhas vazias", () => {
    const r = normalizar("inventario", {}, semHabitos);
    expect(r.itens).toHaveLength(5);
    expect(etapaAtual("inventario", r, semHabitos)).toBe("entenda");
  });

  it("foco só entre os −; sem −, entre os +", () => {
    expect(opcoesFoco(cinco(["+", "-", "=", "-", "+"])).opcoes.map((o) => o.i)).toEqual([1, 3]);
    const semNeg = opcoesFoco(cinco(["+", "=", "=", "+", "="]));
    expect(semNeg.semNegativo).toBe(true);
    expect(semNeg.opcoes.map((o) => o.i)).toEqual([0, 3]);
  });

  it("precisa de 5 completos e foco válido", () => {
    const r = cinco(["+", "-", "=", "-", "+"]);
    expect(etapaAtual("inventario", r, semHabitos)).toBe("compromisso");
    expect(podeConcluir("inventario", r, semHabitos)).toBe(false);
    expect(podeConcluir("inventario", { ...r, foco: 0 }, semHabitos)).toBe(false); // + com − disponível
    expect(podeConcluir("inventario", { ...r, foco: 3 }, semHabitos)).toBe(true);
    const faltaUm = { ...r, foco: 3, itens: r.itens.map((i, k) => (k === 2 ? { ...i, classificacao: "" as const } : i)) };
    expect(podeConcluir("inventario", faltaUm, semHabitos)).toBe(false);
    expect(etapaAtual("inventario", faltaUm, semHabitos)).toBe("faca");
  });
});

describe("identidade (semana 2)", () => {
  it("frase + 3 evidências", () => {
    const r = normalizar("identidade", { frase: "cumpre o que planeja", evidencias: [{ texto: "a" }, { texto: "b" }] }, semHabitos);
    expect(r.evidencias).toHaveLength(3);
    expect(podeConcluir("identidade", r, semHabitos)).toBe(false);
    r.evidencias[2].texto = "c";
    expect(podeConcluir("identidade", r, semHabitos)).toBe(true);
  });
});

describe("exercícios por hábito", () => {
  it("plano de gatilho exige os 3 campos de todos os hábitos", () => {
    const r = normalizar("plano_gatilho", { planos: { h1: { horario: "07:30", lugar: "mesa", depois_de: "café" } } }, ctx);
    expect(podeConcluir("plano_gatilho", r, ctx)).toBe(false);
    r.planos.h2 = { horario: "18:30", lugar: "rua", depois_de: "estacionar" };
    expect(podeConcluir("plano_gatilho", r, ctx)).toBe(true);
  });

  it("versão mínima e recuperação exigem todos os hábitos", () => {
    const vm = normalizar("versao_minima", { minimas: { h1: "1 parágrafo" } }, ctx);
    expect(podeConcluir("versao_minima", vm, ctx)).toBe(false);
    vm.minimas.h2 = "abrir o livro";
    expect(podeConcluir("versao_minima", vm, ctx)).toBe(true);

    const rec = normalizar("recuperacao", {}, ctx);
    expect(rec.planos.h1.aviso).toBe(true);
    expect(etapaAtual("recuperacao", rec, ctx)).toBe("entenda");
    rec.planos.h1.plano = "x";
    rec.planos.h2.plano = "y";
    expect(podeConcluir("recuperacao", rec, ctx)).toBe(true);
  });

  it("sem hábitos ativos, exercícios por hábito não concluem", () => {
    expect(podeConcluir("versao_minima", normalizar("versao_minima", {}, semHabitos), semHabitos)).toBe(false);
  });
});

describe("encadeamento (semana 4)", () => {
  it("≥ 1 corrente completa; hábito novo precisa de nome", () => {
    const r = normalizar("encadeamento", { correntes: [{ ancora: "estacionar", habito: "novo", novo_nome: "" }] }, ctx);
    expect(podeConcluir("encadeamento", r, ctx)).toBe(false);
    r.correntes[0].novo_nome = "caminhar 15 min";
    expect(podeConcluir("encadeamento", r, ctx)).toBe(true);
  });
});

describe("ambiente (semana 5)", () => {
  it("cartão extra para o foco quando ele é um −", () => {
    expect(cartoesAmbiente(ctx).map((c) => [c.chave, c.tipo])).toEqual([
      ["h1", "construir"],
      ["h2", "construir"],
      ["foco", "largar"],
    ]);
    expect(cartoesAmbiente({ ...ctx, foco: { texto: "x", classificacao: "+" } })).toHaveLength(2);
  });

  it("≥ 2 ações escritas no total, em qualquer cartão", () => {
    const r = normalizar("ambiente", {}, ctx);
    expect(Object.keys(r.acoes)).toEqual(["h1", "h2", "foco"]);
    r.acoes.h1[0].texto = "livro no teclado";
    expect(podeConcluir("ambiente", r, ctx)).toBe(false);
    r.acoes.foco[1].texto = "sair do app";
    expect(podeConcluir("ambiente", r, ctx)).toBe(true);
  });

  it("mantém o id das ações entre salvamentos", () => {
    const r = normalizar("ambiente", {}, ctx);
    expect(normalizar("ambiente", r, ctx).acoes.h1[0].id).toBe(r.acoes.h1[0].id);
  });
});

describe("contrato e revisão (semana 8)", () => {
  it("compromisso vem pré-preenchido com os hábitos ativos", () => {
    const r = normalizar("contrato_revisao", {}, ctx);
    expect(r.contrato.compromisso).toBe("Revisar a agenda; Ler 2 páginas");
    expect(etapaAtual("contrato_revisao", r, ctx)).toBe("entenda");
  });

  it("assinado + todos revisados", () => {
    const r = normalizar("contrato_revisao", {}, ctx);
    r.contrato.assinado = true;
    r.revisao.h1.decisao = "manter";
    expect(podeConcluir("contrato_revisao", r, ctx)).toBe(false);
    r.revisao.h2.decisao = "remover";
    expect(podeConcluir("contrato_revisao", r, ctx)).toBe(true);
  });
});
