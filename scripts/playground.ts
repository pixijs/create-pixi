import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { prepareFile } from "../src/scaffold.ts";
import { generate, layersDir, writeFiles } from "../templates/generate.ts";
import type { TemplateFiles } from "../templates/generate.ts";
import { findVariant, variants } from "../templates/manifest.ts";

const variant = findVariant(process.argv[2]);

if (!variant) {
  console.error(
    `Usage: npm run play -- <template>\n\nTemplates:\n  ${variants.map(({ id }) => id).join("\n  ")}`,
  );
  process.exit(1);
}

const templatesDir = path.resolve(import.meta.dirname, "../templates");
const dir = path.resolve(import.meta.dirname, "../playground", variant.id);
const shell = process.platform === "win32";
let written = new Set<string>();

/** Regenerates the template and writes only the files that changed, so dev servers reload once */
const sync = async () => {
  const output: TemplateFiles = new Map();

  for (const [file, content] of await generate(variant)) {
    output.set(...prepareFile(file, content, { packageName: variant.id }));
  }

  writeFiles(output, dir);

  for (const file of written) {
    if (!output.has(file)) fs.rmSync(path.join(dir, file), { force: true });
  }

  written = new Set(output.keys());
};

for (const entry of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  // .env holds secrets the template doesn't generate, such as Discord's
  if (entry !== "node_modules" && entry !== ".env") {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

await sync();

const install = spawnSync("npm", ["install"], {
  cwd: dir,
  stdio: "inherit",
  shell,
});

if (install.status !== 0) {
  console.error(`[playground] npm install failed in ${dir}`);
  process.exit(1);
}

let timeout: NodeJS.Timeout | undefined;
let queue = Promise.resolve();

const onChange = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Run syncs one at a time so an older sync can't overwrite a newer one
    queue = queue.then(sync).then(
      () => console.log(`[playground] synced ${variant.id}`),
      (error: Error) => console.error(`[playground] ${error.message}`),
    );
  }, 100);
};

// Watching all of templates/ would also fire for templates/node_modules and generator edits
for (const layer of variant.template.layers) {
  fs.watch(path.join(layersDir, layer), { recursive: true }, onChange);
}

// Watch the directory rather than the file so editors that save by renaming still trigger a sync
fs.watch(templatesDir, (_, file) => {
  if (file === "package.json") onChange();
});

spawn("npm", ["run", "dev"], { cwd: dir, stdio: "inherit", shell }).on(
  "exit",
  (code) => process.exit(code ?? 0),
);
