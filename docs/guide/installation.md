# Getting started

create-pixi.js asks a few questions, then writes a small PixiJS project that runs as soon as its dependencies are installed.

## Requirements

- [Node.js](https://nodejs.org/) 22.12 or newer (22.15 or newer for the webpack template). Check with `node --version`.
- npm, yarn, pnpm or bun. npm comes with Node.js.

## Create a project

Run the create command for your package manager:

**npm**

```bash
npm create pixi.js@latest
```

**yarn**

```bash
yarn create pixi.js
```

**pnpm**

```bash
pnpm create pixi.js
```

**bun**

```bash
bun create pixi.js
```

You don't need to install anything first. The package manager downloads create-pixi.js, runs it, and starts the prompts. Keep `@latest` in the npm command so npm doesn't reuse an older copy from its cache.

## Answer the prompts

| Prompt           | When it appears                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Project name     | When you didn't pass a folder. The folder to create, `pixi-project` by default.                                         |
| Target directory | When the folder already has files in it. Cancel, remove the existing files, or keep them and write the template on top. |
| Package name     | When the folder name isn't a valid npm package name, for example because it has capital letters or spaces.              |
| Type of template | Unless you passed `--template`.                                                                                         |
| Game             | For the Game type, when there's more than one game.                                                                     |
| Platform         | For the Game type. Where the game runs, such as the web or Discord.                                                     |
| Multiplayer?     | For the Game type, when the game and the platform both have a multiplayer version.                                      |
| Template         | For the other types.                                                                                                    |
| Language         | When the template comes in both TypeScript and JavaScript.                                                              |

A folder that holds only a `.git` folder counts as empty. The template types are:

- **Game**: A game starter for the platform of your choice, with GSAP, PixiJS UI, PixiJS Sound, PixiJS Filters and Spine. Then pick a platform (Web or Discord Activity) and whether it's multiplayer.
- **Bundler**: A minimal PixiJS app wired up to the build tool of your choice. Then pick Vite, webpack, esbuild, or Import map.
- **Framework**: PixiJS rendered inside a UI framework.
- **Extension**: A library project for publishing your own PixiJS plugin.

[Choosing a template](https://pixijs.io/create-pixi/docs/guide/choosing-a-template.md) compares them side by side.

## Skip the prompts

Pass a folder and `--template` to create a project without any questions:

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

npm needs the extra `--`. Without it, npm reads `--template` as one of its own options instead of passing it to create-pixi.js. yarn, pnpm and bun pass it along as is.

Use `.` as the folder to create the project in the current folder:

**npm**

```bash
npm create pixi.js@latest . -- --template bundler-vite
```

**yarn**

```bash
yarn create pixi.js . --template bundler-vite
```

**pnpm**

```bash
pnpm create pixi.js . --template bundler-vite
```

**bun**

```bash
bun create pixi.js . --template bundler-vite
```

You still get the overwrite prompt if the folder isn't empty. The [CLI reference](https://pixijs.io/create-pixi/docs/guide/cli.md) lists every template id.

## Run it

When it finishes, the CLI prints the commands to run next:

**npm**

```bash
cd my-app
npm install
npm run dev
```

**yarn**

```bash
cd my-app
yarn
yarn dev
```

**pnpm**

```bash
cd my-app
pnpm install
pnpm run dev
```

**bun**

```bash
cd my-app
bun install
bun run dev
```

`dev` starts a development server on <http://localhost:8080>. Every template except esbuild also opens it in your browser.

To make a production build:

**npm**

```bash
npm run build
```

**yarn**

```bash
yarn build
```

**pnpm**

```bash
pnpm run build
```

**bun**

```bash
bun run build
```

The build lints your code, type-checks it in TypeScript templates, and writes the result to `dist/`. Upload that folder to any static host. A few templates work differently: the [import map template](https://pixijs.io/create-pixi/docs/guide/bundlers.md#import-map) has no build step, the [multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) and [Discord](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md) game templates build a Node.js server as well, and the [extension template](https://pixijs.io/create-pixi/docs/guide/extension.md) builds a library.

## Next

- [Choosing a template](https://pixijs.io/create-pixi/docs/guide/choosing-a-template.md) if you haven't picked one yet.
- [Game templates](https://pixijs.io/create-pixi/docs/guide/games.md), [bundler templates](https://pixijs.io/create-pixi/docs/guide/bundlers.md), the [React template](https://pixijs.io/create-pixi/docs/guide/react.md) or the [extension template](https://pixijs.io/create-pixi/docs/guide/extension.md) for what's inside each project.
- [Troubleshooting](https://pixijs.io/create-pixi/docs/guide/troubleshooting.md) if a command fails.
