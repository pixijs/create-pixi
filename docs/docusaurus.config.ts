import type { Options as RedirectOptions } from "@docusaurus/plugin-client-redirects";
import type * as Preset from "@docusaurus/preset-classic";
import type { Config, Plugin } from "@docusaurus/types";

import llmsPlugin from "./plugins/llms";
import { guideLinks } from "./src/data/guideLinks";
import { pixiDark, pixiLight } from "./src/data/prism";

const fonts =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Roboto:ital,wght@0,400;0,500;0,600;1,400&family=Roboto+Mono:wght@400;500&display=swap";

/** Lets the site import `templates/manifest.ts` and template files as `@templates/*` */
function templatesAlias({ siteDir }: { siteDir: string }): Plugin {
  return {
    name: "templates-alias",
    configureWebpack: () => ({
      resolve: { alias: { "@templates": `${siteDir}/../templates` } },
    }),
  };
}

const config: Config = {
  title: "PixiJS Create",
  tagline: "Scaffold a PixiJS project in one command",
  favicon: "img/favicon.png",

  url: "https://pixijs.io",
  baseUrl: "/create-pixi/",

  organizationName: "pixijs",
  projectName: "create-pixi",
  deploymentBranch: "gh-pages",
  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  headTags: [
    {
      tagName: "link",
      attributes: { rel: "preconnect", href: "https://fonts.googleapis.com" },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
  ],
  stylesheets: [fonts],

  plugins: [
    templatesAlias,
    llmsPlugin,
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            // The creation template's pages, and the page about the game
            // templates before they were split into games and platforms
            from: [
              "/docs/guide/creations/intro",
              "/docs/guide/creations/engine",
              "/docs/guide/platform",
            ],
            to: "/docs/guide/games",
          },
          { from: "/docs/guide/discord", to: "/docs/guide/platforms/discord" },
        ],
      } satisfies RedirectOptions,
    ],
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/pixijs/create-pixi/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-3F9YN36TJR",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/ogimage.png",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "Create",
      logo: {
        alt: "PixiJS",
        src: "img/logo.svg",
        width: 32,
        height: 32,
      },
      items: [
        {
          to: "/docs/guide/installation",
          label: "Guide",
          position: "left",
          // Templates and CLI have their own items
          activeBaseRegex: "/docs/guide/(?!choosing-a-template|cli)",
        },
        {
          to: "/docs/guide/choosing-a-template",
          label: "Templates",
          position: "left",
        },
        {
          to: "/docs/guide/cli",
          label: "CLI",
          position: "left",
        },
        {
          href: "https://github.com/pixijs/create-pixi",
          position: "right",
          className: "header-link header-github-link",
          "aria-label": "GitHub repository",
        },
        {
          href: "https://discord.gg/CPTjeb28nH",
          position: "right",
          className: "header-link header-discord-link",
          "aria-label": "Discord server",
        },
        {
          href: "https://twitter.com/pixijs",
          position: "right",
          className: "header-link header-twitter-link",
          "aria-label": "Twitter account",
        },
        {
          href: "https://opencollective.com/pixijs",
          className: "header-link header-open-col-link",
          "aria-label": "Open Collective",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Guide",
          items: [
            ...guideLinks,
            { label: "llms.txt", to: "pathname:///llms.txt" },
          ],
        },
        {
          title: "PixiJS",
          items: [
            { label: "pixijs.com", href: "https://pixijs.com" },
            { label: "Guides", href: "https://pixijs.com/8.x/guides" },
            {
              label: "API reference",
              href: "https://pixijs.download/release/docs/index.html",
            },
            { label: "Examples", href: "https://pixijs.com/8.x/examples" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "GitHub", href: "https://github.com/pixijs/create-pixi" },
            { label: "Discord", href: "https://discord.gg/CPTjeb28nH" },
            {
              label: "Open Collective",
              href: "https://opencollective.com/pixijs",
            },
          ],
        },
      ],
      copyright: "Released under the MIT License.",
    },
    prism: {
      theme: pixiLight,
      darkTheme: pixiDark,
      additionalLanguages: ["bash", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
