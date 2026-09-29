import { describe, expect, it } from "vitest";
import type { CheckinInd } from "./indicadores";
import { montarLembrete, type HabitoLembrete } from "./lembrete";

const FUSO = "America/Sao_Paulo";
const h = (id: string, nome: string, aviso_falha = true): HabitoLembrete => ({
  id,
  nome,
  aviso_falha,
  criado_em: "2026-09-01T12:00:00Z",
  removido_em: null,
});
const habitos = [h("a", "Revisar a agenda"), h("b", "Ler 2 páginas")];
const feitoOntem: CheckinInd[] = [
  { habito_id: "a", dia: "2026-09-09", estado: "feito" },
  { habito_id: "b", dia: "2026-09-09", estado: "feito" },
];
// 10/09/2026 às 07:05 em Brasília = 10:05 UTC
const as = (hhmm: string) => new Date(`2026-09-10T${hhmm}:00-03:00`);
const base = { fuso: FUSO, lembreteHora: "07:00:00", enviadoEm: null, habitos, checkins: feitoOntem };

describe("montarLembrete", () => {
  it("envia dentro da janela de 15 min com hábitos pendentes", () => {
    expect(montarLembrete({ ...base, agora: as("07:05") })).toBe("Check-in de hoje: 0 de 2 feitos.");
    expect(montarLembrete({ ...base, agora: as("07:00") })).not.toBeNull();
  });

  it("fora da janela não envia", () => {
    expect(montarLembrete({ ...base, agora: as("06:59") })).toBeNull();
    expect(montarLembrete({ ...base, agora: as("07:15") })).toBeNull();
  });

  it("no máximo 1 por dia", () => {
    expect(montarLembrete({ ...base, agora: as("07:05"), enviadoEm: "2026-09-10" })).toBeNull();
    expect(montarLembrete({ ...base, agora: as("07:05"), enviadoEm: "2026-09-09" })).not.toBeNull();
  });

  it("nada pendente hoje: não envia", () => {
    const tudoFeito: CheckinInd[] = [
      ...feitoOntem,
      { habito_id: "a", dia: "2026-09-10", estado: "feito" },
      { habito_id: "b", dia: "2026-09-10", estado: "minimo" },
    ];
    expect(montarLembrete({ ...base, agora: as("07:05"), checkins: tudoFeito })).toBeNull();
  });

  it("conta os feitos de hoje", () => {
    const um: CheckinInd[] = [...feitoOntem, { habito_id: "a", dia: "2026-09-10", estado: "feito" }];
    expect(montarLembrete({ ...base, agora: as("07:05"), checkins: um })).toBe("Check-in de hoje: 1 de 2 feitos.");
  });

  it("hábito que falhou ontem com aviso ligado muda a mensagem", () => {
    const falhou: CheckinInd[] = [{ habito_id: "a", dia: "2026-09-09", estado: "feito" }];
    expect(montarLembrete({ ...base, agora: as("07:05"), checkins: falhou })).toBe(
      "Hoje é dia de não falhar 2x: Ler 2 páginas.",
    );
    const semAviso = [habitos[0], h("b", "Ler 2 páginas", false)];
    expect(montarLembrete({ ...base, agora: as("07:05"), checkins: falhou, habitos: semAviso })).toBe(
      "Check-in de hoje: 0 de 2 feitos.",
    );
  });

  it("horário no fuso do usuário, não do servidor", () => {
    // 07:05 em Manaus (UTC−4) = 08:05 em Brasília.
    expect(montarLembrete({ ...base, fuso: "America/Manaus", agora: new Date("2026-09-10T11:05:00Z") })).not.toBeNull();
    expect(montarLembrete({ ...base, agora: new Date("2026-09-10T11:05:00Z") })).toBeNull();
  });
});
