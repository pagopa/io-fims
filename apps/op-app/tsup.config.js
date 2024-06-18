import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/web.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "node20",
  format: "esm",
});
