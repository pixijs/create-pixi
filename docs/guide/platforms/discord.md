# Discord Activity

The Discord platform runs the game inside Discord as an [Activity](https://docs.discord.com/developers/activities/overview). Players launch it from the App Launcher in a Discord channel, and the game signs them in with their Discord account.

| Template                                                             | Id                            | Players                                                                                                         |
| -------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Starter](https://pixijs.io/create-pixi/docs/guide/games/starter.md) | `starter-discord`             | Each player plays on their own                                                                                  |
| [Starter, multiplayer](#multiplayer)                                 | `starter-discord-multiplayer` | Everyone in the same Activity session plays in one room, and each player's Discord name shows above their bunny |

**npm**

```bash
npm create pixi.js@latest my-game -- --template starter-discord
```

**yarn**

```bash
yarn create pixi.js my-game --template starter-discord
```

**pnpm**

```bash
pnpm create pixi.js my-game --template starter-discord
```

**bun**

```bash
bun create pixi.js my-game --template starter-discord
```

Add `-js` to the id for JavaScript. As with every multiplayer template, the first install of `starter-discord-multiplayer` needs [Git](https://git-scm.com/downloads). See [npm install fails with spawn git](https://pixijs.io/create-pixi/docs/guide/troubleshooting.md#npm-install-fails-with-spawn-git).

Both templates come with a small Node.js server as well as the game. Signing in needs your app's client secret, which can't be in the browser, so the server trades the player's sign-in code for an access token. In the single-player template, that's all the server does. In the multiplayer template, the Colyseus game server does it too. Either way, `npm run dev` runs the game and the server in one process on one port.

You don't need a Discord app to start. `npm run dev` runs the game in a browser tab with a made-up player. To run it inside Discord, you need a Discord app, a tunnel to your computer, and a few settings in the Discord Developer Portal.

## Project structure

This is `starter-discord`:

```text
my-game/
├── public/
├── server/
│   ├── discord.ts
│   └── main.ts
├── src/
│   ├── assets.ts
│   ├── cube.ts
│   ├── main.ts
│   ├── platform.ts
│   ├── scene.ts
│   └── vite-env.d.ts
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Compared with [`starter-web`](https://pixijs.io/create-pixi/docs/guide/platforms/web.md):

- `src/platform.ts` starts the Discord SDK and signs the player in.
- `server/main.ts` is the server: the sign-in route, plus the game's files in production.
- `server/discord.ts` trades a sign-in code for an access token.
- `vite.config.ts` adds the sign-in route to the dev server, and builds the server as well as the game.
- `.env.example` lists the two values the game needs from your Discord app. `.gitignore` also ignores `.env`.
- `src/vite-env.d.ts` adds the type of `VITE_DISCORD_CLIENT_ID`. JavaScript projects don't have this file.
- `package.json` adds [`@discord/embedded-app-sdk`](https://docs.discord.com/developers/developer-tools/embedded-app-sdk) and Express, and `preview` runs the built server.

`starter-discord-multiplayer` is the [multiplayer template](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#project-structure) with the same `src/platform.ts`, `server/discord.ts`, `.env.example` and `src/vite-env.d.ts`. It has no `server/main.ts`, because the game server answers the sign-in route, and its `vite.config.ts` is the multiplayer one. Its `server/platform.ts` and `src/connect.ts` are Discord's own. See [multiplayer](#multiplayer). The game's files, such as `src/scene.ts` and `server/GameRoom.ts`, are the same as on the web.

## Scripts

Both templates have the [multiplayer scripts](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#scripts). In the single-player template, the sign-in server takes the place of the game server: `dev` runs it inside the dev server, `build` writes it to `dist/server/`, and `preview` runs the built server.

## Run it in a browser

```bash
npm run dev
```

A browser tab has no Discord client to talk to, so in development `src/platform.ts` uses `DiscordSDKMock`, the stand-in that comes with the Discord SDK. Sign-in still goes through your server, which gives the mock's code a made-up token. In the single-player template, the player is the mock's made-up account, `mock_user_username`. In the multiplayer template, the game server names each tab after its token, such as "Player 5c12", and every tab joins the same room, so open a second tab to see two bunnies with different names. Reloading a tab signs it in as a new player.

This needs no `.env` file. The mock only exists in development; see [the sign-in route](#the-sign-in-route).

## Set up a Discord app

1. In Discord, open User Settings, then Advanced, and turn on Developer Mode. It lets you launch Activities that are still in development.
2. In the [Discord Developer Portal](https://discord.com/developers/applications), create an application. Only you and members of the app's team can launch it while it's in development. If other people need to test it, create a [team](https://discord.com/developers/teams) first and choose it as the owner.
3. On the **Installation** page, check that both User Install and Guild Install are selected.
4. On the **OAuth2** page, copy the Client ID and the Client Secret into `.env`, as described in the next section. The secret only shows after you press Reset Secret. Under Redirects, add `https://127.0.0.1`. Discord requires a redirect, but the SDK handles sign-in inside the Activity, so it's never used.
5. Under **Activities**, open **Settings** and turn on Enable Activities. This also creates the Launch command that opens the Activity. Under Supported Platforms, tick each platform you'll test on, or the Activity won't show up there.
6. Under **Activities**, open **URL Mappings**. The `/` prefix needs a target, which is your tunnel's host while you develop and your server's host in production. The next sections cover both.

Discord's [Building an Activity](https://docs.discord.com/developers/activities/building-an-activity) guide walks through the same pages with screenshots.

## Environment variables

```bash title=".env.example"
# Copy this file to .env, then fill in the values from the OAuth2 page of
# your app at https://discord.com/developers/applications

# Built into the game, so anyone can read it
VITE_DISCORD_CLIENT_ID=

# Only the game server reads this. Keep it private.
DISCORD_CLIENT_SECRET=
```

Copy `.env.example` to `.env` and fill in both values. `.gitignore` lists `.env`, so git won't pick up the secret.

- `VITE_DISCORD_CLIENT_ID` is your app's Client ID. The game needs it in the browser to start the SDK and ask Discord for a sign-in code. Vite only builds variables that start with `VITE_` into the game, and anyone can read them there. The server reads the same value, which the build writes into the server code in `dist/server/`.
- `DISCORD_CLIENT_SECRET` lets the server trade a sign-in code for an access token. Only `server/discord.ts` reads it, when the server runs, and it never reaches `dist/client/`. Don't add a `VITE_` prefix to it, or Vite builds it into the game.

The server reads `.env` from the folder it runs in: the project folder for npm scripts, or wherever you start `node dist/server/server.mjs`.

- In the single-player template, the built server loads `.env` with Node.js's `process.loadEnvFile()` when it starts. Variables that are already set, for example in a host's settings, keep their value. In `npm run dev`, `vite.config.ts` reads `.env` instead, and reads it again when you edit it.
- In the multiplayer template, Colyseus loads `.env` when the server starts, in both `npm run dev` and `npm run preview`. Variables that are already set keep their value. The file is read once, so after editing `.env`, stop `npm run dev` and start it again.

## Test inside Discord

Discord loads an Activity through its own proxy at `https://<client id>.discordsays.com`. The proxy forwards requests to the host in your `/` URL mapping, which has to be a public HTTPS address. A tunnel gives your dev server one.

1. Fill in `.env`, then start the dev server:

   ```bash
   npm run dev
   ```

2. In a second terminal, start a [cloudflared](https://github.com/cloudflare/cloudflared) quick tunnel to the dev server:

   ```bash
   npx cloudflared tunnel --url http://localhost:8080
   ```

   `npx cloudflared` runs the `cloudflared` npm package, a community wrapper that downloads Cloudflare's program the first time. If you've [installed cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) yourself, leave out `npx`. The tunnel prints its address, for example `https://funky-jogging-bunny.trycloudflare.com`. The tunnel handles HTTPS, so the dev server stays on plain HTTP.

3. In the Developer Portal, open **Activities**, then **URL Mappings**. Set the target of the `/` prefix to the tunnel's host without `https://`, for example `funky-jogging-bunny.trycloudflare.com`, and save.

4. In Discord, go to a channel in a server you're in, open the App Launcher, and launch your app. Search for its name if it isn't listed. The first time, Discord asks you to let the app see your account. The game then signs you in.

In the multiplayer template, your bunny shows your name, and when another member of the app's team joins your Activity, you share a room and see each other's bunnies.

Each quick tunnel gets a new address, so update the URL mapping every time you start cloudflared. When you're done, stop the tunnel and remove the mapping. You don't own the `trycloudflare.com` address, and someone else could get it later. While the tunnel runs, anyone with its address can open your dev server in a browser and play as a made-up player.

Saving a file should reload the Activity, as it does a browser tab. Vite's reload connection goes to the page's own address, which the `/` mapping forwards to your dev server.

PixiJS 3D loads its Draco decoder from `www.gstatic.com` the first time a Draco-compressed model loads, and Discord blocks requests to hosts without a URL mapping. Copy the two decoder files into `public/` and pass their paths to `setDracoDecoderPath` before the first Draco model loads, as the [PixiJS 3D compression guide](https://github.com/pixijs/3d/blob/main/src/assets/__docs__/compression.md) shows.

### Allowed hosts

Vite answers every request for an unknown host, including the sign-in route, with `Blocked request. This host ("...") is not allowed`. `vite.config.ts` sets `allowedHosts: [".trycloudflare.com"]`, which lets in every cloudflared quick tunnel. The leading dot in `.trycloudflare.com` allows every subdomain. If you use another tunnel, such as ngrok, add its host to the list. The production server doesn't check the host, so this only matters for `npm run dev`.

If you change the dev server's port in `vite.config.ts`, use the new port in the cloudflared command.

## How sign-in works

### The Discord SDK

`src/platform.ts` creates the SDK and signs the player in:

```ts title="src/platform.ts"
import { DiscordSDK, DiscordSDKMock } from "@discord/embedded-app-sdk";
import type { CommandResponse, IDiscordSDK } from "@discord/embedded-app-sdk";
import type { Application } from "pixi.js";

/**
 * Talks to the Discord app the game runs in. In a plain browser tab,
 * `npm run dev` uses a mock instead, so the game runs without Discord. A
 * production build opened outside Discord has neither.
 */
export const discordSdk = createDiscordSdk();

/**
 * The signed-in player's Discord account, once initPlatform has run. It's
 * undefined when nobody is signed in: in a production build opened outside
 * Discord, or when sign-in failed.
 */
export let user: CommandResponse<"authenticate">["user"] | undefined;

/** The player's access token, which your server can check with Discord */
export let accessToken: string | undefined;

function createDiscordSdk(): IDiscordSDK | undefined {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

  // Discord adds frame_id to the page URL when it opens the game
  if (new URLSearchParams(location.search).has("frame_id")) {
    if (!clientId) throw new Error("Set VITE_DISCORD_CLIENT_ID in .env");

    return new DiscordSDK(clientId);
  }

  if (import.meta.env.DEV) {
    return new DiscordSDKMock(clientId, null, null, null);
  }

  return undefined;
}

/** Runs first, before PixiJS starts. Connects to Discord and signs in. */
export async function initPlatform() {
  if (!discordSdk) return;

  await discordSdk.ready();

  try {
    await signIn(discordSdk);
  } catch (error) {
    // The game still starts, so a player who declines can play signed out
    console.error("Discord sign-in failed:", error);
  }
}

/** Asks the player to share their Discord account with the game */
async function signIn(sdk: IDiscordSDK) {
  const { code } = await sdk.commands.authorize({
    client_id: sdk.clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });

  // The server trades the code for a token, since only it has the secret
  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) throw new Error(`/api/token answered ${response.status}`);

  const { access_token } = (await response.json()) as { access_token: string };

  user = (await sdk.commands.authenticate({ access_token })).user;
  accessToken = access_token;
}

/** Discord has no loading screen to update */
export function setLoadingProgress(_progress: number) {}

/** Discord doesn't need to know when the game is ready */
export function gameReady(_app: Application) {}
```

Discord opens an Activity with `frame_id`, `instance_id` and `platform` in the page's URL. `DiscordSDK` reads them and throws if they're missing, so the game only creates it when `frame_id` is there. A production build opened outside Discord has no SDK, so it starts without signing anyone in.

`initPlatform` runs before PixiJS starts. It waits for `ready()`, which resolves once the SDK has connected to Discord, then signs the player in:

1. `authorize` asks Discord for a one-time code. The `identify` scope lets the game read the player's basic profile, such as their id, username, display name and avatar, but not their email. With `prompt: "none"`, Discord only asks the player the first time.
2. The game posts the code to `/api/token` on its own server, which trades it for an access token. The trade needs the client secret, so it can't happen in the browser.
3. `authenticate` gives the token to the SDK, which answers with the player's account. SDK commands that need the player's permission only work after it.

If sign-in fails, for example because the player declined, `initPlatform` logs the error and the game starts anyway, signed out. Discord has no loading screen to update and no ready call, so `setLoadingProgress` and `gameReady` stay empty.

### Use the player's account

After `initPlatform`, `src/platform.ts` exports the signed-in player as `user` and their access token as `accessToken`. Both are `undefined` when nobody is signed in. The starter game doesn't use them. To greet the player, for example:

```ts title="src/scene.ts"
import { user } from "./platform.ts";

const greeting = new Text({
  text: `Hi, ${user?.global_name ?? user?.username ?? "player"}`,
  style: { fill: 0xffffff },
});
```

`global_name` is the player's display name, when they've set one. `user` also has their `id` and `avatar`. Code that imports `user` only works on Discord, because the [web's `src/platform.ts`](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#platform-startup-code) doesn't export it.

Use `accessToken` to show your server who the player is. Don't trust a user id sent from the game, because a modified client can send any id. The server can ask Discord who the token belongs to, as the [multiplayer server](#checking-players) does.

### The sign-in route

In the single-player template, `server/main.ts` is a small [Express](https://expressjs.com) server with one route, `POST /api/token`:

```ts title="server/main.ts"
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import express from "express";

import { getAccessToken } from "./discord.ts";

/**
 * The game's server. `npm run dev` adds its routes under /api/ to the dev
 * server. The build writes this file to dist/server/server.mjs, which also
 * serves the game from dist/client.
 */
export const app = express();

/** Trades the sign-in code from src/platform.ts for an access token */
app.post("/api/token", express.json(), async (req, res) => {
  const access_token = await getAccessToken(req.body?.code);

  if (!access_token) {
    res.sendStatus(401);
    return;
  }

  res.json({ access_token });
});

// `npm run dev` serves the game itself
if (!import.meta.env.DEV) {
  // Loads DISCORD_CLIENT_SECRET. Variables that are already set, for example
  // in a host's settings, keep their value.
  if (existsSync(".env")) process.loadEnvFile();

  const port = Number(process.env.PORT) || 8080;

  // Keeps stack traces out of error pages
  app.set("env", "production");

  app.use(express.static(fileURLToPath(new URL("../client", import.meta.url))));
  app.listen(port, (error) => {
    if (error) throw error;

    console.log(`Game server running at http://localhost:${port}`);
  });
}
```

In development, `vite.config.ts` hands every request under `/api/` to this server, so the dev server answers the route itself. Saving a file in `server/` takes effect on the next request. `vite build` builds the game into `dist/client/` and this file into `dist/server/server.mjs`, which also serves the game:

```ts title="vite.config.ts"
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

import { defineConfig } from "vite";
import type { Plugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [serverRoutes()],
  server: {
    // dist/server/server.mjs also uses 8080, unless PORT is set
    port: 8080,
    open: true,
    // Lets Discord reach the dev server through a cloudflared tunnel
    allowedHosts: [".trycloudflare.com"],
  },
  // `vite build` builds the game into dist/client and the server below
  builder: {},
  build: {
    outDir: "dist/client",
    // PixiJS, PixiJS 3D and the game libraries together are larger than
    // Vite's 500 kB default
    chunkSizeWarningLimit: 1000,
  },
  environments: {
    ssr: {
      build: {
        outDir: "dist/server",
        // The server serves public/ from dist/client, so skip a second copy
        copyPublicDir: false,
        rolldownOptions: {
          input: "server/main.ts",
          output: { entryFileNames: "server.mjs" },
        },
      },
    },
  },
});

/**
 * Lets the routes in server/main.ts answer requests under /api/, so
 * `npm run dev` runs the game and its server in one process. Saving a file in
 * server/ takes effect on the next request.
 */
function serverRoutes(): Plugin {
  return {
    name: "server-routes",
    configureServer(server) {
      // Gives the server DISCORD_CLIENT_SECRET from .env. Vite restarts when
      // .env changes, so edits apply. VITE_ variables stay out of process.env,
      // where they would hide those edits from Vite.
      if (existsSync(".env")) {
        const env = parseEnv(readFileSync(".env", "utf8"));

        for (const [key, value] of Object.entries(env)) {
          if (!key.startsWith("VITE_")) process.env[key] = value;
        }
      }

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        server
          .ssrLoadModule("/server/main.ts")
          .then(({ app }) => app(req, res), next);
      });
    },
  };
}
```

Add your own routes to `app` under `/api/`, such as a route that saves a score. They work in development and in production.

`server/discord.ts` does the trade. The multiplayer template's [sign-in route](#checking-players) uses the same function:

```ts title="server/discord.ts"
export const DISCORD_API = "https://discord.com/api/v10";

/**
 * Trades the code from Discord's `authorize` command for an access token, or
 * returns undefined if Discord refuses the code or can't be reached. It runs
 * on the server because it needs the client secret.
 */
export async function getAccessToken(code: unknown) {
  if (typeof code !== "string" || code.length > 200) return undefined;

  // Outside Discord, `npm run dev` signs each tab in as a made-up player
  if (import.meta.env.DEV && code === "mock_code") {
    return `mock_${crypto.randomUUID()}`;
  }

  try {
    const response = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
        grant_type: "authorization_code",
        code,
      }),
    });

    if (response.ok) {
      const { access_token } = (await response.json()) as {
        access_token: string;
      };

      return access_token;
    }

    console.error("Discord sign-in failed:", await response.text());
  } catch (error) {
    console.error("Discord sign-in failed:", error);
  }

  return undefined;
}
```

- `getAccessToken` sends the code and the client secret to Discord and returns the access token. When Discord refuses the code or can't be reached, it logs why in the server's terminal, and the route answers with 401.
- The mock code path checks `import.meta.env.DEV`. `vite build` replaces it with `false` and drops that path from the built server, so the production server never signs anyone in without Discord. Use it for your own development-only code too. `process.env.NODE_ENV` doesn't work for this, because `npm run preview` leaves it unset.

## Multiplayer

`starter-discord-multiplayer` adds a [Colyseus](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) game server. Everyone in the same Activity session plays in one room, and each player's Discord name shows above their bunny. [Multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) covers the game server, the scene and the scripts. The Discord platform adds two files to it.

### Joining the room

The multiplayer scene joins its room through `joinGame()` in `src/connect.ts`:

```ts title="src/connect.ts"
import { Client } from "@colyseus/sdk";

