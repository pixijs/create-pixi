import { build } from "esbuild";
import clean from "esbuild-plugin-clean";
import copy from "esbuild-plugin-copy";

const builder = async () => {
  await build({
    entryPoints: ["./src/main.js"],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    outfile: "./dist/bundle.min.js",
    plugins: [
      clean({
        patterns: ["./dist/*", "./public/bundle.min.js"],
      }),
      copy({
        assets: [
          { from: "./public/*", to: "./" },
          { from: "./index.html", to: "./index.html" },
        ],
      }),
    ],
  });
};
builder();
