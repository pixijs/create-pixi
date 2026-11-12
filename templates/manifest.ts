export type Category = "game" | "bundler" | "framework" | "extension";
export type Language = "ts" | "js";

/** A directory in `templates/layers`, e.g. `stack/vite` or `games/starter/core` */
export type Layer = `${"stack" | "games" | "platforms"}/${string}`;

export interface TemplateDefinition {
  /** Template id, passed to `--template`. JavaScript variants get a `-js` suffix. */
  id: string;
  /** Name shown in prompts and docs */
  name: string;
  /** One-line summary shown in docs */
  description: string;
  category: Category;
  /** Directories in `templates/layers`, applied in order. Later layers win. */
  layers: Layer[];
  /** Languages to publish. The first entry is the default. */
  languages: Language[];
}

/** A game in `templates/layers/games/<id>` */
export interface Game {
  id: string;
  name: string;
  description: string;
  /** Has a `multiplayer` layer next to its `core` layer */
  multiplayer: boolean;
}

/** A platform in `templates/layers/platforms/<id>` */
export interface Platform {
  id: string;
  name: string;
  description: string;
  /** Has a `multiplayer` layer next to its `core` layer */
  multiplayer: boolean;
  /** Has a `single-player` layer, which only single-player templates use */
  singlePlayer: boolean;
}

/** A game on a platform, made by `defineGameTemplates` */
export interface GameTemplateDefinition extends TemplateDefinition {
  category: "game";
  game: Game;
  platform: Platform;
  multiplayer: boolean;
}

export interface TemplateVariant {
  /** Id of the generated template, e.g. `bundler-vite-js` */
  id: string;
  language: Language;
  template: TemplateDefinition;
}

export const categories: Record<
  Category,
  { name: string; description: string }
> = {
  game: {
    name: "Game",
    description:
      "A game starter for the platform of your choice, with GSAP, PixiJS UI, PixiJS Sound, PixiJS Filters and Spine.",
  },
  bundler: {
    name: "Bundler",
    description:
      "A minimal PixiJS app wired up to the build tool of your choice.",
  },
  framework: {
    name: "Framework",
    description: "PixiJS rendered inside a UI framework.",
  },
  extension: {
    name: "Extension",
    description: "A library project for publishing your own PixiJS plugin.",
  },
};

export const categoryIds = Object.keys(categories) as Category[];

export const languageNames: Record<Language, string> = {
  ts: "TypeScript",
  js: "JavaScript",
};

export const games: Game[] = [
  {
    id: "starter",
    name: "Starter",
    description: "A bunny that jumps when you press a button.",
    multiplayer: true,
  },
];

export const platforms: Platform[] = [
  {
    id: "web",
    name: "Web",
    description: "A standalone browser game built with Vite.",
    multiplayer: true,
    singlePlayer: false,
  },
  {
    id: "discord",
    name: "Discord Activity",
    description: "Runs inside Discord as an Activity, with Discord sign-in.",
    multiplayer: true,
    singlePlayer: true,
  },
];

export const multiplayerDescription =
  "Adds a Colyseus server that keeps every player in sync.";

/** Layers every game template starts from */
const gameStack: Layer[] = [
  "stack/base",
  "stack/typescript",
  "stack/vite",
  "stack/game",
];

/**
 * A template for each game on each platform, plus a multiplayer one when both
 * the game and the platform have a multiplayer layer
 */
export function defineGameTemplates(games: Game[], platforms: Platform[]) {
  return games.flatMap((game) =>
    platforms.flatMap((platform) =>
      (game.multiplayer && platform.multiplayer ? [false, true] : [false]).map(
        (multiplayer) => defineGameTemplate(game, platform, multiplayer),
      ),
    ),
  );
}

