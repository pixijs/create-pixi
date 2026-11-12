# CLI reference

```text
create-pixi [OPTION]... [DIRECTORY]
```

With no arguments, create-pixi.js asks for everything it needs. Arguments answer prompts up front.

## Arguments

| Argument           | Description                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DIRECTORY`        | The folder to create the project in. Use `.` for the current folder. When it's left out, the CLI asks, with `pixi-project` as the default.                |
| `-t`, `--template` | The template id. It answers every template prompt. An unknown id shows the template prompts instead.                                                      |
| `--overwrite`      | Answers the prompt for a folder that isn't empty. `yes` removes the existing files, `ignore` keeps them and writes the template on top, and `no` cancels. |
| `-h`, `--help`     | Prints usage and the list of template ids.                                                                                                                |

The folder name also becomes the `name` in `package.json`. If it isn't a valid npm package name, the CLI asks for one.

## Prompts

The CLI asks only what the arguments don't answer. [Answer the prompts](https://pixijs.io/create-pixi/docs/guide/installation.md#answer-the-prompts) lists each prompt and when it appears.

## Passing options through a package manager

When you run create-pixi.js through `npm create`, put the options after `--`. Otherwise npm treats them as its own:

**npm**

```bash
npm create pixi.js@latest my-app -- --template bundler-vite
```

**yarn**

```bash
yarn create pixi.js my-app --template bundler-vite
```

**pnpm**

```bash
pnpm create pixi.js my-app --template bundler-vite
```

**bun**

```bash
bun create pixi.js my-app --template bundler-vite
```

To run the CLI without prompts, for example in a script or CI job, pass a folder whose name is a valid package name, the template and, if the folder might not be empty, `--overwrite`:

```bash
npm create pixi.js@latest my-app -- --template bundler-vite --overwrite yes
```

The CLI exits with code 1 if it's cancelled or fails, or if `--overwrite` gets a value other than `yes`, `ignore` or `no`.

You can also run the CLI with `npx create-pixi.js`, or install the `create-pixi.js` package globally and run `create-pixi` or `cpa`. Both take the same options without the extra `--`.

## Template ids

| `--template`                     | Template                                                                                                                  | Language   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `starter-web`                    | [Game: Starter, Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md)                                           | TypeScript |
| `starter-web-js`                 | [Game: Starter, Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md)                                           | JavaScript |
| `starter-web-multiplayer`        | [Game: Starter, Web, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#multiplayer)                  | TypeScript |
| `starter-web-multiplayer-js`     | [Game: Starter, Web, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#multiplayer)                  | JavaScript |
| `starter-discord`                | [Game: Starter, Discord Activity](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md)                          | TypeScript |
| `starter-discord-js`             | [Game: Starter, Discord Activity](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md)                          | JavaScript |
| `starter-discord-multiplayer`    | [Game: Starter, Discord Activity, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#multiplayer) | TypeScript |
| `starter-discord-multiplayer-js` | [Game: Starter, Discord Activity, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#multiplayer) | JavaScript |
| `bundler-vite`                   | [Bundler: Vite](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite)                                                | TypeScript |
| `bundler-vite-js`                | [Bundler: Vite](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite)                                                | JavaScript |
| `bundler-webpack`                | [Bundler: webpack](https://pixijs.io/create-pixi/docs/guide/bundlers.md#webpack)                                          | TypeScript |
| `bundler-webpack-js`             | [Bundler: webpack](https://pixijs.io/create-pixi/docs/guide/bundlers.md#webpack)                                          | JavaScript |
| `bundler-esbuild`                | [Bundler: esbuild](https://pixijs.io/create-pixi/docs/guide/bundlers.md#esbuild)                                          | TypeScript |
| `bundler-esbuild-js`             | [Bundler: esbuild](https://pixijs.io/create-pixi/docs/guide/bundlers.md#esbuild)                                          | JavaScript |
| `bundler-import-map`             | [Bundler: Import map](https://pixijs.io/create-pixi/docs/guide/bundlers.md#import-map)                                    | JavaScript |
| `framework-react`                | [Framework: React](https://pixijs.io/create-pixi/docs/guide/react.md)                                                     | TypeScript |
| `framework-react-js`             | [Framework: React](https://pixijs.io/create-pixi/docs/guide/react.md)                                                     | JavaScript |
| `extension-default`              | [Extension: Default](https://pixijs.io/create-pixi/docs/guide/extension.md)                                               | TypeScript |

Game template ids are `<game>-<platform>`, plus `-multiplayer` for the multiplayer version and `-js` for JavaScript. See [game templates](https://pixijs.io/create-pixi/docs/guide/games.md#pick-a-game-and-a-platform).

## What the CLI writes

The CLI copies the template into the folder, renames `_gitignore` to `.gitignore`, and fills in the `name` field of `package.json`. The extension template also gets `author` in `package.json` and `LICENSE`, read from `git config user.name`. With Yarn 2 or newer, the CLI also writes a `.yarnrc.yml` with `nodeLinker: node-modules`, because TypeScript 7's `tsc` can't resolve packages through Plug'n'Play. It doesn't install dependencies or create a git repository. When it finishes, it prints the next commands for the package manager you used.
