import fs from "node:fs";

import * as esbuild from "esbuild";

fs.rmSync("dist", { recursive: true, force: true });
fs.cpSync("public", "dist", { recursive: true });

await esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "esm",
  minify: true,
  target: "es2022",
  outfile: "dist/bundle.js",
  logLevel: "info",
});
