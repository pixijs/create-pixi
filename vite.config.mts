import path from "node:path";

import nodeExternals from "rollup-plugin-node-externals";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      ...nodeExternals(),
      enforce: "pre",
    },
  ],
  build: {
    target: "node20",
    lib: {
      entry: path.resolve(import.meta.dirname, "src/index.ts"),
      name: "create-pixi",
      fileName: () => `create-pixi.mjs`,
      formats: ["es"],
    },
  },
  resolve: {
    mainFields: ["module", "jsnext:main", "jsnext"],
    conditions: ["node"],
  },
});
