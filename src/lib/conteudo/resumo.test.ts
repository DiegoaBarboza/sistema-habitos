import { describe, expect, it } from "vitest";
import { resumoConclusao } from "./resumo";

describe("resumoConclusao", () => {
  it("inventário conta os itens preenchidos", () => {
    const itens = [{ texto: "a" }, { texto: " " }, { texto: "b" }, {}, { texto: "c" }, { texto: "d" }, { texto: "e" }];
    expect(resumoConclusao("inventario", { itens })).toBe("Concluída · 5 hábitos mapeados");
  });

  it("identidade conta as evidências", () => {
    const evidencias = [{ texto: "x" }, { texto: "y" }, { texto: "z" }];
    expect(resumoConclusao("identidade", { evidencias })).toBe("Concluída · 3 evidências definidas");
  });

  it("sem dados reconhecíveis fica só Concluída", () => {
    expect(resumoConclusao("inventario", {})).toBe("Concluída");
    expect(resumoConclusao("ambiente", { qualquer: 1 })).toBe("Concluída");
  });
});
