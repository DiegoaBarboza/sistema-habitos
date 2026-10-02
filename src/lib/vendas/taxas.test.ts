import { describe, expect, it } from "vitest";
import { liquidoKiwify, taxaKiwify } from "./taxas";

describe("taxas da Kiwify", () => {
  it("bate com os valores combinados", () => {
    expect(liquidoKiwify(47)).toBe(40.28);
    expect(liquidoKiwify(97)).toBe(85.79);
    expect(taxaKiwify(47)).toBe(6.72);
  });
});
