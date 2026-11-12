import fs from "node:fs";
import path from "node:path";

import { generate, writeFiles } from "../templates/generate.ts";
import { getVariant, variants } from "../templates/manifest.ts";

// Usage: node scripts/build-templates.ts [template...]
const ids = process.argv.slice(2);
const outDir = path.resolve(import.meta.dirname, "../dist/templates");

for (const variant of ids.length ? ids.map(getVariant) : variants) {
  const dir = path.join(outDir, variant.id);

  fs.rmSync(dir, { recursive: true, force: true });
  writeFiles(await generate(variant), dir);
  console.log(`Generated ${variant.id}`);
}
