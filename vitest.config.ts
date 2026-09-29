import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Os indicadores dependem de fuso; roda em UTC para pegar erro de conversão.
    env: { TZ: "UTC" },
  },
});
