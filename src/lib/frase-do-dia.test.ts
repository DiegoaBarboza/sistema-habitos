import { describe, expect, it } from "vitest";
import { diaDaJornada, indiceDaFrase } from "./frase-do-dia";

describe("frase do dia", () => {
  it("começa pela primeira frase no dia em que a lição abre", () => {
    expect(indiceDaFrase(7, "2026-10-01", "2026-10-01")).toBe(0);
    expect(indiceDaFrase(7, "2026-10-01", "2026-10-03")).toBe(2);
  });

  it("recomeça depois da última frase", () => {
    expect(indiceDaFrase(7, "2026-10-01", "2026-10-07")).toBe(6);
    expect(indiceDaFrase(7, "2026-10-01", "2026-10-08")).toBe(0);
  });

  it("sem frases na semana, não mostra nada", () => {
    expect(indiceDaFrase(0, "2026-10-01", "2026-10-05")).toBeNull();
  });

  it("conta o dia da jornada a partir de 1", () => {
    expect(diaDaJornada("2026-10-01", "2026-10-01")).toBe(1);
    expect(diaDaJornada("2026-09-22", "2026-10-01")).toBe(10);
  });
});
