import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

const cli = path.resolve(import.meta.dirname, "../index.js");
let cwd: string;

const env = () => ({
  ...process.env,
  GIT_CONFIG_GLOBAL: path.join(cwd, ".gitconfig"),
});

function run(args: string[], extraEnv: NodeJS.ProcessEnv = {}, input?: string) {
  return spawnSync("node", [cli, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...env(), ...extraEnv },
    input,
  });
}

const down = "\x1B[B";
const enter = "\r";

/**
 * Runs the CLI and answers each prompt once it appears, by typing keys. Keys
 * piped in all at once would only reach the first prompt.
 */
function answer(args: string[], answers: [prompt: string, keys: string][]) {
  const child = spawn("node", [cli, ...args], { cwd, env: env() });
  let stdout = "";
  let searchFrom = 0;
  let answered = 0;

  child.stdout.setEncoding("utf8").on("data", (chunk: string) => {
    stdout += chunk;

    if (answered === answers.length) return;

    const [prompt, keys] = answers[answered];
    const index = stdout.indexOf(prompt, searchFrom);

    if (index === -1) return;

    searchFrom = index + prompt.length;
    answered += 1;
    child.stdin.write(keys);
    if (answered === answers.length) child.stdin.end();
  });

  // An unexpected prompt would wait for keys forever
  const timeout = setTimeout(() => child.kill(), 4000);

  return new Promise<{ status: number | null; stdout: string }>((resolve) =>
    child.on("close", (status) => {
      clearTimeout(timeout);
      resolve({ status, stdout });
    }),
  );
}

function read(file: string) {
  return fs.readFileSync(path.join(cwd, file), "utf8");
}

function readJson(file: string) {
  return JSON.parse(read(file));
}

function exists(file: string) {
  return fs.existsSync(path.join(cwd, file));
}

beforeAll(() => {
  if (!fs.existsSync(path.resolve(import.meta.dirname, "../dist/templates"))) {
    throw new Error("Run `npm run build` before the CLI tests");
  }
});

beforeEach(() => {
  cwd = fs.mkdtempSync(path.join(os.tmpdir(), "create-pixi-"));
  fs.writeFileSync(
    path.join(cwd, ".gitconfig"),
    "[user]\n\tname = Test Author\n",
  );
});

afterEach(() => {
  fs.rmSync(cwd, { recursive: true, force: true });
});

