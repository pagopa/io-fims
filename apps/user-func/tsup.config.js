import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/func.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "node20",
  format: "esm",
});
