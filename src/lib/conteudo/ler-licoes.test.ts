import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { lerLicoes } from "./ler-licoes";

const arquivo = readFileSync(join(__dirname, "../../../docs/conteudo-modulo1-habitos.md"), "utf8");
const licoes = lerLicoes(arquivo, "habitos");

describe("lerLicoes", () => {
  it("lê as 8 semanas em ordem, com id, duração e tipo", () => {
    expect(licoes.map((l) => [l.semana, l.id, l.duracao_min, l.tipo_exercicio])).toEqual([
      [1, "habitos-s1", 10, "inventario"],
      [2, "habitos-s2", 10, "identidade"],
      [3, "habitos-s3", 10, "plano_gatilho"],
      [4, "habitos-s4", 10, "encadeamento"],
      [5, "habitos-s5", 10, "ambiente"],
      [6, "habitos-s6", 5, "versao_minima"],
      [7, "habitos-s7", 5, "recuperacao"],
      [8, "habitos-s8", 7, "contrato_revisao"],
    ]);
  });

  it("separa título, parágrafos e pergunta-teste do Entenda", () => {
    const s1 = licoes[0].conteudo.entenda;
    expect(s1.titulo).toBe("Você não melhora o que não enxerga");
    expect(s1.paragrafos[0]).toBe("#### O que é um inventário");
    expect(s1.paragrafos.filter((p) => p.startsWith("> "))).toHaveLength(1);
    expect(s1.pergunta).toBe("isso me aproxima ou me afasta do resultado que eu quero daqui a um ano?");
    expect(licoes[1].conteudo.entenda.pergunta).toBe(
      "o que uma pessoa com essa identidade faria hoje, em 2 minutos?",
    );
  });

  it("mantém o texto idêntico ao arquivo", () => {
    for (const l of licoes) {
      const c = l.conteudo;
      const trechos = [
        l.titulo,
        c.entenda.titulo,
        c.entenda.pergunta,
        ...c.entenda.paragrafos,
        ...c.faca,
        ...c.compromisso,
        c.para_ir_alem,
      ];
      for (const t of trechos) expect(arquivo).toContain(t);
      expect(c.faca.length).toBeGreaterThan(0);
      expect(c.compromisso.length).toBeGreaterThan(0);
    }
  });

  it("mantém sub-itens dentro do item pai", () => {
    const acoes = licoes[4].conteudo.faca.find((i) => i.startsWith("Para cada hábito ativo"));
    expect(acoes).toContain("Hábito a construir");
    expect(acoes).toContain("Hábito a largar");
  });

  it("lê as frases do dia com autor e fonte, ou sem crédito", () => {
    const f = licoes[0].conteudo.frases;
    expect(f).toHaveLength(7);
    expect(f[0]).toEqual({
      texto: "Grande parte da vida escapa **enquanto fazemos outra coisa.**",
      autor: "Sêneca",
      fonte: "Cartas a Lucílio, 1",
    });
    expect(f[1]).toEqual({ texto: "Você não muda **o que não enxerga.**", autor: null, fonte: null });
    expect(f[4].fonte).toBe("Discursos, II.18");
    expect(licoes[1].conteudo.frases).toHaveLength(7);
    expect(licoes[5].conteudo.frases).toEqual([]);
  });

  it("aceita quebras de linha do Windows", () => {
    expect(lerLicoes(arquivo.replace(/\n/g, "\r\n"), "habitos")).toEqual(licoes);
  });
});
