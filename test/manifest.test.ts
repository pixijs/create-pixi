import { describe, expect, it } from "vitest";

import {
  defineGameTemplates,
  findVariant,
  games,
  platforms,
  variants,
} from "../templates/manifest.ts";
import type { Game, Platform } from "../templates/manifest.ts";

describe("game templates", () => {
  it("puts every game on every platform", () => {
    expect(variants.map(({ id }) => id)).toEqual([
      "starter-web",
      "starter-web-js",
      "starter-web-multiplayer",
      "starter-web-multiplayer-js",
      "starter-discord",
      "starter-discord-js",
      "starter-discord-multiplayer",
      "starter-discord-multiplayer-js",
      "bundler-vite",
      "bundler-vite-js",
      "bundler-webpack",
      "bundler-webpack-js",
      "bundler-esbuild",
      "bundler-esbuild-js",
      "bundler-import-map",
      "framework-react",
      "framework-react-js",
      "extension-default",
    ]);
  });

  it("adds multiplayer only when the game and the platform both have it", () => {
    const solo: Game = { ...games[0], id: "solo", multiplayer: false };
    const offline: Platform = {
      ...platforms[0],
      id: "offline",
      multiplayer: false,
    };

    expect(
      defineGameTemplates([games[0], solo], [platforms[0], offline]).map(
        ({ id }) => id,
      ),
    ).toEqual([
      "starter-web",
      "starter-web-multiplayer",
      "starter-offline",
      "solo-web",
      "solo-offline",
    ]);
  });

  it("applies multiplayer layers after the game and the platform", () => {
    expect(findVariant("starter-discord-multiplayer")?.template.layers).toEqual(
      [
        "stack/base",
        "stack/typescript",
        "stack/vite",
        "stack/game",
        "games/starter/core",
        "platforms/discord/core",
        "stack/colyseus",
        "games/starter/multiplayer",
        "platforms/discord/multiplayer",
      ],
    );
  });

  it("applies a platform's single-player layer only without multiplayer", () => {
    expect(findVariant("starter-discord")?.template.layers.slice(-2)).toEqual([
      "platforms/discord/core",
      "platforms/discord/single-player",
    ]);
  });
});