import type { server } from "../server/index.ts";
import { accessToken, discordSdk } from "./platform.ts";

/**
 * Joins the room for this Activity session with the player initPlatform
 * signed in, so everyone in the session plays together. The scene shows the
 * message of any error this throws.
 */
export async function joinGame() {
  if (!discordSdk) throw new Error("Open this game from Discord");
  if (!accessToken) throw new Error("Discord sign-in failed");

  // Discord's proxy sends every path to this server. Without a urlBuilder, the
  // SDK would rewrite URLs to /.proxy/colyseus/... inside Discord.
  const client = new Client<typeof server>(undefined, {
    urlBuilder: (url) => url.href,
  });

  // The room asks Discord who the token belongs to
  client.auth.token = accessToken;

  return await client.joinOrCreate("game", {
    instanceId: discordSdk.instanceId,
  });
}
```

`initPlatform` has already signed the player in by the time the scene starts. `joinGame()` sets `client.auth.token` to the player's `accessToken`, which sends it with the join request, and `joinOrCreate` passes the session's `instanceId`. If sign-in failed, `joinGame()` throws "Discord sign-in failed" instead.

Inside Discord, the Colyseus SDK rewrites every request to `/.proxy/colyseus/...` by default, which would need a second URL mapping. The game and the server share one address in this template, so `urlBuilder: (url) => url.href` keeps each URL as it is. The `/` mapping then covers the page, the sign-in route and the room.

The scene shows the message of any error `joinGame()` throws, such as "Discord sign-in failed".

### Checking players

`server/platform.ts` tells the game's room who can join and which room they join. The [web version](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#multiplayer) lets everyone into one room. Discord's checks every player:

```ts title="server/platform.ts"
import { createEndpoint, createRouter, ErrorCode, ServerError } from "colyseus";

