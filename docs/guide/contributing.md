# Contributing

create-pixi.js lives at [github.com/pixijs/create-pixi](https://github.com/pixijs/create-pixi). Bug reports, template fixes and docs changes are all welcome.

## Set up the repository

```bash
git clone https://github.com/pixijs/create-pixi.git
cd create-pixi
npm install
npm run build
npm test
```

You need Node.js 22.18 or newer to run the TypeScript build scripts. `npm run build` builds the CLI and generates every template into `dist/templates/`. Run the built CLI with `npm start`.

## How templates are made

The templates aren't stored as finished projects. Each one is put together from shared layers when the package is built, so a file that several templates use lives in one place. `templates/manifest.ts` lists every template and its layers, and `templates/package.json` holds every dependency version.

Game templates aren't listed one by one. The manifest lists games, in `templates/layers/games/`, and platforms, in `templates/layers/platforms/`, and puts every game on every platform, with a multiplayer version when both the game and the platform have one.

The CLI prompts, its `--help` output and the template lists on this site all read from `templates/manifest.ts`.

[templates/README.md](https://github.com/pixijs/create-pixi/blob/main/templates/README.md) explains how layers combine, how the JavaScript versions are generated, and how to add a template, a game or a platform.

## Try a template while you edit it

```bash
npm run play -- bundler-vite
```

This generates the template into `playground/bundler-vite`, installs its dependencies, starts its dev server, and regenerates the template when files in `templates/layers` change.

To check a template the way CI does, scaffold it with the built CLI, install, lint, check formatting and build:

```bash
npm run verify -- bundler-vite framework-react-js
```

## Work on these docs

The site is in `docs/` and uses [Docusaurus](https://docusaurus.io). From the repository root:

```bash
npm run start:docs
```

Pages are in `docs/docs/guide/`. The [docs README](https://github.com/pixijs/create-pixi/blob/main/docs/README.md) has the build and deploy commands.
