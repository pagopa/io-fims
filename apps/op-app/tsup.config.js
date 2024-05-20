import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/web.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "node18",
  format: "esm",
});
