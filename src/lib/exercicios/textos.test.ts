import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TEXTOS } from "./textos";

const arquivo = readFileSync(join(__dirname, "../../../docs/conteudo-modulo1-habitos.md"), "utf8");

function folhas(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (Array.isArray(valor)) return valor.flatMap(folhas);
  if (valor && typeof valor === "object") return Object.values(valor).flatMap(folhas);
  return [];
}

describe("TEXTOS dos exercícios", () => {
  it.each(folhas(TEXTOS))("existe no arquivo de conteúdo: %s", (texto) => {
    expect(arquivo).toContain(texto);
  });
});
