import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

import { defineConfig } from "vite";
import type { Plugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [serverRoutes()],
  server: {
    // dist/server/server.mjs also uses 8080, unless PORT is set
    port: 8080,
    open: true,
    // Lets Discord reach the dev server through a cloudflared tunnel
    allowedHosts: [".trycloudflare.com"],
  },
  // `vite build` builds the game into dist/client and the server below
  builder: {},
  build: {
    outDir: "dist/client",
    // PixiJS, PixiJS 3D and the game libraries together are larger than
    // Vite's 500 kB default
    chunkSizeWarningLimit: 1000,
  },
  environments: {
    ssr: {
      build: {
        outDir: "dist/server",
        // The server serves public/ from dist/client, so skip a second copy
        copyPublicDir: false,
        rolldownOptions: {
          input: "server/main.ts",
          output: { entryFileNames: "server.mjs" },
        },
      },
    },
  },
});

/**
 * Lets the routes in server/main.ts answer requests under /api/, so
 * `npm run dev` runs the game and its server in one process. Saving a file in
 * server/ takes effect on the next request.
 */
function serverRoutes(): Plugin {
  return {
    name: "server-routes",
    configureServer(server) {
      // Gives the server DISCORD_CLIENT_SECRET from .env. Vite restarts when
      // .env changes, so edits apply. VITE_ variables stay out of process.env,
      // where they would hide those edits from Vite.
      if (existsSync(".env")) {
        const env = parseEnv(readFileSync(".env", "utf8"));

        for (const [key, value] of Object.entries(env)) {
          if (!key.startsWith("VITE_")) process.env[key] = value;
        }
      }

      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();

        server
          .ssrLoadModule("/server/main.ts")
          .then(({ app }) => app(req, res), next);
      });
    },
  };
}
