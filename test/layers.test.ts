import path from "node:path";

import { describe, expect, it } from "vitest";

import { readLayer } from "../templates/generate.ts";
import { gameTemplates, platforms } from "../templates/manifest.ts";

/** Files that merge with the same file from other layers instead of replacing it */
const merges = (file: string) =>
  file.endsWith(".json") || path.posix.basename(file) === "_gitignore";

/** Every layer the game templates use that starts with `prefix` */
function layersIn(prefix: string) {
  return [
    ...new Set(
      gameTemplates.flatMap(({ layers }) =>
        layers.filter((layer) => layer.startsWith(prefix)),
      ),
    ),
  ];
}

const gameFiles = new Set(
  layersIn("games/").flatMap((layer) => [...readLayer(layer).keys()]),
);

describe.each(platforms)("platforms/$id", (platform) => {
  it("doesn't replace or import game files", () => {
    for (const layer of layersIn(`platforms/${platform.id}/`)) {
      for (const [file, content] of readLayer(layer)) {
        if (!merges(file)) {
          expect(gameFiles.has(file), `${layer} replaces ${file}`).toBe(false);
        }

        if (!file.endsWith(".ts")) continue;

        for (const [, type, specifier] of String(content).matchAll(
          /^import (type )?[^;]*? from "(\.\.?\/[^"]+)"/gm,
        )) {
          const target = path.posix.join(path.posix.dirname(file), specifier);

          // Only the game server's type, which types the rooms the client joins
          if (gameFiles.has(target)) {
            expect(`${type ?? ""}${target}`, `${layer}/${file}`).toBe(
              "type server/index.ts",
            );
          }
        }
      }
    }
  });
});
