# Web

The web platform runs the game as a page in any browser, with no SDK and no sign-in.

| Template                                                                        | Id                        | Runs on                                           |
| ------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------- |
| [Starter](https://pixijs.io/create-pixi/docs/guide/games/starter.md)            | `starter-web`             | Any static web host                               |
| [Starter, multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) | `starter-web-multiplayer` | A Node.js host that accepts WebSocket connections |

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

Add `-js` to the id for JavaScript. [Game templates](https://pixijs.io/create-pixi/docs/guide/games.md) covers the files every game template shares, and the [starter game](https://pixijs.io/create-pixi/docs/guide/games/starter.md) covers the scene.

## Platform startup code

`src/main.ts` calls three functions from `src/platform.ts` while the game starts. A plain web page has nothing to start or report, so they do nothing:

```ts title="src/platform.ts"
import type { Application } from "pixi.js";

/**
 * Startup hooks that main.ts calls. A plain web page needs none of them.
 * Other platforms, such as Discord, have their own version of this file that
 * starts their SDK and tells the platform when the game is ready.
 */

/** Runs first, before PixiJS starts */
export async function initPlatform() {}

/** Called while assets load, with progress from 0 to 1 */
export function setLoadingProgress(_progress: number) {}

/**
 * Runs once the scene is on screen and the game can be played. A platform
 * that pauses the game can stop `app.ticker` here.
 */
export function gameReady(_app: Application) {}
```

They're still a good place for your own startup code. For example, add a loading bar to `index.html`, update it from `setLoadingProgress`, and remove it in `gameReady`. See [platform startup code](https://pixijs.io/create-pixi/docs/guide/games.md#platform-startup-code) for when each one runs.

## Scripts

The scripts are the same as the [Vite template](https://pixijs.io/create-pixi/docs/guide/bundlers.md#scripts): `dev` starts the dev server on port 8080, `build` lints, type-checks in TypeScript projects, and writes the game to `dist/`, and `preview` serves that build locally.

## Deploy

Upload `dist/` to any static web host, such as GitHub Pages or itch.io. The build uses relative paths, so it works from any folder.

## Multiplayer

`starter-web-multiplayer` adds a Colyseus game server. Anyone who opens the page joins the game, without signing in. [Multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) covers the server, the scripts and how to deploy it. The web platform adds two files to it.

`src/connect.ts` joins the game's room:

```ts title="src/connect.ts"
import { Client } from "@colyseus/sdk";

import type { server } from "../server/index.ts";

/**
 * Joins a game room on the server that served this page. The scene shows the
 * message of any error this throws.
 */
export async function joinGame() {
  try {
    return await new Client<typeof server>().joinOrCreate("game");
  } catch (error) {
    throw new Error("Can't reach the game server", { cause: error });
  }
}
```

- `new Client()` without a URL connects to the server that served the page, which is the same in development and production.
- `joinOrCreate("game")` joins a `game` room, or creates one if none is open.
- If joining fails, `joinGame()` throws "Can't reach the game server", and the scene shows that message.

`server/platform.ts` tells the game's room who can join and which room they join:

```ts title="server/platform.ts"
import { createRouter } from "colyseus";

// How the game server lets players in. On the web anyone can join any room,
// without options, so none of these change anything. Platforms with sign-in,
// such as Discord Activities, check players and split them into rooms here.

export type JoinOptions = undefined;

/** Runs before a player joins. `true` lets them in without signing in. */
export async function onAuth() {
  return true;
}

/** Join options that split players into separate rooms */
export const filterBy: string[] = [];

/** HTTP routes the platform adds to the game server */
export const routes = createRouter({});
```

On the web, everyone can join, every player joins the same room, and there are no extra routes. [How platforms change the server](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#how-platforms-change-the-server) explains what each export does. To ask players for a name, see [show player names](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#change-the-game).

### Play with friends

The dev server lets in requests through a [cloudflared](https://github.com/cloudflare/cloudflared) quick tunnel, which gives it a public HTTPS address. Start the dev server, then in a second terminal:

```bash
npx cloudflared tunnel --url http://localhost:8080
```

Send the address it prints, such as `https://funky-jogging-bunny.trycloudflare.com`, to your friends. Anyone with it can play on your dev server until you stop the tunnel. See [allowed hosts](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#allowed-hosts) for other tunnels.
