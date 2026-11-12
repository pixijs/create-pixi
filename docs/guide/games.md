# Game templates

A game template is a game, set up for the platform it runs on, with an optional multiplayer server. Every game template comes with the libraries most PixiJS games end up adding:

- [GSAP](https://gsap.com) to animate anything with tweens and timelines.
- [PixiJS UI](https://pixijs.io/ui/) for buttons, sliders, checkboxes, scroll boxes and other controls.
- [PixiJS Sound](https://github.com/pixijs/sound) to load and play sound effects and music.
- [PixiJS Filters](https://github.com/pixijs/filters) for visual effects such as glow, outline and blur.
- [Spine](https://esotericsoftware.com/spine-pixi) to play skeletal animations made in the Spine editor.

Like every app template, they also come with [PixiJS 3D](https://pixijs.io/create-pixi/docs/guide/pixijs-3d.md).

There's no engine, screen manager or asset pipeline. A single-player web project's code is five short files you can read in a few minutes and change however your game needs.

## Pick a game and a platform

When you choose the Game type, create-pixi.js asks which platform the game runs on and whether it's multiplayer:

- The **game** is what's on screen. The [starter game](https://pixijs.io/create-pixi/docs/guide/games/starter.md) is a bunny that jumps when you press a button.
- The **platform** is where the game runs. [Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md) builds a page for any web host. [Discord](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md) runs the game as an Activity that players launch in a Discord channel, signed in with their Discord account.
- **[Multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md)** adds a [Colyseus](https://colyseus.io) server that keeps every player in sync.

Each combination has its own id, `<game>-<platform>`, plus `-multiplayer` for the multiplayer version:

| Game                                                                 | Platform                                                                          | Single-player     | Multiplayer                   |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------- | ----------------------------- |
| [Starter](https://pixijs.io/create-pixi/docs/guide/games/starter.md) | [Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md)                  | `starter-web`     | `starter-web-multiplayer`     |
| [Starter](https://pixijs.io/create-pixi/docs/guide/games/starter.md) | [Discord Activity](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md) | `starter-discord` | `starter-discord-multiplayer` |

**npm**

```bash
npm create pixi.js@latest my-game -- --template starter-web
```

**yarn**

```bash
yarn create pixi.js my-game --template starter-web
```

**pnpm**

```bash
pnpm create pixi.js my-game --template starter-web
```

**bun**

```bash
bun create pixi.js my-game --template starter-web
```

Add `-js` to any of these ids for JavaScript, such as `starter-web-js`. Every game template is built on the [Vite template](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite), so its `public/` folder and dev port work the same way.

## Project structure

This is `starter-web`:

```text
my-game/
├── public/
│   ├── assets/
│   │   ├── sounds/
│   │   │   └── sfx-press.wav
│   │   ├── bunny.png
│   │   └── button.png
│   ├── favicon.png
│   └── style.css
├── src/
│   ├── assets.ts
│   ├── cube.ts
│   ├── main.ts
│   ├── platform.ts
│   ├── scene.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Config files for oxlint, oxfmt, VS Code and git sit at the root as in every template. The files in `src/` split the work between the game and the platform:

| File              | Comes from          | What it does                                                                 |
| ----------------- | ------------------- | ---------------------------------------------------------------------------- |
| `src/main.ts`     | Every game template | Starts PixiJS, loads the assets and adds the scene                           |
| `src/assets.ts`   | The game            | Lists the files in `public/assets/` to load before the game starts           |
| `src/scene.ts`    | The game            | Builds what's on screen                                                      |
| `src/cube.ts`     | The game            | Draws the spinning 3D cube behind the bunny                                  |
| `src/platform.ts` | The platform        | Starts the platform's SDK, if it has one, and tells it how the game is doing |

The game's files are the same on every platform, so `src/scene.ts` in `starter-web` and in `starter-discord` is the same file. The [Discord platform](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#project-structure) adds a sign-in server and a few config files, and [multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#project-structure) adds a `server/` folder and `src/connect.ts`.

## Start the game

```ts title="src/main.ts"
// Registers PixiJS 3D, so app.init loads its WebGL or WebGPU code. Keep this
// import here even if your 3D code moves to a lazily loaded file.
import "@pixi/3d";
// Registers the asset loader for sound files
import "@pixi/sound";
import { Application, Assets } from "pixi.js";

import { assets } from "./assets.ts";
import { gameReady, initPlatform, setLoadingProgress } from "./platform.ts";
import { createScene } from "./scene.ts";

await initPlatform();

const app = new Application();

await app.init({
  background: "#1099bb",
  resizeTo: window,
  // Capped at 2: a 3x phone screen looks almost the same at 2, and the canvas
  // needs less than half the memory
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
  antialias: true,
});

document.getElementById("pixi-container")!.appendChild(app.canvas);

await Assets.load(assets, setLoadingProgress);

app.stage.addChild(createScene(app));

gameReady(app);
```

The `@pixi/3d` import at the top registers [PixiJS 3D](https://pixijs.io/create-pixi/docs/guide/pixijs-3d.md) before `app.init` runs, so a `View3D` draws anywhere in the game, including in code that loads later. The `@pixi/sound` import adds a loader to `Assets`, so `Assets.load` loads sound files the same way it loads images. Spine files load the same way once a file imports `Spine`, as in [add a Spine animation](#add-a-spine-animation). `Assets.load` loads the list in `src/assets.ts`, which gives each file an alias, so the rest of the code asks for `"bunny"` instead of a path. See [the starter's assets](https://pixijs.io/create-pixi/docs/guide/games/starter.md#the-assets) and [static assets](https://pixijs.io/create-pixi/docs/guide/bundlers.md#static-assets) for how paths work.

`resizeTo: window` keeps the canvas the size of the window. `resolution` and `autoDensity` render at the screen's pixel density, up to 2, so sprites and text stay sharp on phones and high-DPI displays. `antialias` smooths the edges of 3D shapes.

`initPlatform`, `setLoadingProgress` and `gameReady` come from `src/platform.ts`. See [platform startup code](#platform-startup-code).

## Platform startup code

`src/platform.ts` holds the startup code that changes from platform to platform. Every platform's version exports the three functions `main.ts` calls:

| Function                       | When `main.ts` calls it                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `initPlatform()`               | First, before PixiJS starts. `main.ts` waits until it finishes. |
| `setLoadingProgress(progress)` | While the assets load, with progress from 0 to 1                |
| `gameReady(app)`               | Once the scene is on screen and the game can be played          |

A platform with its own SDK, such as a game portal or a chat app that runs games, usually asks for three things: start the SDK before the game, report loading progress, and say when the game is ready to play. Each of those calls goes in one of these functions, so `main.ts` and the game's files stay the same on every platform. When the platform pauses the game, for example because the player switched away, stopping `app.ticker` isn't enough: GSAP and PixiJS Sound keep their own time, so also call `gsap.globalTimeline.pause()` and `sound.pauseAll()`.

On the [web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#platform-startup-code), the three functions do nothing. On [Discord](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#the-discord-sdk), `initPlatform` starts the Discord SDK and signs the player in. A platform's `src/platform.ts` can export more than these three, as Discord's does to share the signed-in player with the game.

## Add a Spine animation

The templates have the Spine runtime, `@esotericsoftware/spine-pixi-v8` 4.3.13, but no Spine files. To add a character:

1. Export the skeleton from the Spine editor as binary (`.skel`) or JSON (`.json`), with a texture atlas. Use Spine 4.3. The runtime can't read exports from other editor versions. A Spine 4.2 export, for example, fails with `Bone name must not be null`.

2. Copy the skeleton file, the `.atlas` file and the atlas `.png` into `public/assets/`. Keep the `.png` next to the `.atlas`, which refers to it by name.

3. Add the skeleton and the atlas to the [list in `src/assets.ts`](https://pixijs.io/create-pixi/docs/guide/games/starter.md#the-assets), each with its own alias:

   ```ts title="src/assets.ts"
   { alias: "spineboy-data", src: "assets/spineboy-pro.skel" },
   { alias: "spineboy-atlas", src: "assets/spineboy-pma.atlas" },
   ```

4. Import `Spine` at the top of `src/scene.ts`:

   ```ts title="src/scene.ts"
   import { Spine } from "@esotericsoftware/spine-pixi-v8";
   ```

   Then create the character inside `createScene` and play an animation:

   ```ts title="src/scene.ts"
   const spineboy = Spine.from({
     skeleton: "spineboy-data",
     atlas: "spineboy-atlas",
     scale: 0.5,
   });

   spineboy.state.setAnimation(0, "run", true);
   scene.addChild(spineboy);
   ```

`setAnimation(track, name, loop)` takes an animation name from the Spine project. To try this without your own files, download `spineboy-pro.skel`, `spineboy-pma.atlas` and `spineboy-pma.png` from the [Spine runtimes examples](https://github.com/EsotericSoftware/spine-runtimes/tree/4.3/examples/spineboy/export).

The [spine-pixi documentation](https://esotericsoftware.com/spine-pixi) covers mixing animations, skins, attaching PixiJS objects to bones, and the other `Spine` options.

Using Spine adds about 200 kB to the build. In `starter-web`, that takes the game past Vite's 500 kB default, so `vite build` prints a chunk size warning. The warning is advice, not an error. To hide it, raise `build.chunkSizeWarningLimit` in `vite.config.ts`, as the multiplayer and Discord templates do.

## Remove a library you don't use

Each library is one dependency and a few lines of code. To remove PixiJS Sound, for example, delete the `@pixi/sound` imports from `src/main.ts` and `src/scene.ts`, the sound from the list in `src/assets.ts`, and the `sound.play` call, then uninstall it:

```bash
npm uninstall @pixi/sound
```

If any file still imports it, `build` fails and names the file. Spine adds nothing to the build until a file imports it.

To remove PixiJS 3D, follow [remove it](https://pixijs.io/create-pixi/docs/guide/pixijs-3d.md#remove-it).

## Scripts

Every game template has `dev`, `build` and `preview`. `dev` starts the dev server on port 8080, and `build` lints, type-checks in TypeScript projects, and builds the game. Where the build goes, and what `preview` runs, depends on your choices:

|         | Single-player                                                                                                                         | Multiplayer                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Web     | Static files in `dist/` for any web host. See [deploy](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#deploy).             | The game and a Node.js game server in `dist/`. See [deploy](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#deploy).       |
| Discord | The game and a Node.js sign-in server in `dist/`. See [deploy](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#deploy). | The game and a Node.js game server in `dist/`. See [deploy](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#deploy). |

## Learn more

- [GSAP documentation](https://gsap.com/docs/v3/), including [timelines](https://gsap.com/docs/v3/GSAP/Timeline/) and easing.
- [PixiJS UI storybook](https://pixijs.io/ui/storybook/) and [PixiJS Sound examples](https://pixijs.io/sound/examples/).
- [PixiJS assets guide](https://pixijs.com/8.x/guides/components/assets) for bundles, background loading and other ways to load files.
- [Open Games](https://github.com/pixijs/open-games), complete games built with PixiJS and the same libraries.
