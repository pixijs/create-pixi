# PixiJS Create

<div align="center">

<img src=".github/logo.svg" alt="Logo"/>
<p>A CLI tool to scaffold PixiJS projects</p>

</div>

## Scaffolding Your First PixiJS Project

> **Compatibility Note:**
> PixiJS requires [Node.js](https://nodejs.org/en/) version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

With NPM:

```bash
$ npm create pixijs@latest
```

With Yarn:

```bash
$ yarn create pixijs
```

With PNPM:

```bash
$ pnpm create pixijs
```

With Bun:

```bash
$ bun create pixijs
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a PixiJS + Vite project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create pixijs@latest pixi-project -- --template bundler-vite

# yarn
yarn create pixijs pixi-project --template bundler-vite

# pnpm
pnpm create pixijs pixi-project --template bundler-vite

# Bun
bun create pixijs pixi-project --template bundler-vite
```

Currently supported template presets include:

- `bundler-vite`
- `bundler-webpack`
- `bundler-esbuild`
- `bundler-import-map`
- `bundler-parcel`

We also have some additional templates that you can use for creating games for specific platforms:
- `game-web`
- `game-discord`
- `game-facebook`
- `game-youtube`

There is also a template for generating a pixi plugin that follows our guidelines:

- `plugin`

You can use `.` for the project name to scaffold in the current directory.
