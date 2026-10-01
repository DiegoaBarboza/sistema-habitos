import { describe, expect, it } from "vitest";
import { palavrasDaFrase, temaDoDia, textoLimpo } from "./frase-arte";

describe("arte da frase", () => {
  it("marca as palavras do trecho em destaque", () => {
    expect(palavrasDaFrase("Você não muda **o que não enxerga.**")).toEqual([
      { palavra: "Você", destaque: false },
      { palavra: "não", destaque: false },
      { palavra: "muda", destaque: false },
      { palavra: "o", destaque: true },
      { palavra: "que", destaque: true },
      { palavra: "não", destaque: true },
      { palavra: "enxerga.", destaque: true },
    ]);
  });

  it("alterna grafite e branco a cada dia", () => {
    expect([1, 2, 3, 4].map(temaDoDia)).toEqual(["grafite", "branco", "grafite", "branco"]);
  });

  it("tira os marcadores do texto", () => {
    expect(textoLimpo("Anote o que acontece, **não o que deveria.**")).toBe("Anote o que acontece, não o que deveria.");
  });
});
