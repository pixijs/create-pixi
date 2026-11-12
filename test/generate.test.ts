import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { generate } from "../templates/generate.ts";
import type { TemplateFiles } from "../templates/generate.ts";
import { findVariant, variants } from "../templates/manifest.ts";
import type { TemplateVariant } from "../templates/manifest.ts";

const generated = new Map<string, Promise<TemplateFiles>>();

function generateOnce(variant: TemplateVariant) {
  const files = generated.get(variant.id) ?? generate(variant);

  generated.set(variant.id, files);

  return files;
}

function readRepoFile(file: string) {
  return fs.readFileSync(path.resolve(import.meta.dirname, "..", file), "utf8");
}

async function readGenerated(id: string, file: string) {
  const files = await generateOnce(findVariant(id)!);

  return String(files.get(file));
}

async function readJson(id: string, file: string) {
  return JSON.parse(await readGenerated(id, file));
}

const scriptPath = String.raw`[\w/.-]+\.[mc]?[jt]sx?`;
const sourceReference = new RegExp(
  String.raw`["'](?:\.?/)?((?:src|server)/${scriptPath})["']`,
  "g",
);
const relativeImport = new RegExp(
  String.raw`(?:from\s+|import\(\s*)["'](\.\.?/${scriptPath})["']`,
  "g",
);

describe("layers", () => {
  it("deep-merges JSON files", async () => {
    const { compilerOptions } = await readJson(
      "framework-react",
      "tsconfig.json",
    );

    expect(compilerOptions).toMatchObject({ strict: true, jsx: "react-jsx" });
  });

  it("replaces JSON arrays instead of merging them", async () => {
    const { plugins } = await readJson("framework-react-js", ".oxlintrc.json");

    expect(plugins).toEqual(["unicorn", "oxc", "import", "react"]);
  });

  it("concatenates _gitignore files", async () => {
    const { template } = findVariant("extension-default")!;
    const files = await generate({
      id: "gitignore-test",
      language: "ts",
      template: { ...template, layers: ["stack/base", "stack/extension"] },
    });
    const gitignore = String(files.get("_gitignore"));

    expect(gitignore).toMatch(/^node_modules$/m);
    expect(gitignore).toMatch(/^example\.api\.json\*$/m);
  });
});

describe.each(variants)("$id", (variant) => {
  it("resolves every catalog version", async () => {
    const pkg = await readJson(variant.id, "package.json");

    expect(pkg.name).toBe("{{packageName}}");
    expect(JSON.stringify(pkg)).not.toContain("catalog:");
  });

  it("only references source files that exist", async () => {
    const files = await generateOnce(variant);

    for (const [file, content] of files) {
      if (typeof content !== "string") continue;

      const references = Array.from(
        content.matchAll(sourceReference),
        ([, reference]) => reference,
      );

      // Only scripts are checked for relative paths, since other files point at build output
      if (/\.[mc]?[jt]sx?$/.test(file)) {
        for (const [, reference] of content.matchAll(relativeImport)) {
          references.push(path.posix.join(path.posix.dirname(file), reference));
        }
      }

      for (const reference of references) {
        expect(files.has(reference), `${file} references ${reference}`).toBe(
          true,
        );
      }
    }
  });
});

describe.each(variants.filter(({ language }) => language === "js"))(
  "$id",
  (variant) => {
    it("contains no TypeScript", async () => {
      const files = await generateOnce(variant);
      const pkg = await readJson(variant.id, "package.json");

      for (const file of files.keys()) {
        expect(path.posix.extname(file)).not.toMatch(/^\.[mc]?tsx?$/);
        expect(path.posix.basename(file)).not.toMatch(/^tsconfig/);
      }

      expect(pkg.devDependencies.typescript).toBeUndefined();
      expect(Object.values(pkg.scripts).join(" ")).not.toMatch(/\btsc\b/);
    });

    it("has no TypeScript lint rules", async () => {
      const oxlint = await readJson(variant.id, ".oxlintrc.json");

      expect(oxlint.plugins).not.toContain("typescript");
      expect(Object.keys(oxlint.rules ?? {}).join()).not.toContain(
        "typescript/",
      );
    });
  },
);

