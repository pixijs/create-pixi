import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { layersDir } from "../templates/generate.ts";
import { variants } from "../templates/manifest.ts";

// Type-checks the layers of each TypeScript template together. In rootDirs,
// the first layer with a file wins, so the list is reversed to match the
// generator, where later layers win. The extension template builds with its
// own tsconfig, so it's left out.
const root = path.resolve(import.meta.dirname, "..");
const tsc = path.join(root, "node_modules/typescript/bin/tsc");
const configDir = path.join(root, "node_modules/.cache/typecheck-templates");
let failed = false;

fs.mkdirSync(configDir, { recursive: true });

for (const { id, language, template } of variants) {
  if (language !== "ts" || template.category === "extension") continue;

  const layers = template.layers.map((layer) => path.join(layersDir, layer));
  const config = path.join(configDir, `${id}.json`);

  fs.writeFileSync(
    config,
    JSON.stringify({
      extends: path.join(layersDir, "tsconfig.json"),
      compilerOptions: { rootDirs: layers.toReversed() },
      include: layers,
    }),
  );

  const { status } = spawnSync(process.execPath, [tsc, "-p", config], {
    stdio: "inherit",
  });

  if (status !== 0) {
    console.error(`${id} failed to type-check`);
    failed = true;
  }
}

if (failed) process.exit(1);
