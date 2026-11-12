import * as esbuild from "esbuild";

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "esm",
  sourcemap: true,
  outfile: "public/bundle.js",
  // Serve the bundle from memory instead of writing it into public/
  write: false,
  // Reload the page whenever the bundle rebuilds (files in public/ need a manual refresh)
  banner: {
    js: 'new EventSource("/esbuild").addEventListener("change", () => location.reload());',
  },
  logLevel: "info",
});

await context.watch();
await context.serve({ servedir: "public", port: 8080 });
