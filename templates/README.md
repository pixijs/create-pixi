# Templates

Templates are not stored as finished projects. Each one is assembled from shared **layers** when the package is built, so a file that several templates use lives in exactly one place.

```
templates/
├── manifest.ts     every template: id, name, category, layers, languages
├── package.json    version catalog for every template dependency
├── generate.ts     assembles a template from its layers
└── layers/
    ├── stack/                 tooling and kits that templates share
    │   ├── base/              gitignore, favicon, styles, oxlint + oxfmt config
    │   ├── typescript/        tsconfig.json and the typescript dependency
    │   ├── assets/            sample bunny for the bundler and React templates
    │   ├── vanilla/           src/main.ts for the bundler templates
    │   ├── vite/              index.html, vite.config.ts, scripts
    │   ├── webpack/           index.html, webpack.config.mjs, scripts
    │   ├── esbuild/           dev and build scripts
    │   ├── import-map/        CDN import map, no build step
    │   ├── react/             @pixi/react app on top of the vite layer
    │   ├── game/              game kit: src/main.ts and the game libraries
    │   ├── colyseus/          multiplayer: Colyseus Vite plugin and server build
    │   └── extension/         standalone PixiJS extension project
    ├── games/
    │   └── starter/
    │       ├── core/          the game: scene, 3D cube, asset list, assets
    │       └── multiplayer/   its rooms, state and multiplayer scene
    └── platforms/
        ├── web/
        │   ├── core/          src/platform.ts, which does nothing on the web
        │   └── multiplayer/   joins the game server, no sign-in
        └── discord/
            ├── core/          Discord SDK and sign-in, .env, code-for-token exchange
            ├── single-player/ server/main.ts, a small server for the sign-in route
            └── multiplayer/   sign-in for Colyseus and a room per Activity session
```

A layer is any directory that `manifest.ts` lists, such as `stack/vite` or `games/starter/core`. `games/starter` itself isn't a layer; it only groups the starter's two layers.

`npm run build` writes every template to `dist/templates/<id>`, which is what gets published and what the CLI copies.

## How layers combine

Layers are applied in the order `manifest.ts` lists them:

- A file replaces the same path from an earlier layer.
- `*.json` files deep-merge. Objects merge key by key; arrays and other values are replaced. This is how the `react` layer adds `"jsx": "react-jsx"` to the shared `tsconfig.json`.
- `_gitignore` files are concatenated.

Then the generator:

1. Replaces every `"catalog:"` version in `package.json` with the version from `templates/package.json`.
2. Orders `package.json` scripts as `start`, `dev`, `build`, `preview`, then the rest.
3. For JavaScript variants, strips types from `.ts`/`.tsx` files with sucrase, renames them to `.js`/`.jsx`, updates references to the renamed files, and removes `tsconfig*.json`, `*.d.ts`, the `typescript` dependency, `tsc` steps from scripts, and TypeScript rules from `.oxlintrc.json`.
4. Formats every text file with the template's own `.oxfmtrc.json`, so a fresh project passes `oxfmt --check`.

Write layer sources in TypeScript using only erasable syntax (no `enum` or `namespace`) if the template has a JavaScript variant.

At scaffold time the CLI copies the generated template, renames `_gitignore` to `.gitignore`, and fills `{{packageName}}`, `{{author}}` and `{{year}}` in `package.json` and `LICENSE`. The author comes from `git config user.name`.

`stack/import-map/src/main.js` is a hand-written copy of `stack/vanilla/src/main.ts` (the import map serves assets from `./public/`). A test fails if the two drift apart.

## Common tasks

**Try a template while editing it**

```bash
npm run play -- bundler-vite
```

This generates the template into `playground/bundler-vite`, installs its dependencies, starts its dev server, and regenerates on every change under `templates/layers`.

**Check a template like CI does**

```bash
npm run build
npm run verify -- bundler-vite framework-react-js
```

`verify` scaffolds each template with the built CLI, installs dependencies, then runs `lint`, `oxfmt --check` and `build`. With no arguments it checks every template.

**Update dependencies**

Every version lives in `templates/package.json`. `npm run update:templates` raises each one to the newest release its range allows and updates the lockfile. It never changes a range, so it skips new major versions, and keeps 0.x packages such as Colyseus on the same minor, since their minors can break.

The CDN URLs in `stack/import-map/index.html`, `stack/extension/examples/index.html` and `docs/docs/guide/bundlers.mdx` pin `@pixi/3d` by hand, and a test fails until they match the catalog, so update them when `@pixi/3d` changes.

Two ranges use `~` to stay on one minor: `typescript`, because TypeScript minors can break, and `@esotericsoftware/spine-pixi-v8`, because the runtime's minor has to match the Spine editor that exported the files.

To see the versions it skips, list every newer release:

```bash
npx npm-check-updates --packageFile templates/package.json
```

Raise the ones you want by hand, then run `npm install`, `npm run build` and `npm run verify`.

**Add a bundler, framework or extension template**

