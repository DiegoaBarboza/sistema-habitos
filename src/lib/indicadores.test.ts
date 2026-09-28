// Casos de teste obrigatórios da seção 13 do handoff (1 a 6; o 7 está em regras/liberacao.test.ts).
// Datas fixas no fuso America/Sao_Paulo; o Vitest roda em TZ=UTC para pegar erro de conversão.

import { describe, expect, it } from "vitest";
import { diaNoFuso } from "./datas";
import {
  adesao,
  adesaoDoElo,
  diasEntre,
  diasSalvosPeloMinimo,
  falhouOntem,
  hoje,
  inicioDaSemana,
  noHorario,
  semFalha2x,
  type CheckinInd,
  type EstadoCheckin,
  type HabitoInd,
} from "./indicadores";

const FUSO = "America/Sao_Paulo";
// Criado às 09:00 de Brasília do dia 1º de setembro de 2026 (uma terça).
const habito = (id: string, removido_em: string | null = null): HabitoInd => ({
  id,
  criado_em: "2026-09-01T12:00:00Z",
  removido_em,
});
const ck = (habito_id: string, dia: string, estado: EstadoCheckin = "feito"): CheckinInd => ({ habito_id, dia, estado });
const semana = diasEntre("2026-09-01", "2026-09-07");

describe("seção 13", () => {
  it("1. 3 hábitos, 7 dias, todos feitos → adesão 100%, sem falha 2x = 7", () => {
    const habitos = ["a", "b", "c"].map((id) => habito(id));
    const checkins = habitos.flatMap((h) => semana.map((d) => ck(h.id, d)));
    const base = { habitos, checkins, fuso: FUSO };
    expect(adesao(base, "2026-09-01", "2026-09-07").taxa).toBe(1);
    expect(semFalha2x(base, "2026-09-07")).toEqual({ atual: 7, recorde: 7 });
  });

  it("2. não feito na segunda e feito na terça → sem falha 2x não quebra", () => {
    // 07/09 é segunda, 08/09 é terça.
    const checkins = diasEntre("2026-09-01", "2026-09-08").map((d) =>
      ck("a", d, d === "2026-09-07" ? "nao_feito" : "feito"),
    );
    const base = { habitos: [habito("a")], checkins, fuso: FUSO };
    expect(semFalha2x(base, "2026-09-08").atual).toBe(8);
  });

  it("3. sem registro na segunda e na terça → sem falha 2x zera na terça", () => {
    const checkins = diasEntre("2026-09-01", "2026-09-06").map((d) => ck("a", d));
    const base = { habitos: [habito("a")], checkins, fuso: FUSO };
    // Terça (08/09) completa com o hábito registrado não resolve a segunda+terça sem registro:
    // aqui nem segunda nem terça têm registro; "hoje" = quarta, então conta até terça.
    expect(semFalha2x(base, "2026-09-09")).toEqual({ atual: 0, recorde: 7 });
    // Na segunda ainda não havia duas falhas seguidas.
    expect(semFalha2x(base, "2026-09-08").atual).toBe(7);
  });

  it("4. mínimo conta para a adesão e para os dias salvos pelo mínimo", () => {
    const checkins = [ck("a", "2026-09-01"), ck("a", "2026-09-02", "minimo"), ck("a", "2026-09-03", "nao_feito")];
    const base = { habitos: [habito("a")], checkins, fuso: FUSO };
    const r = adesao(base, "2026-09-01", "2026-09-03");
    expect(r).toEqual({ previstos: 3, cumpridos: 2, taxa: 2 / 3 });
    expect(diasSalvosPeloMinimo(base, "2026-09-01", "2026-09-03")).toBe(1);
  });

  it("5. hábito removido no dia 10 não entra nos previstos a partir do dia 10", () => {
    const base = {
      habitos: [habito("a"), habito("b", "2026-09-10T15:00:00Z")],
      checkins: [],
      fuso: FUSO,
    };
    expect(adesao(base, "2026-09-09", "2026-09-09").previstos).toBe(2);
    expect(adesao(base, "2026-09-10", "2026-09-10").previstos).toBe(1);
    expect(adesao(base, "2026-09-01", "2026-09-12").previstos).toBe(12 + 9);
  });

  it("6. check-in às 23h50 de Brasília conta no mesmo dia, mesmo que em UTC já seja o dia seguinte", () => {
    const registrado = "2026-09-24T02:50:00Z"; // 23:50 do dia 23 em Brasília
    expect(diaNoFuso(registrado, FUSO)).toBe("2026-09-23");
    const base = {
      habitos: [habito("a")],
      checkins: [{ ...ck("a", diaNoFuso(registrado, FUSO)), registrado_em: registrado }],
      fuso: FUSO,
    };
    expect(hoje(base, "2026-09-23")).toEqual({ feitos: 1, previstos: 1 });
    expect(hoje(base, "2026-09-24")).toEqual({ feitos: 0, previstos: 1 });
  });
});

