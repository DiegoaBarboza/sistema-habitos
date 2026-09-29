import { describe, expect, it } from "vitest";
import { ehTema, resolverTema } from "./tema";

describe("resolverTema", () => {
  it("escuro e claro ignoram o sistema", () => {
    expect(resolverTema("escuro", false)).toBe("dark");
    expect(resolverTema("claro", true)).toBe("light");
  });

  it("automático segue o sistema", () => {
    expect(resolverTema("auto", true)).toBe("dark");
    expect(resolverTema("auto", false)).toBe("light");
  });
});

describe("ehTema", () => {
  it("aceita só os três valores do perfil", () => {
    expect(ehTema("auto")).toBe(true);
    expect(ehTema("escuro")).toBe(true);
    expect(ehTema("claro")).toBe(true);
    expect(ehTema("dark")).toBe(false);
    expect(ehTema(null)).toBe(false);
  });
});
