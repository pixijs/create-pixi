import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { getVariant, variants } from "../templates/manifest.ts";

const cli = path.resolve(import.meta.dirname, "../index.js");
const selected =
  process.argv.length > 2 ? process.argv.slice(2).map(getVariant) : variants;

if (!fs.existsSync(path.resolve(import.meta.dirname, "../dist/templates"))) {
  throw new Error("Run `npm run build` first");
}

function run(cwd: string, command: string, ...args: string[]) {
  console.log(`\n> ${command} ${args.join(" ")}`);

  const { status } = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    // npm and npx are .cmd shims on Windows
    shell: process.platform === "win32" && command !== "node",
  });

  if (status !== 0) {
    throw new Error(`"${command} ${args.join(" ")}" failed in ${cwd}`);
  }
}

for (const { id, template } of selected) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `create-pixi-${id}-`));
  const app = path.join(dir, "app");

  console.log(`\nVerifying ${id} in ${app}`);

  run(dir, "node", cli, "app", "--template", id);
  run(app, "npm", "install", "--no-audit", "--no-fund");
  run(app, "npm", "run", "lint");

  if (fs.existsSync(path.join(app, ".oxfmtrc.json"))) {
    run(app, "npx", "oxfmt", "--check");
  }

  const { scripts } = JSON.parse(
    fs.readFileSync(path.join(app, "package.json"), "utf8"),
  );

  if (scripts.build) {
    run(app, "npm", "run", "build");
  }

  // `npm run dev` accepts made-up Discord players. If the build kept that
  // code, anyone could join a deployed game without signing in.
  const serverDir = path.join(app, "dist/server");

  if (template.layers.includes("platforms/discord/core")) {
    const mockFiles = fs
      .readdirSync(serverDir, { recursive: true, encoding: "utf8" })
      .filter((file) => /\.m?js$/.test(file))
      .filter((file) =>
        fs.readFileSync(path.join(serverDir, file), "utf8").includes("mock_"),
      );

    if (mockFiles.length > 0) {
      throw new Error(`${id} builds mock sign-ins into ${mockFiles}`);
    }
  }

  fs.rmSync(dir, { recursive: true, force: true });
}
