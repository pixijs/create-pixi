import {
  categories,
  categoryIds,
  gameTemplates,
  templatesIn,
} from "@templates/manifest";
import type {
  Game,
  Layer,
  Platform,
  TemplateDefinition,
} from "@templates/manifest";
import catalog from "@templates/package.json";

/** The build tool each layer brings. A template uses the first one in its layer list. */
const buildTools: Partial<Record<Layer, string>> = {
  "stack/vite": "Vite",
  "stack/webpack": "webpack",
  "stack/esbuild": "esbuild",
  "stack/import-map": "None",
  "stack/extension": "Extension Scripts",
};

/** The guide page for each layer. A template links to its most specific (last) layer. */
const layerDocs: Partial<Record<Layer, string>> = {
  "stack/vite": "/docs/guide/bundlers#vite",
  "stack/webpack": "/docs/guide/bundlers#webpack",
  "stack/esbuild": "/docs/guide/bundlers#esbuild",
  "stack/import-map": "/docs/guide/bundlers#import-map",
  "stack/react": "/docs/guide/react",
  "stack/extension": "/docs/guide/extension",
};

export function buildToolOf(template: TemplateDefinition) {
  return template.layers.map((layer) => buildTools[layer]).find(Boolean);
}

/** A game template links to its platform's page, at the multiplayer section if it's multiplayer */
export function docsLinkOf(template: TemplateDefinition) {
  const game = gameTemplates.find((gameTemplate) => gameTemplate === template);

  if (game) {
    return `${platformDocsOf(game.platform)}${game.multiplayer ? "#multiplayer" : ""}`;
  }

  return (
    template.layers
      .map((layer) => layerDocs[layer])
      .filter(Boolean)
      .at(-1) ?? "/docs/guide/choosing-a-template"
  );
}

/** Each game has a page at docs/guide/games/<id>.mdx */
export function gameDocsOf(game: Game) {
  return `/docs/guide/games/${game.id}`;
}

/** Each platform has a page at docs/guide/platforms/<id>.mdx */
export function platformDocsOf(platform: Platform) {
  return `/docs/guide/platforms/${platform.id}`;
}

export const templatesByCategory = categoryIds.map((id) => ({
  id,
  ...categories[id],
  templates: templatesIn(id),
}));

const versions: Record<string, string> = {
  ...catalog.dependencies,
  ...catalog.devDependencies,
};

/** Version of a template dependency without its range, e.g. `8.22.0` */
export function exactVersion(pkg: string) {
  return versions[pkg]?.replace(/^[^\d]+/, "") ?? "";
}

/** Major version of a template dependency, e.g. `8` */
export function majorVersion(pkg: string) {
  return exactVersion(pkg).split(".")[0];
}

/** Major and minor version of a template dependency, e.g. `4.3` */
export function minorVersion(pkg: string) {
  return exactVersion(pkg).split(".").slice(0, 2).join(".");
}