import { DISCORD_API, getAccessToken } from "./discord.ts";

export interface JoinOptions {
  /** src/connect.ts joins with the Activity session the player is in */
  instanceId: string;
}

/**
 * Runs before a player joins, and only lets in players signed in with
 * Discord. What it returns becomes `client.auth`.
 */
export async function onAuth(
  token: string | undefined,
  options: { instanceId?: unknown },
) {
  const { instanceId } = options;

  // Without an instanceId, filterBy would let the player into any room
  if (typeof instanceId !== "string" || instanceId.length > 100) {
    throw new ServerError(ErrorCode.AUTH_FAILED, "Open this game from Discord");
  }

  const name = token && (await getDiscordName(token));

  if (!name) {
    throw new ServerError(ErrorCode.AUTH_FAILED, "Sign in with Discord");
  }

  return { name };
}

/** Each Activity session gets its own room */
export const filterBy = ["instanceId"];

/** The sign-in route src/platform.ts calls */
export const routes = createRouter({
  discordToken: createEndpoint(
    "/api/token",
    { method: "POST" },
    async (ctx) => {
      const access_token = await getAccessToken(ctx.body?.code);

      if (!access_token) {
        throw ctx.error("UNAUTHORIZED", { message: "Discord sign-in failed" });
      }

      return { access_token };
    },
  ),
});

