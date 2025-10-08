import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    // Configuración de testing
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@entities": resolve(__dirname, "./src/entities"),
      "@services": resolve(__dirname, "./src/services"),
      "@use-cases": resolve(__dirname, "./src/use-cases"),
      "@utils": resolve(__dirname, "./src/utils"),
    },
  },
});
