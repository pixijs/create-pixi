import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import minimist from "minimist";
import colors from "picocolors";
import prompts from "prompts";

import {
  categories,
  categoryIds,
  findVariant,
  gameTemplateOf,
  games,
  labelOf,
  languageNames,
  multiplayerDescription,
  platforms,
  templatesIn,
  variantOf,
  variants,
} from "../templates/manifest.ts";
import type {
  Category,
  Game,
  Platform,
  TemplateDefinition,
} from "../templates/manifest.ts";
import { installCommand, runCommand } from "./commands.ts";
import { scaffold } from "./scaffold.ts";

const { blue, cyan, dim, green, red, reset, yellow } = colors;

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  template?: string;
  help?: boolean;
  overwrite?: string;
}>(process.argv.slice(2), {
  default: { help: false },
  alias: { h: "help", t: "template" },
  string: ["_", "template", "overwrite"],
});
const cwd = process.cwd();

const categoryColors: Record<Category, (text: string) => string> = {
  game: green,
  bundler: yellow,
  framework: cyan,
  extension: blue,
};

class CancelledError extends Error {}

const idWidth = Math.max(...variants.map(({ id }) => id.length)) + 2;

const helpMessage = `\
Usage: create-pixi [OPTION]... [DIRECTORY]

Create a new PixiJS project.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template
      --overwrite MODE       yes, ignore or no when the directory isn't empty
  -h, --help                 display this message

Available templates:
${variants
  .map(({ id, language, template }) => {
    const suffix = template.languages.length > 1 ? ` (${language})` : "";

    return categoryColors[template.category](
      `  ${id.padEnd(idWidth)}${labelOf(template)}${suffix}`,
    );
  })
  .join("\n")}`;

