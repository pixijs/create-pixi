# Choosing a template

Every template is a working PixiJS project. They differ in build tool, in how much code they start you with, and in what you're building.

| Template                                                                                                                | What you get                                                                                                                                                  | Build tool        | TypeScript                    | JavaScript                       |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------- | -------------------------------- |
| [Starter, Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md)Game                                           | A bunny that jumps when you press a button. A standalone browser game built with Vite.                                                                        | Vite              | `starter-web`                 | `starter-web-js`                 |
| [Starter, Web, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#multiplayer)Game                  | A bunny that jumps when you press a button. A standalone browser game built with Vite. Adds a Colyseus server that keeps every player in sync.                | Vite              | `starter-web-multiplayer`     | `starter-web-multiplayer-js`     |
| [Starter, Discord Activity](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md)Game                          | A bunny that jumps when you press a button. Runs inside Discord as an Activity, with Discord sign-in.                                                         | Vite              | `starter-discord`             | `starter-discord-js`             |
| [Starter, Discord Activity, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#multiplayer)Game | A bunny that jumps when you press a button. Runs inside Discord as an Activity, with Discord sign-in. Adds a Colyseus server that keeps every player in sync. | Vite              | `starter-discord-multiplayer` | `starter-discord-multiplayer-js` |
| [Vite](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite)Bundler                                                | Instant dev server that reloads on save. The recommended starting point.                                                                                      | Vite              | `bundler-vite`                | `bundler-vite-js`                |
| [webpack](https://pixijs.io/create-pixi/docs/guide/bundlers.md#webpack)Bundler                                          | webpack with esbuild-loader for fast TypeScript builds.                                                                                                       | webpack           | `bundler-webpack`             | `bundler-webpack-js`             |
| [esbuild](https://pixijs.io/create-pixi/docs/guide/bundlers.md#esbuild)Bundler                                          | Plain esbuild scripts with a live-reloading dev server and no plugins.                                                                                        | esbuild           | `bundler-esbuild`             | `bundler-esbuild-js`             |
| [Import map](https://pixijs.io/create-pixi/docs/guide/bundlers.md#import-map)Bundler                                    | No build step. PixiJS loads from a CDN through a browser import map.                                                                                          | None              | –                             | `bundler-import-map`             |
| [React](https://pixijs.io/create-pixi/docs/guide/react.md)Framework                                                     | React with @pixi/react, built with Vite.                                                                                                                      | Vite              | `framework-react`             | `framework-react-js`             |
| [Default](https://pixijs.io/create-pixi/docs/guide/extension.md)Extension                                               | Build, test, document and publish a PixiJS extension with PixiJS Extension Scripts.                                                                           | Extension Scripts | `extension-default`           | –                                |

## Which one to pick

| If you want                                                     | Use                                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| A browser game with animation, UI, sound, filters and Spine     | [Starter on the web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md)                              |
| A multiplayer game where a server keeps every player in sync    | [Starter on the web, multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md)                   |
| A game that people launch from a Discord channel                | [Starter on Discord](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md)                          |
| A multiplayer game that people play together inside Discord     | [Starter on Discord, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#multiplayer) |
| A blank PixiJS app and no strong opinion on tooling             | [Vite](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite)                                            |
| webpack, because your team or another project already uses it   | [webpack](https://pixijs.io/create-pixi/docs/guide/bundlers.md#webpack)                                      |
| A build you can read in full: two short scripts and no plugins  | [esbuild](https://pixijs.io/create-pixi/docs/guide/bundlers.md#esbuild)                                      |
| No build step, for a quick prototype or a page on a static host | [Import map](https://pixijs.io/create-pixi/docs/guide/bundlers.md#import-map)                                |
| PixiJS inside a React app                                       | [React](https://pixijs.io/create-pixi/docs/guide/react.md)                                                   |
| To publish a library that adds features to PixiJS               | [Extension](https://pixijs.io/create-pixi/docs/guide/extension.md)                                           |

If you're making a game, start with a [game template](https://pixijs.io/create-pixi/docs/guide/games.md): pick the platform it runs on, and whether it's multiplayer. It's the Vite template plus the libraries most games add, and you can remove the ones you don't need. For anything else, or if you're unsure, start with Vite. Its config only sets `base: "./"`, the dev server port and `open: true`. The game and React templates use Vite too, so you can move to them later without learning a new build tool.

## What every app template includes

All templates except the extension template share these:

- A `public/` folder for static files such as images and the favicon.
- A dev server on port 8080. See [change the dev server port](https://pixijs.io/create-pixi/docs/guide/bundlers.md#change-the-dev-server-port).
- [oxlint and oxfmt](https://pixijs.io/create-pixi/docs/guide/linting-and-formatting.md) with `lint` and `format` scripts, plus VS Code settings that use the Oxc extension to lint and format on save.
- A `.gitignore` for `node_modules`, `dist` and editor files.
- [PixiJS 3D](https://pixijs.io/create-pixi/docs/guide/pixijs-3d.md), with a spinning cube that shows 3D and 2D on one stage.

The extension template uses [PixiJS Extension Scripts](https://pixijs.io/create-pixi/docs/guide/extension.md) for building, linting and testing instead, and lists PixiJS 3D as a peer dependency.

## TypeScript or JavaScript

The table above shows which languages each template comes in. When a template has both, pick JavaScript at the language prompt or use its `-js` id. [TypeScript and JavaScript](https://pixijs.io/create-pixi/docs/guide/typescript-and-javascript.md) explains how the two versions differ.