describe.each(
  variants.filter(
    ({ language, template }) =>
      language === "js" && template.languages.includes("ts"),
  ),
)("$id", ({ id, template }) => {
  it("has the same scripts as the TypeScript variant", async () => {
    const js = await readJson(id, "package.json");
    const ts = await readJson(template.id, "package.json");

    expect(Object.keys(js.scripts)).toEqual(Object.keys(ts.scripts));
  });
});

describe.each(
  variants.filter(({ template }) =>
    template.layers.includes("platforms/discord/core"),
  ),
)("$id", (variant) => {
  it("ignores the .env file that holds the client secret", async () => {
    const files = await generateOnce(variant);

    expect(String(files.get("_gitignore"))).toMatch(/^\.env$/m);
  });

  it("keeps the client secret out of the game code", async () => {
    const files = await generateOnce(variant);

    for (const [file, content] of files) {
      if (file.startsWith("src/")) {
        expect(String(content), file).not.toContain("CLIENT_SECRET");
      }
    }
  });
});

describe.each(
  variants.filter(({ template }) =>
    template.layers.includes("platforms/discord/single-player"),
  ),
)("$id", (variant) => {
  it("doesn't install Colyseus", async () => {
    const pkg = await readJson(variant.id, "package.json");

    expect(pkg.dependencies.colyseus).toBeUndefined();
  });
});

describe("bundler-import-map", () => {
  // stack/import-map/src/main.js is a hand-written copy of stack/vanilla/src/main.ts
  it("matches the vanilla example apart from the asset path", async () => {
    const importMap = await generateOnce(findVariant("bundler-import-map")!);
    const vanilla = await generateOnce(findVariant("bundler-vite-js")!);

    expect(
      String(importMap.get("src/main.js")).replace(
        "./public/assets/bunny.png",
        "assets/bunny.png",
      ),
    ).toBe(String(vanilla.get("src/main.js")));
  });
});

describe.each([
  [
    "bundler-import-map index.html",
    () => readGenerated("bundler-import-map", "index.html"),
  ],
  [
    "extension-default examples/index.html",
    () => readGenerated("extension-default", "examples/index.html"),
  ],
  [
    "docs/docs/guide/bundlers.mdx",
    () => readRepoFile("docs/docs/guide/bundlers.mdx"),
  ],
])("%s", (_, read) => {
  // The CDN URLs are hand-written, so they can drift from the catalog
  it("loads the catalog versions", async () => {
    const { dependencies }: { dependencies: Record<string, string> } =
      JSON.parse(readRepoFile("templates/package.json"));
    const exactVersion = (name: string) =>
      dependencies[name].replace(/^\D+/, "");
    const [, importMap] = (await read()).match(
      /<script type="importmap">([\s\S]*?)<\/script>/,
    )!;
    const { imports }: { imports: Record<string, string> } =
      JSON.parse(importMap);

    expect(imports["pixi.js"]).toContain(
      `/pixi.js@${exactVersion("pixi.js").split(".")[0]}/`,
    );
    expect(imports["@pixi/3d"]).toContain(
      `/@pixi/3d@${exactVersion("@pixi/3d")}/`,
    );
    // The extras file imports the engine file next to it, so a different
    // folder or build would load a second engine
    expect(imports["@pixi/3d/extras"]).toBe(
      imports["@pixi/3d"].replace(
        /pixijs-3d(\.min)?\.mjs$/,
        "pixijs-3d-extras$1.mjs",
      ),
    );
  });
});

describe("README.md", () => {
  it("lists every template", () => {
    const readme = readRepoFile("README.md");

    for (const { id } of variants) expect(readme).toContain(`\`${id}\``);
  });
});
