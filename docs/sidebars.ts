import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  guide: [
    "guide/installation",
    "guide/choosing-a-template",
    {
      type: "category",
      label: "Templates",
      collapsible: false,
      items: [
        {
          type: "category",
          label: "Game templates",
          link: { type: "doc", id: "guide/games/index" },
          collapsed: false,
          items: [
            "guide/games/starter",
            "guide/platforms/web",
            "guide/platforms/discord",
            "guide/multiplayer",
          ],
        },
        "guide/bundlers",
        "guide/react",
        "guide/extension",
      ],
    },
    {
      type: "category",
      label: "Project setup",
      collapsible: false,
      items: [
        "guide/pixijs-3d",
        "guide/linting-and-formatting",
        "guide/typescript-and-javascript",
      ],
    },
    {
      type: "category",
      label: "Reference",
      collapsible: false,
      items: ["guide/cli", "guide/troubleshooting", "guide/contributing"],
    },
  ],
};

export default sidebars;
