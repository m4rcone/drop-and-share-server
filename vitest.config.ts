import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: loadEnv("example", process.cwd(), ""),
    testTimeout: 20000,
  },
});