const defaultTargetDir = "pixi-project";
const overwriteModes = ["yes", "ignore", "no"];

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template;
  const argVariant = argTemplate ? findVariant(argTemplate) : undefined;

  if (argv.help) {
    console.log(helpMessage);
    return;
  }

  if (
    argv.overwrite !== undefined &&
    !overwriteModes.includes(argv.overwrite)
  ) {
    console.error(red("✖") + " --overwrite must be yes, ignore or no");
    process.exitCode = 1;
    return;
  }

  let targetDir = argTargetDir || defaultTargetDir;
  const getProjectName = () => path.basename(path.resolve(targetDir));

  let result: prompts.Answers<
    | "projectName"
    | "overwrite"
    | "packageName"
    | "category"
    | "game"
    | "platform"
    | "multiplayer"
    | "template"
    | "language"
  >;

  prompts.override({
    overwrite: argv.overwrite,
  });

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            {
              title: "Cancel operation",
              value: "no",
            },
            {
              title: "Remove existing files and continue",
              value: "yes",
            },
            {
              title: "Ignore files and continue",
              value: "ignore",
            },
          ],
        },
        {
          type: (_, { overwrite }: { overwrite?: string }) => {
            if (overwrite === "no") {
              throw new CancelledError();
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          type: argVariant ? null : "select",
          name: "category",
          message: reset(
            argTemplate
              ? `"${argTemplate}" isn't a valid template. Please choose from below:`
              : "Select a type of template:",
          ),
          initial: 0,
          choices: categoryIds.map((category) => ({
            title: categoryColors[category](categories[category].name),
            description: categories[category].description,
            value: category,
          })),
        },
        {
          type: (_, { category }: { category?: Category }) =>
            category === "game" && games.length > 1 ? "select" : null,
          name: "game",
          message: reset("Select a game:"),
          choices: games.map((game) => ({
            title: categoryColors.game(game.name),
            description: game.description,
            value: game,
          })),
        },
        {
          type: (_, { category }: { category?: Category }) =>
            category === "game" && platforms.length > 1 ? "select" : null,
          name: "platform",
          message: reset("Select a platform:"),
          choices: platforms.map((platform) => ({
            title: categoryColors.game(platform.name),
            description: platform.description,
            value: platform,
          })),
        },
        {
          type: (_, values) =>
            values.category === "game" &&
            selectedGameTemplate({ ...values, multiplayer: true })
              ? "select"
              : null,
          name: "multiplayer",
          message: reset("Multiplayer?"),
          choices: [
            { title: categoryColors.game("No"), value: false },
            {
              title: categoryColors.game("Yes"),
              description: multiplayerDescription,
              value: true,
            },
          ],
        },
        {
          type: (_, { category }: { category?: Category }) =>
            category && category !== "game" ? "select" : null,
          name: "template",
          message: reset("Select a template:"),
          choices: (_, { category }: { category: Category }) =>
            templatesIn(category).map((template) => ({
              title: categoryColors[category](template.name),
              description: template.description,
              value: template,
            })),
        },
        {
          type: (_, values) =>
            (selectedTemplate(values)?.languages.length ?? 0) > 1
              ? "select"
              : null,
          name: "language",
          message: reset("Select a language:"),
          choices: (_, values) =>
            selectedTemplate(values)!.languages.map((language) => ({
              title: languageNames[language],
              value: language,
            })),
        },
      ],
      {
        onCancel: () => {
          throw new CancelledError();
        },
      },
    );
  } catch (error) {
    if (!(error instanceof CancelledError)) throw error;

    console.log(red("✖") + " Operation cancelled");
    process.exitCode = 1;
    return;
  }

  const { overwrite, packageName } = result;
  const template = selectedTemplate(result);
  const variant =
    argVariant ??
    (template &&
      variantOf(template, result.language ?? template.languages[0]))!;

  const root = path.resolve(cwd, targetDir);

  if (overwrite === "yes") emptyDir(root);

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../templates",
    variant.id,
  );

  scaffold(templateDir, root, {
    packageName: packageName || getProjectName(),
    author: getGitUserName(),
  });

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  const pkgManager = pkgInfo ? pkgInfo.name : "npm";
  const cdProjectName = path.relative(cwd, root);

  // TypeScript 7's native tsc can't resolve modules through Yarn Plug'n'Play
  if (pkgManager === "yarn" && !pkgInfo?.version.startsWith("1.")) {
    fs.writeFileSync(
      path.join(root, ".yarnrc.yml"),
      "nodeLinker: node-modules\n",
    );
  }

  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(
      `  cd ${/[^\w./\\:-]/.test(cdProjectName) ? `"${cdProjectName}"` : cdProjectName}`,
    );
  }
  console.log(`  ${installCommand(pkgManager)}`);
  console.log(`  ${runCommand(pkgManager, "dev")}`);
  console.log(dim(`\nDocs: https://pixijs.io/create-pixi/\n`));
}

interface TemplateAnswers {
  category?: Category;
  game?: Game;
  platform?: Platform;
  multiplayer?: boolean;
  template?: TemplateDefinition;
}

/** Questions that weren't asked take their only answer */
function selectedGameTemplate({
  game = games[0],
  platform = platforms[0],
  multiplayer = false,
}: TemplateAnswers) {
  return gameTemplateOf(game, platform, multiplayer);
}

function selectedTemplate(values: TemplateAnswers) {
  if (values.category === "game") return selectedGameTemplate(values);

  return values.template;
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/[\\/]+$/g, "");
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  );
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

function getGitUserName() {
  const { status, stdout } = spawnSync("git", ["config", "user.name"], {
    encoding: "utf8",
  });

  return status === 0 ? stdout.trim() : undefined;
}

let settled = false;

init()
  .catch((error: Error) => {
    console.error(red("✖") + " " + error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    settled = true;
  });

// A prompt never resolves when stdin closes before it's answered, e.g. in a non-interactive shell
process.once("beforeExit", () => {
  if (settled) return;

  console.log("\n" + red("✖") + " Operation cancelled");
  process.exitCode = 1;
});