describe("outros indicadores", () => {
  it("previstos começam no dia de criação, no fuso do usuário", () => {
    // 01:00 UTC do dia 5 = 22:00 do dia 4 em Brasília.
    const base = { habitos: [{ id: "a", criado_em: "2026-09-05T01:00:00Z", removido_em: null }], checkins: [], fuso: FUSO };
    expect(adesao(base, "2026-09-04", "2026-09-04").previstos).toBe(1);
  });

  it("sem falha 2x: hoje só entra quando todos os hábitos têm registro", () => {
    const habitos = [habito("a"), habito("b")];
    const checkins = [...semana.map((d) => ck("a", d)), ...semana.slice(0, 6).map((d) => ck("b", d))];
    expect(semFalha2x({ habitos, checkins, fuso: FUSO }, "2026-09-07").atual).toBe(6);
  });

  it("sem hábitos: tudo zero e adesão nula", () => {
    const base = { habitos: [], checkins: [], fuso: FUSO };
    expect(semFalha2x(base, "2026-09-07")).toEqual({ atual: 0, recorde: 0 });
    expect(adesao(base, "2026-09-01", "2026-09-07").taxa).toBeNull();
  });

  it("falhou ontem: não feito ou sem registro", () => {
    const base = { habitos: [habito("a"), habito("b"), habito("c")], checkins: [ck("a", "2026-09-06", "nao_feito"), ck("c", "2026-09-06", "minimo")], fuso: FUSO };
    expect(falhouOntem(base, base.habitos[0], "2026-09-07")).toBe(true);
    expect(falhouOntem(base, base.habitos[1], "2026-09-07")).toBe(true);
    expect(falhouOntem(base, base.habitos[2], "2026-09-07")).toBe(false);
    expect(falhouOntem(base, base.habitos[0], "2026-09-01")).toBe(false); // ontem ainda não existia
  });

  it("% no horário: até 90 min depois do horário, no mesmo dia", () => {
    const h = { ...habito("a"), horario: "07:30:00" };
    const checkins: CheckinInd[] = [
      { ...ck("a", "2026-09-02"), registrado_em: "2026-09-02T10:00:00Z" }, // 07:00 → ok
      { ...ck("a", "2026-09-03"), registrado_em: "2026-09-03T12:00:00Z" }, // 09:00 → ok (90 min)
      { ...ck("a", "2026-09-04"), registrado_em: "2026-09-04T12:01:00Z" }, // 09:01 → atrasado
      { ...ck("a", "2026-09-05"), registrado_em: "2026-09-06T10:00:00Z" }, // registrado no dia seguinte
    ];
    expect(noHorario({ habitos: [h], checkins, fuso: FUSO }, h)).toBe(0.5);
  });

  it("adesão do elo: 7 dias depois − 7 dias antes, em pontos", () => {
    const antes = diasEntre("2026-09-03", "2026-09-09").slice(0, 3).map((d) => ck("a", d)); // 3/7
    const depois = diasEntre("2026-09-10", "2026-09-16").slice(0, 6).map((d) => ck("a", d)); // 6/7
    const base = { habitos: [habito("a")], checkins: [...antes, ...depois], fuso: FUSO };
    expect(adesaoDoElo(base, base.habitos[0], "2026-09-10")).toBe(43);
  });

  it("semana começa na segunda", () => {
    expect(inicioDaSemana("2026-09-24")).toBe("2026-09-21"); // quinta → segunda
    expect(inicioDaSemana("2026-09-27")).toBe("2026-09-21"); // domingo
    expect(inicioDaSemana("2026-09-21")).toBe("2026-09-21");
  });
});
