import { defineConfig } from "vitest/config";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: [
        resolve(__dirname, "tsconfig.json"),
        resolve(__dirname, "../../domain/tsconfig.json"),
      ],
    }),
  ],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    setupFiles: ["./src/tests/setup-env.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@domain": resolve(__dirname, "../../domain/dist"),
      "@playloggd/domain": resolve(__dirname, "../../domain/dist"),
    },
  },
});
