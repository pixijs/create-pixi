import fs from "node:fs";
import path from "node:path";

import { format } from "oxfmt";
import { transform } from "sucrase";

import type { Layer, TemplateVariant } from "./manifest.ts";

/** Generated files keyed by POSIX path relative to the template root */
export type TemplateFiles = Map<string, Buffer | string>;

type Json = Record<string, unknown>;

export const layersDir = path.join(import.meta.dirname, "layers");

const catalogPath = path.join(import.meta.dirname, "package.json");

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

const scriptOrder = ["start", "dev", "build", "preview"];

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
] as const;

/**
 * Builds a template variant from its layers:
 * - files from later layers replace earlier ones
 * - JSON files deep-merge, `_gitignore` files concatenate
 * - `"catalog:"` versions resolve from `templates/package.json`
 * - package.json scripts are ordered start, dev, build, preview, then the rest
 * - JavaScript variants have their TypeScript stripped
 * - text files are formatted with the template's oxfmt config
 */
export async function generate(variant: TemplateVariant) {
  const files: TemplateFiles = new Map();

  for (const layer of variant.template.layers) {
    for (const [file, content] of readLayer(layer)) {
      const existing = files.get(file);

      if (existing === undefined) {
        files.set(file, content);
      } else if (file.endsWith(".json")) {
        files.set(file, mergeJson(existing, content));
      } else if (path.posix.basename(file) === "_gitignore") {
        files.set(file, `${String(existing).trimEnd()}\n\n${content}`);
      } else {
        files.set(file, content);
      }
    }
  }

  finalizePackageJson(files);

  if (variant.language === "js") {
    convertToJavaScript(files);
  }

  await formatFiles(files);

  return files;
}

/** Unchanged files are left alone so file watchers only see real edits */
export function writeFiles(files: TemplateFiles, dir: string) {
  for (const [file, content] of files) {
    const target = path.join(dir, file);

    if (
      fs.existsSync(target) &&
      fs.readFileSync(target).equals(Buffer.from(content))
    ) {
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

/** A layer's files, keyed by POSIX path relative to the layer */
export function readLayer(layer: Layer) {
  const dir = path.join(layersDir, layer);

  if (!fs.existsSync(dir)) {
    throw new Error(`Layer "${layer}" does not exist in ${layersDir}`);
  }

  const files: TemplateFiles = new Map();

  for (const entry of fs.readdirSync(dir, {
    recursive: true,
    encoding: "utf8",
  })) {
    const source = path.join(dir, entry);

    if (path.basename(entry) === ".DS_Store" || !fs.statSync(source).isFile()) {
      continue;
    }

    const file = entry.split(path.sep).join("/");
    const content = fs.readFileSync(source);

    files.set(file, isText(file) ? content.toString("utf8") : content);
  }

  return files;
}

function isText(file: string) {
  return (
    textExtensions.has(path.posix.extname(file)) ||
    path.posix.basename(file) === "_gitignore"
  );
}

function mergeJson(base: Buffer | string, override: Buffer | string) {
  const merged = deepMerge(
    JSON.parse(String(base)),
    JSON.parse(String(override)),
  );

  return `${JSON.stringify(merged, null, 2)}\n`;
}

function deepMerge(base: Json, override: Json): Json {
  const result: Json = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = result[key];

    result[key] =
      isObject(current) && isObject(value) ? deepMerge(current, value) : value;
  }

  return result;
}

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCatalog(): Record<string, string> {
  const pkg = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

  return { ...pkg.dependencies, ...pkg.devDependencies };
}

function finalizePackageJson(files: TemplateFiles) {
  const catalog = readCatalog();

  updateJson(files, "package.json", (pkg) => {
    const scripts = Object.entries((pkg.scripts ?? {}) as Json);
    const rank = (name: string) =>
      scriptOrder.includes(name)
        ? scriptOrder.indexOf(name)
        : scriptOrder.length;

    pkg.scripts = Object.fromEntries(
      scripts.sort(([a], [b]) => rank(a) - rank(b)),
    );

    for (const field of dependencyFields) {
      const deps = pkg[field] as Record<string, string> | undefined;

      if (!deps) continue;

      for (const [name, version] of Object.entries(deps)) {
        if (version !== "catalog:") continue;

        const resolved = catalog[name];

        if (!resolved) {
          throw new Error(`"${name}" is missing from ${catalogPath}`);
        }

        deps[name] = resolved;
      }
    }
  });
}

function convertToJavaScript(files: TemplateFiles) {
  const renamed = new Map<string, string>();

  for (const [file, content] of Array.from(files)) {
    const basename = path.posix.basename(file);

    if (
      /^tsconfig(\..+)?\.json$/.test(basename) ||
      /\.d\.[mc]?ts$/.test(file)
    ) {
      files.delete(file);
      continue;
    }

    const jsFile = file.replace(/\.([mc]?)ts(x?)$/, ".$1js$2");

    if (jsFile === file) continue;

    files.delete(file);
    files.set(jsFile, stripTypes(String(content), file));
    renamed.set(basename, path.posix.basename(jsFile));
  }

  // Point entry files, imports and configs at the renamed files
  for (const [file, content] of files) {
    if (!isText(file)) continue;

    let text = String(content);

    for (const [from, to] of renamed) {
      text = text.replace(
        new RegExp(
          `(?<=[\\s/"'\`(=])${escapeRegExp(from)}(?=[\\s"'\`)?#]|$)`,
          "gm",
        ),
        to,
      );
    }

    files.set(file, text);
  }

  updateJson(files, "package.json", (pkg) => {
    delete (pkg.devDependencies as Json | undefined)?.typescript;

    const scripts = (pkg.scripts ?? {}) as Record<string, string>;

    for (const [name, script] of Object.entries(scripts)) {
      scripts[name] = script.replace(/\btsc\b[^&|;]*&&\s*/g, "");
    }
  });

  updateJson(files, ".oxlintrc.json", (config) => {
    const rules = (config.rules ?? {}) as Json;

    config.plugins = (config.plugins as string[] | undefined)?.filter(
      (plugin) => plugin !== "typescript",
    );

    for (const rule of Object.keys(rules)) {
      if (rule.startsWith("typescript/")) delete rules[rule];
    }
  });
}

function stripTypes(code: string, file: string) {
  return transform(code, {
    transforms: file.endsWith("x") ? ["typescript", "jsx"] : ["typescript"],
    jsxRuntime: "preserve",
    disableESTransforms: true,
    filePath: file,
  }).code;
}

async function formatFiles(files: TemplateFiles) {
  const config = files.get(".oxfmtrc.json");

  if (config === undefined) return;

  const options = JSON.parse(String(config));

  delete options.$schema;

  for (const [file, content] of files) {
    if (typeof content !== "string") continue;

    const { code, errors } = await format(file, content, options);
    const [error] = errors;

    if (!error) {
      files.set(file, code);
    } else if (!error.message.startsWith("Unsupported file type")) {
      throw new Error(`Failed to format ${file}: ${error.message}`);
    }
  }
}

function updateJson(
  files: TemplateFiles,
  file: string,
  update: (json: Json) => void,
) {
  const content = files.get(file);

  if (content === undefined) {
    throw new Error(`Template has no ${file}`);
  }

  const json = JSON.parse(String(content));

  update(json);
  files.set(file, `${JSON.stringify(json, null, 2)}\n`);
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
