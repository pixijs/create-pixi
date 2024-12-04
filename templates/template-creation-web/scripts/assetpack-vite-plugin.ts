// vite.config.mts
import type { AssetPackConfig } from "@assetpack/core";
import { AssetPack } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";
import type { Plugin, ResolvedConfig } from "vite";

export function assetpackPlugin() {
  const apConfig = {
    entry: "./raw-assets",
    pipes: [
      ...pixiPipes({
        cacheBust: false,
        manifest: {
          output: "./src/manifest.json",
        },
      }),
    ],
  } as AssetPackConfig;
  let mode: ResolvedConfig["command"];
  let ap: AssetPack | undefined;

  return {
    name: "vite-plugin-assetpack",
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
      if (!resolvedConfig.publicDir) return;
      if (apConfig.output) return;
      // remove the root from the oublic dir
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), "");
      apConfig.output = `.${publicDir}/assets/`;
    },
    buildStart: async () => {
      if (mode === "serve") {
        if (ap) return;
        ap = new AssetPack(apConfig);
        await ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  } as Plugin;
}
