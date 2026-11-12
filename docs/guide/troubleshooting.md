# Troubleshooting

## pnpm fails with ERR_PNPM_DLX_MULTIPLE_BINS

```text
ERR_PNPM_DLX_MULTIPLE_BINS  Could not determine executable to run. create-pixi.js has multiple binaries: cpa, create-pixi
```

create-pixi.js 1.4.0 and earlier had two commands, `cpa` and `create-pixi`, and `pnpm create` couldn't tell which one to run. Newer versions have a `create-pixi.js` command, named after the package, which is the one pnpm runs. Ask for the latest version:

```bash
pnpm create pixi.js@latest
```

pnpm reuses a package it ran in the last 24 hours. If you still get the error, skip that cache:

```bash
pnpm --config.dlx-cache-max-age=0 create pixi.js@latest
```

To run an older version anyway, name the command yourself: `pnpm --package=create-pixi.js dlx create-pixi`.

## yarn create fails with yarn 1

`yarn create pixi.js` in yarn 1 installs `create-pixi.js` globally and runs a command with the same name. Versions 1.4.0 and earlier didn't have a `create-pixi.js` command, so yarn couldn't find anything to run. Newer versions do.

If you have an old version installed globally, update it, then run the create command again:

```bash
yarn global upgrade create-pixi.js
yarn create pixi.js
```

## Node.js version errors

The templates need Node.js 22.12 or newer, because Vite, oxlint and oxfmt do. The webpack template needs 22.15 or newer for webpack-dev-server 6. On an older version, `npm install` prints `npm warn EBADENGINE Unsupported engine`, and the Vite templates stop with a message that names the Node.js versions Vite supports.

Check your version:

```bash
node --version
```

Install the current LTS release from [nodejs.org](https://nodejs.org/) or through a version manager such as [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm). Then delete `node_modules` and install again, because some packages download a build for the Node.js version that installed them.

## npm warns about install scripts not covered by allowScripts

```text
npm warn allow-scripts   sharp@0.34.5 (install: node install/check.js || npm run build)
```

npm 11.16 and newer list dependencies whose install scripts aren't covered by `allowScripts` in `package.json`. The templates that use esbuild already allow its script, so you'll usually see this after adding a package such as `sharp`. A new multiplayer project lists `msgpackr-extract`, an optional native add-on that makes Colyseus encode and decode messages faster in Node.js. The scripts still run, and the project works. To stop the warning, approve the packages you trust, which records them in `package.json`:

```bash
npm approve-scripts sharp
```

## npm install fails with spawn git

```text
npm error code ENOENT
npm error syscall spawn git
npm error enoent An unknown git error occurred
```

This happens in a new multiplayer project on a machine without Git. Colyseus lists `@colyseus/uwebsockets-transport` as a peer dependency, so npm installs it too, along with `uWebSockets.js`, which comes from GitHub instead of the npm registry. The template doesn't use it, but npm needs [Git](https://git-scm.com/downloads) to look up that version the first time. Install Git, then run `npm install` again. Once the project has a `package-lock.json`, `npm ci` works without Git.

## Importing GLSL shader files

You don't need a plugin to load shaders in the game, Vite and React templates. Add `?raw` to the import and Vite gives you the file contents as a string:

```ts
import { Filter, GlProgram } from "pixi.js";

import fragment from "./shaders/wave.frag?raw";
import vertex from "./shaders/wave.vert?raw";

const filter = new Filter({
  glProgram: new GlProgram({ vertex, fragment }),
});
```

TypeScript already knows the type of `?raw` imports through `src/vite-env.d.ts`. See [importing an asset as a string](https://vite.dev/guide/assets#importing-asset-as-string) in the Vite docs. For shader `#include` support, the [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) plugin is an option.

## A View3D draws nothing

The app started before `@pixi/3d` was imported, so its renderer has no 3D code. This happens when 3D code is in a file that loads after `app.init`. Import `@pixi/3d` at the top of your entry file, as [PixiJS 3D](https://pixijs.io/create-pixi/docs/guide/pixijs-3d.md#how-its-set-up) shows. With an import map, load `pixi.js` only through the map, not a `<script>` tag.

## The dev server port is already in use

Something else is using port 8080. Stop it, or [change the dev server port](https://pixijs.io/create-pixi/docs/guide/bundlers.md#change-the-dev-server-port).

## Discord Activity problems

The Discord guide has its own [troubleshooting](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#troubleshooting) section, for an Activity that stays blank, sign-in that fails, and an app missing from the App Launcher.

## Something else

Search the [issues on GitHub](https://github.com/pixijs/create-pixi/issues), or ask in the [PixiJS Discord](https://discord.gg/CPTjeb28nH).