function defineGameTemplate(
  game: Game,
  platform: Platform,
  multiplayer: boolean,
): GameTemplateDefinition {
  const layers: Layer[] = [
    ...gameStack,
    `games/${game.id}/core`,
    `platforms/${platform.id}/core`,
  ];
  const suffix = multiplayer ? ["multiplayer"] : [];

  if (multiplayer) {
    layers.push(
      "stack/colyseus",
      `games/${game.id}/multiplayer`,
      `platforms/${platform.id}/multiplayer`,
    );
  } else if (platform.singlePlayer) {
    layers.push(`platforms/${platform.id}/single-player`);
  }

  return {
    id: [game.id, platform.id, ...suffix].join("-"),
    name: [game.name, platform.name, ...suffix].join(", "),
    description: [
      game.description,
      platform.description,
      ...(multiplayer ? [multiplayerDescription] : []),
    ].join(" "),
    category: "game",
    layers,
    languages: ["ts", "js"],
    game,
    platform,
    multiplayer,
  };
}

export const gameTemplates = defineGameTemplates(games, platforms);

export const templates: TemplateDefinition[] = [
  ...gameTemplates,
  {
    id: "bundler-vite",
    name: "Vite",
    description:
      "Instant dev server that reloads on save. The recommended starting point.",
    category: "bundler",
    layers: [
      "stack/base",
      "stack/typescript",
      "stack/assets",
      "stack/vanilla",
      "stack/vite",
    ],
    languages: ["ts", "js"],
  },
  {
    id: "bundler-webpack",
    name: "webpack",
    description: "webpack with esbuild-loader for fast TypeScript builds.",
    category: "bundler",
    layers: [
      "stack/base",
      "stack/typescript",
      "stack/assets",
      "stack/vanilla",
      "stack/webpack",
    ],
    languages: ["ts", "js"],
  },
  {
    id: "bundler-esbuild",
    name: "esbuild",
    description:
      "Plain esbuild scripts with a live-reloading dev server and no plugins.",
    category: "bundler",
    layers: [
      "stack/base",
      "stack/typescript",
      "stack/assets",
      "stack/vanilla",
      "stack/esbuild",
    ],
    languages: ["ts", "js"],
  },
  {
    id: "bundler-import-map",
    name: "Import map",
    description:
      "No build step. PixiJS loads from a CDN through a browser import map.",
    category: "bundler",
    layers: ["stack/base", "stack/assets", "stack/import-map"],
    languages: ["js"],
  },
  {
    id: "framework-react",
    name: "React",
    description: "React with @pixi/react, built with Vite.",
    category: "framework",
    layers: [
      "stack/base",
      "stack/typescript",
      "stack/assets",
      "stack/vite",
      "stack/react",
    ],
    languages: ["ts", "js"],
  },
  {
    id: "extension-default",
    name: "Default",
    description:
      "Build, test, document and publish a PixiJS extension with PixiJS Extension Scripts.",
    category: "extension",
    layers: ["stack/extension"],
    languages: ["ts"],
  },
];

export const variants: TemplateVariant[] = templates.flatMap((template) =>
  template.languages.map((language) => ({
    id:
      language === "js" && template.languages.includes("ts")
        ? `${template.id}-js`
        : template.id,
    language,
    template,
  })),
);

export function templatesIn(category: Category) {
  return templates.filter((template) => template.category === category);
}

export function findVariant(id: string) {
  return variants.find((variant) => variant.id === id);
}

/** Like `findVariant`, but throws for an unknown id */
export function getVariant(id: string) {
  const variant = findVariant(id);

  if (!variant) throw new Error(`Unknown template "${id}"`);

  return variant;
}

/** The template for a game on a platform, if there is one */
export function gameTemplateOf(
  game: Game,
  platform: Platform,
  multiplayer: boolean,
) {
  return gameTemplates.find(
    (template) =>
      template.game === game &&
      template.platform === platform &&
      template.multiplayer === multiplayer,
  );
}

export function variantOf(template: TemplateDefinition, language: Language) {
  return variants.find(
    (variant) => variant.template === template && variant.language === language,
  );
}

/** The name shown in the CLI and docs, e.g. `Bundler: Vite` */
export function labelOf(template: TemplateDefinition) {
  return `${categories[template.category].name}: ${template.name}`;
}
