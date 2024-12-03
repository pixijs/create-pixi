import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "PixiJS Create",
  tagline: "A CLI tool to create PixiJS projects with ease",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://pixijs.io",
  baseUrl: "/create-pixi/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "pixijs", // Usually your GitHub org/user name.
  projectName: "create-pixi", // Usually your repo name.
  deploymentBranch: "gh-pages", // Branch that GitHub pages will deploy to.
  trailingSlash: true,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/pixijs/create-pixi/tree/main/packages/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/pixijs/create-pixi/tree/main/packages/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/ogimage.jpg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "Create",
      logo: {
        alt: "PixiJS Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "guide",
          position: "left",
          label: "Guide",
        },
        {
          href: "https://opencollective.com/pixijs",
          className: "header-link header-open-col-link",
          "aria-label": "Open Collective",
          position: "right",
        },
        {
          href: "https://twitter.com/pixijs",
          position: "right",
          className: "header-link header-twitter-link",
          "aria-label": "Twitter account",
        },
        {
          href: "https://discord.gg/CPTjeb28nH",
          position: "right",
          className: "header-link header-discord-link",
          "aria-label": "Discord server",
        },
        {
          href: "https://github.com/pixijs/create-pixi",
          position: "right",
          className: "header-link header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
