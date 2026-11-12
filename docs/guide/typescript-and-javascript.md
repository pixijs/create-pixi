# TypeScript and JavaScript

Most templates come in TypeScript and JavaScript. Choose at the language prompt, or pick the id directly: JavaScript ids end in `-js`, such as `bundler-vite-js`.

- TypeScript and JavaScript: [Game: Starter, Web](https://pixijs.io/create-pixi/docs/guide/platforms/web.md); [Game: Starter, Web, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/web.md#multiplayer); [Game: Starter, Discord Activity](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md); [Game: Starter, Discord Activity, multiplayer](https://pixijs.io/create-pixi/docs/guide/platforms/discord.md#multiplayer); [Bundler: Vite](https://pixijs.io/create-pixi/docs/guide/bundlers.md#vite); [Bundler: webpack](https://pixijs.io/create-pixi/docs/guide/bundlers.md#webpack); [Bundler: esbuild](https://pixijs.io/create-pixi/docs/guide/bundlers.md#esbuild); [Framework: React](https://pixijs.io/create-pixi/docs/guide/react.md)
- TypeScript only: [Extension: Default](https://pixijs.io/create-pixi/docs/guide/extension.md)
- JavaScript only: [Bundler: Import map](https://pixijs.io/create-pixi/docs/guide/bundlers.md#import-map)

## What changes in JavaScript

The JavaScript versions are generated from the TypeScript ones when create-pixi.js is published, so the code is the same apart from the types. Compared with the TypeScript version, a JavaScript project:

- Has `.js` and `.jsx` files instead of `.ts` and `.tsx`, with type annotations removed.
- Has no `tsconfig.json`, no `.d.ts` files and no `typescript` dependency.
- Skips `tsc` in the `build` script, so `build` only lints and bundles.
- Has no `typescript` plugin or rules in `.oxlintrc.json`.

Everything else matches: the bundler config, the dev port, and the oxfmt setup.

## TypeScript version

The app templates use TypeScript 7 and set `noEmit`, so `tsc` only type-checks. Vite, esbuild and esbuild-loader in webpack strip the types when they bundle, which is why `build` runs `tsc` as a separate step. The extension template uses the TypeScript version that comes with Extension Scripts.

`tsconfig.json` turns on `strict` mode and a few extra checks, including `noUnusedLocals` and `noUnusedParameters`. Unused variables and parameters fail the build. Delete them, or prefix an unused parameter with `_`.

## Adding types to a JavaScript project

You can type-check a JavaScript project without converting it. Install TypeScript, add a `jsconfig.json` or `tsconfig.json` with `"checkJs": true`, and describe types with JSDoc comments:

```js
/** @param {import("pixi.js").Sprite} sprite */
function spin(sprite) {
  sprite.rotation += 0.1;
}
```

To move to TypeScript completely, it's usually quicker to create a new project from the TypeScript version of the same template and copy your code across.