/** Asks Discord for the name of the player an access token belongs to */
async function getDiscordName(token: string) {
  if (import.meta.env.DEV && token.startsWith("mock_")) {
    return `Player ${token.slice(5, 9)}`;
  }

  const response = await fetch(`${DISCORD_API}/oauth2/@me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return undefined;

  const { application, user } = (await response.json()) as {
    application: { id: string };
    user?: { username: string; global_name: string | null };
  };

  // Only accept tokens from this app's sign-in, not from other Discord apps
  if (application.id !== import.meta.env.VITE_DISCORD_CLIENT_ID) {
    return undefined;
  }

  // global_name is the display name, when the player has set one
  return user && (user.global_name ?? user.username);
}
```

- `onAuth` runs before a player joins, and what it returns becomes `client.auth`. It asks Discord who the token belongs to and checks that your app issued it, so a modified client can't join without signing in or pick its own name. It returns the player's Discord display name, or their username if they haven't set one.
- The game's room sets each new player's `name` from `client.auth`. `name` is a field of `Player` in `server/GameState.ts`, and the scene draws it above each bunny.
- `JoinOptions` declares the options `src/connect.ts` joins with, so TypeScript checks them.
- `routes` adds the [sign-in route](#the-sign-in-route) to the game server, as a Colyseus [API route](https://docs.colyseus.io/server/http-routes). It uses the same `getAccessToken` as the single-player server.

[How platforms change the server](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#how-platforms-change-the-server) shows how the game's room uses these exports.

### One room per Activity session

Discord gives each Activity session an `instanceId`, and everyone who launches or joins that session gets the same one. When everyone leaves, the session ends, and the next launch gets a new id. `filterBy = ["instanceId"]` makes `joinOrCreate` join the room whose `instanceId` matches the player's, or create one.

- `onAuth` refuses a join without an `instanceId`. Without the option, `filterBy` doesn't filter, and the player would land in any open room.
- If you set `maxClients` on the room, a full session splits in two, because `joinOrCreate` then opens a second room with the same `instanceId`.
- The mock gives every browser tab the same `instanceId`, which is why tabs share a room in development.

### What the server doesn't check

The server knows each player's Discord account, but not that they're in the session they joined. A signed-in Discord user who knows a session's `instanceId` could join its room from outside the Activity. To check, your server can ask Discord's [Activity Instance API](https://docs.discord.com/developers/activities/development-guides/multiplayer-experience#using-the-activity-instance-api) who is in a session, which needs a bot token.

The Colyseus SDK also adds the access token to the room's WebSocket URL, so it can appear in access logs of proxies between Discord and your server. The token only gives access to the player's basic profile, but whoever has it can also join your game as that player until it expires, after seven days.

## Deploy

Both templates need a host that runs Node.js. One Node.js process serves the game and the sign-in route, and in the multiplayer template the rooms too, so it needs one URL mapping.

1. Build with the Client ID set, in `.env` or in the environment of the build. Vite writes it into both the game and the server, so a build without it can't sign anyone in.
2. On the server, copy `dist/`, `package.json` and your lockfile, install the dependencies without the dev tools, for example with `npm ci --omit=dev`, and run `node dist/server/server.mjs`, or `npm run preview`. The [multiplayer deploy steps](https://pixijs.io/create-pixi/docs/guide/multiplayer.md#deploy) have more about the game server.
3. On the host, set `DISCORD_CLIENT_SECRET` in its environment settings, or put a `.env` file in the folder the server starts from.
4. Serve the game over HTTPS. Discord's proxy only connects to HTTPS addresses. Most Node.js hosts handle HTTPS for you. On your own server, put a reverse proxy such as [Caddy](https://caddyserver.com) or nginx in front of the game server.
5. In the Developer Portal, set the target of the `/` URL mapping to your host, without `https://`.

The single-player server listens on the port in the `PORT` environment variable, or 8080 without it, so it works on hosts that choose the port. The multiplayer server listens on `port` from `vite.config.ts` and doesn't read `PORT`.

To try the production build inside Discord before you deploy, run `npm run build` and `npm run preview`, then start the tunnel and update the URL mapping as in [test inside Discord](#test-inside-discord).

The game is also reachable outside Discord, at your host's address and at `https://<client id>.discordsays.com`. There, the single-player game starts without signing anyone in, and the multiplayer game shows "Open this game from Discord".

Discord's proxy keeps the cache headers your server sends, except on HTML pages. Vite adds a hash to the name of each file it builds, so players get the new code after a deploy. Files in `public/` keep their names, so if you give them long cache times, rename a file when you change it.

Discord's [production readiness guide](https://docs.discord.com/developers/activities/development-guides/production-readiness) covers caching, rate limits and older Discord clients. Its [Discovery](https://docs.discord.com/developers/discovery/overview) guide covers listing your app so other people can find it.

## Troubleshooting

### The game shows "Open this game from Discord"

You opened a multiplayer production build in a browser, either with `npm run preview` or at the deployed address. Use `npm run dev` to play in a browser, or launch the game from Discord.

### Sign-in fails

The multiplayer game shows "Discord sign-in failed". The single-player game starts signed out and logs "Discord sign-in failed" in [the game's console](#see-the-games-console-inside-discord).

Usually Discord refused to trade the sign-in code. The server's terminal shows Discord's answer. `invalid_client` means the Client ID or the Client Secret is wrong or missing. Fix `.env` and restart `npm run dev`. In production, check the host's `DISCORD_CLIENT_SECRET`, and build again if the Client ID changed.

### The Activity stays blank or shows an error page

- Check that the target of the `/` URL mapping is the tunnel that's running now, without `https://`.
- Check that the tunnel points at the port `npm run dev` uses.
- Check that `.env` has `VITE_DISCORD_CLIENT_ID`, and that you restarted `npm run dev` after filling it in. Without it, the game stops with "Set VITE_DISCORD_CLIENT_ID in .env" in [the game's console](#see-the-games-console-inside-discord).
- If you've set an Application URL Override in Discord, turn it off. It makes Discord skip the proxy and the URL mapping.
- `Blocked request. This host ("...") is not allowed` means the tunnel's host isn't in `server.allowedHosts`. See [allowed hosts](#allowed-hosts).

### The app isn't in the App Launcher

Check that Developer Mode is on in Discord, that Enable Activities is on, and that the platform you're on is ticked under Supported Platforms. Only the app's owner and its team members can launch an app in development.

### The Activity doesn't update when you save

Close the Activity and launch it again. After editing `.env`, also restart `npm run dev`.

### See the game's console inside Discord

The Discord SDK forwards the game's console messages to Discord. Open Discord in a browser at [discord.com/app](https://discord.com/app) and use the browser's developer tools, or use the [Discord PTB](https://discord.com/download) desktop app's View > Developer > Toggle Developer Tools. On mobile, turn on Developer Mode and open Debug Logs in User Settings. See [logging](https://docs.discord.com/developers/activities/development-guides/local-development#logging) in Discord's docs.

## Learn more

- Discord's [Activities documentation](https://docs.discord.com/developers/activities/overview), including [local development](https://docs.discord.com/developers/activities/development-guides/local-development), [networking](https://docs.discord.com/developers/activities/development-guides/networking) and the [multiplayer guide](https://docs.discord.com/developers/activities/development-guides/multiplayer-experience).
- The [Embedded App SDK reference](https://docs.discord.com/developers/developer-tools/embedded-app-sdk) for the commands and events the game can use.
- [Multiplayer](https://pixijs.io/create-pixi/docs/guide/multiplayer.md) for how the room and the scene keep players in sync.