describe("create-pixi", () => {
  it("prints the template list with --help, game templates first", () => {
    const { status, stdout } = run(["--help"]);

    expect(status).toBe(0);
    expect(stdout).toContain("bundler-vite-js");
    expect(stdout).toContain("extension-default");
    expect(stdout.indexOf("starter-web")).toBeGreaterThan(0);
    expect(stdout.indexOf("starter-web")).toBeLessThan(
      stdout.indexOf("bundler-vite"),
    );
  });

  it("asks for a platform, then whether to add multiplayer", async () => {
    const { status, stdout } = await answer(
      ["app"],
      [
        ["Select a type of template:", enter],
        ["Select a platform:", down + enter],
        ["Multiplayer?", down + enter],
        ["Select a language:", enter],
      ],
    );

    expect(status).toBe(0);
    // There's only one game, so the CLI doesn't ask for it
    expect(stdout).not.toContain("Select a game:");
    expect(read("app/server/platform.ts")).toContain("instanceId");
  });

  it("scaffolds a single-player game without a server", async () => {
    const { status } = await answer(
      ["app"],
      [
        ["Select a type of template:", enter],
        ["Select a platform:", enter],
        ["Multiplayer?", enter],
        ["Select a language:", down + enter],
      ],
    );

    expect(status).toBe(0);
    expect(exists("app/src/platform.js")).toBe(true);
    expect(exists("app/server")).toBe(false);
  });

  it("only asks about multiplayer for games", async () => {
    const { status, stdout } = await answer(
      ["app"],
      [
        ["Select a type of template:", down + enter],
        ["Select a template:", enter],
        ["Select a language:", enter],
      ],
    );

    expect(status).toBe(0);
    expect(stdout).not.toContain("Multiplayer?");
    expect(exists("app/vite.config.ts")).toBe(true);
  });

  it("asks for the template when the type has only one", async () => {
    const { status } = await answer(
      ["app"],
      [
        ["Select a type of template:", down + down + enter],
        ["Select a template:", enter],
        ["Select a language:", enter],
      ],
    );

    expect(status).toBe(0);
    expect(exists("app/src/App.tsx")).toBe(true);
  });

  it("scaffolds a template non-interactively", () => {
    expect(run(["my-app", "--template", "bundler-vite"]).status).toBe(0);
    expect(readJson("my-app/package.json").name).toBe("my-app");
    expect(exists("my-app/.gitignore")).toBe(true);
    expect(exists("my-app/_gitignore")).toBe(false);
    expect(exists("my-app/src/main.ts")).toBe(true);
  });

  it("fills the author from git config", () => {
    expect(
      run(["my-extension", "--template", "extension-default"]).status,
    ).toBe(0);

    expect(readJson("my-extension/package.json").author).toBe("Test Author");
    expect(read("my-extension/LICENSE")).toContain(
      `Copyright (c) ${new Date().getFullYear()} Test Author`,
    );
  });

  it("scaffolds into an absolute directory", () => {
    const target = path.join(cwd, "nested", "abs-app");

    expect(run([target, "--template", "bundler-vite"]).status).toBe(0);
    expect(readJson("nested/abs-app/package.json").name).toBe("abs-app");
  });

  it("empties the directory but keeps .git with --overwrite yes", () => {
    fs.mkdirSync(path.join(cwd, "app/.git"), { recursive: true });
    fs.writeFileSync(path.join(cwd, "app/old.txt"), "");

    expect(
      run(["app", "-t", "bundler-vite", "--overwrite", "yes"]).status,
    ).toBe(0);
    expect(exists("app/.git")).toBe(true);
    expect(exists("app/old.txt")).toBe(false);
    expect(exists("app/package.json")).toBe(true);
  });

  it("cancels with --overwrite no", () => {
    fs.mkdirSync(path.join(cwd, "app"));
    fs.writeFileSync(path.join(cwd, "app/old.txt"), "");

    expect(run(["app", "-t", "bundler-vite", "--overwrite", "no"]).status).toBe(
      1,
    );
    expect(fs.readdirSync(path.join(cwd, "app"))).toEqual(["old.txt"]);
  });

  it("rejects an invalid --overwrite value", () => {
    fs.mkdirSync(path.join(cwd, "app"));
    fs.writeFileSync(path.join(cwd, "app/old.txt"), "");

    const { status, stderr } = run([
      "app",
      "-t",
      "bundler-vite",
      "--overwrite",
      "n",
    ]);

    expect(status).toBe(1);
    expect(stderr).toContain("must be yes, ignore or no");
    expect(fs.readdirSync(path.join(cwd, "app"))).toEqual(["old.txt"]);
  });

  it("exits 1 when stdin closes before a prompt is answered", () => {
    expect(run(["My App", "-t", "bundler-vite"]).status).toBe(1);
    expect(exists("My App")).toBe(false);
  });

  it("uses --template even when the project name matches a category", () => {
    expect(run(["-t", "framework-react"], {}, "bundler\n").status).toBe(0);
    expect(exists("bundler/src/App.tsx")).toBe(true);
  });

  it("writes .yarnrc.yml for Yarn 2+ only", () => {
    run(["berry", "-t", "bundler-vite"], {
      npm_config_user_agent: "yarn/4.5.0 npm/? node/v24.0.0",
    });
    run(["classic", "-t", "bundler-vite"], {
      npm_config_user_agent: "yarn/1.22.22 npm/? node/v24.0.0",
    });

    expect(exists("berry/.yarnrc.yml")).toBe(true);
    expect(exists("classic/.yarnrc.yml")).toBe(false);
  });
});
