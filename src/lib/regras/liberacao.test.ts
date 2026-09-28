import { describe, expect, it } from "vitest";
import { calcularTrilha, type ProgressoSemana } from "./liberacao";

const FUSO = "America/Sao_Paulo";

function trilha(progresso: Record<number, Partial<ProgressoSemana>>, dias: string[] = []) {
  const mapa = new Map(
    Object.entries(progresso).map(([n, p]) => [
      Number(n),
      { iniciadaEm: p.iniciadaEm ?? null, concluidaEm: p.concluidaEm ?? null },
    ]),
  );
  return calcularTrilha({ progresso: mapa, diasComCheckin: dias, fuso: FUSO });
}

const estados = (t: ReturnType<typeof trilha>) => t.map((s) => s.estado[0]).join("");

describe("calcularTrilha", () => {
  it("sem progresso: semana 1 é a atual e a 2 explica o bloqueio", () => {
    const t = trilha({});
    expect(estados(t)).toBe("abbbbbbb");
    expect(t[1].motivo).toBe("Libera ao concluir a semana 1");
    expect(t[2].motivo).toBeUndefined();
  });

  it("semana 2 libera só com a 1 concluída, sem exigir check-in", () => {
    const t = trilha({ 1: { iniciadaEm: "2026-09-01T10:00:00Z", concluidaEm: "2026-09-01T10:10:00Z" } });
    expect(estados(t)).toBe("cabbbbbb");
    expect(t[2].motivo).toBe("Libera ao concluir a semana 2 + 5 check-ins (0/5)");
  });

  // Caso de teste 7 do handoff.
  describe("semana 3: semana 2 concluída + 5 dias de check-in", () => {
    const base = {
      1: { iniciadaEm: "2026-09-01T10:00:00Z", concluidaEm: "2026-09-01T10:10:00Z" },
      2: { iniciadaEm: "2026-09-02T12:00:00Z", concluidaEm: "2026-09-02T12:10:00Z" },
    };

    it("com 4 dias fica bloqueada e mostra o contador", () => {
      const t = trilha(base, ["2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05"]);
      expect(estados(t)).toBe("ccbbbbbb");
      expect(t[2].motivo).toBe("Libera com 5 check-ins (4/5)");
    });

    it("com o 5º dia libera", () => {
      const t = trilha(base, ["2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"]);
      expect(estados(t)).toBe("ccabbbbb");
      expect(t[3].motivo).toBe("Libera ao concluir a semana 3 + 5 check-ins (0/5)");
    });

    it("5 dias sem a semana 2 concluída não libera", () => {
      const t = trilha(
        { 1: base[1], 2: { iniciadaEm: base[2].iniciadaEm } },
        ["2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05", "2026-09-06"],
      );
      expect(estados(t)).toBe("cabbbbbb");
      expect(t[2].motivo).toBe("Libera ao concluir a semana 2 + 5 check-ins (5/5)");
    });
  });

  it("só conta dias a partir do início da semana anterior, no fuso do usuário", () => {
    // 01:30 UTC do dia 10 ainda é 22:30 do dia 9 em Brasília: o dia 9 conta.
    const t = trilha(
      {
        1: { concluidaEm: "2026-09-01T10:00:00Z" },
        2: { iniciadaEm: "2026-09-10T01:30:00Z", concluidaEm: "2026-09-10T01:40:00Z" },
      },
      ["2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-12"],
    );
    expect(t[2].motivo).toBe("Libera com 5 check-ins (4/5)");
  });

  it("todas concluídas", () => {
    const tudo = Object.fromEntries(
      Array.from({ length: 8 }, (_, i) => [i + 1, { concluidaEm: "2026-09-01T10:00:00Z" }]),
    );
    expect(estados(trilha(tudo))).toBe("cccccccc");
  });
});