1. Add any new files as a layer in `templates/layers/stack/<name>`, with a partial `package.json` that lists dependencies as `"catalog:"`.
2. Add new dependency versions to `templates/package.json`.
3. Add an entry to `templates` in `manifest.ts`. Set `languages: ["ts", "js"]` to also publish a `<id>-js` variant.
4. Run `npm run build`, `npm test` and `npm run verify -- <id>`.

## Games and platforms

Game templates aren't listed one by one. `manifest.ts` lists `games` and `platforms`, and `defineGameTemplates` puts every game on every platform, as `<game>-<platform>`, plus `<game>-<platform>-multiplayer` when both the game and the platform have a multiplayer layer. Multiplayer always means Colyseus. Their layers apply in this order:

```
stack/base, stack/typescript, stack/vite, stack/game
games/<game>/core
platforms/<platform>/core
platforms/<platform>/single-player  single-player only, if the platform has one
stack/colyseus                      multiplayer only
games/<game>/multiplayer            multiplayer only
platforms/<platform>/multiplayer    multiplayer only
```

A platform's `core` layer holds what both versions share. Its `single-player` layer holds what only the single-player version needs, such as Discord's sign-in server, which the multiplayer version replaces with the Colyseus game server.

Games and platforms meet only through these files, so any game works on any platform. A platform never replaces or imports a game's files, and a test fails if one does.

| File                 | Provided by           | Exports                                                            | Used by                                                             |
| -------------------- | --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `src/scene.ts`       | game                  | `createScene(app)`                                                 | `stack/game` `src/main.ts`                                          |
| `src/assets.ts`      | game                  | `assets`, the list `main.ts` loads                                 | `stack/game` `src/main.ts`                                          |
| `src/platform.ts`    | platform              | `initPlatform()`, `setLoadingProgress(progress)`, `gameReady(app)` | `stack/game` `src/main.ts`                                          |
| `server/index.ts`    | game, multiplayer     | `server`, with a room named `game`                                 | Colyseus Vite plugin, and the platform's `src/connect.ts` as a type |
| `src/connect.ts`     | platform, multiplayer | `joinGame()`, which joins the `game` room                          | the game's multiplayer scene                                        |
| `server/platform.ts` | platform, multiplayer | `onAuth`, `JoinOptions`, `filterBy`, `routes`                      | the game's rooms and `server/index.ts`                              |

`main.ts` calls `initPlatform()` before PixiJS starts, `setLoadingProgress()` while assets load and `gameReady(app)` once the scene is on screen. A platform that pauses the game can stop `app.ticker` in `gameReady`. A platform may export more, as Discord's exports its SDK and the signed-in player.

On the server, a game's room sets `static onAuth = onAuth` and types its `onJoin` options as `JoinOptions`, and `server/index.ts` registers the room with `.filterBy(filterBy)` and passes `routes` to `defineServer`. `onAuth` returns `true` to let a player in without signing in, or `{ name }` for a signed-in player, which Colyseus stores as `client.auth`. The web's `server/platform.ts` lets everyone in, splits nobody up and adds no routes. Discord's signs players in, gives each Activity session its own room with `filterBy(["instanceId"])` and adds the `/api/token` sign-in route.

**Add a game**

1. Add `templates/layers/games/<id>/core` with `src/scene.ts`, `src/assets.ts` and the files in `public/assets` they load.
2. For multiplayer, add `templates/layers/games/<id>/multiplayer` with `server/index.ts`, the rooms and their state, and a `src/scene.ts` that joins through `joinGame()`. Its rooms use `server/platform.ts` as described above.
3. Add the game to `games` in `manifest.ts`, with `multiplayer: true` if it has a multiplayer layer.
4. Add the new ids to the table in the root `README.md`, and the layers to the `rootDirs` of `templates/layers/tsconfig.json` for your editor.

**Add a platform**

1. Add `templates/layers/platforms/<id>/core` with `src/platform.ts` and the platform's SDK: in `package.json` when it's on npm, or as a `<script>` tag in its own `index.html` when the platform serves it (YouTube Playables, Facebook Instant Games).
2. For multiplayer, add `templates/layers/platforms/<id>/multiplayer` with `src/connect.ts` and `server/platform.ts`.
3. If the single-player version needs files the multiplayer one doesn't, such as its own server, add them in `templates/layers/platforms/<id>/single-player`.
4. Add the platform to `platforms` in `manifest.ts`, with `multiplayer: true` if it has a multiplayer layer and `singlePlayer: true` if it has a single-player layer.
5. Add the new ids to the table in the root `README.md`, and the layers to the `rootDirs` of `templates/layers/tsconfig.json` for your editor.
6. Run `npm run build`, `npm test` and `npm run verify -- <ids>`.

`npm run typecheck` type-checks the layers of each TypeScript template together (`scripts/typecheck-templates.ts`). Their `rootDirs` lets imports between layers resolve, such as `main.ts` importing `./platform.ts`, and lists the layers last to first, so an import finds the file the template ships. `templates/layers/tsconfig.json` does the same for your editor with every layer at once. When several layers have the same file, the editor shows the first one in its `rootDirs`.

The CLI prompts, `--help` output, docs template list and CI matrix all read from `manifest.ts`. The template table in the root `README.md` is written by hand, so add new templates there too; a test fails until you do.
