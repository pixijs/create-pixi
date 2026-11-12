import { colyseus } from "colyseus/vite";
import { defineConfig } from "vite";

// The dev server and the built game server both listen on this port
const port = 8080;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Runs the game server inside the dev server. The build writes it to
    // dist/server/server.mjs, which also serves the game from dist/client.
    colyseus({ serverEntry: "/server/index.ts", port, serveClient: true }),
  ],
  server: {
    port,
    open: true,
    // Lets other people reach the dev server through a cloudflared tunnel
    allowedHosts: [".trycloudflare.com"],
  },
  build: {
    // PixiJS, PixiJS 3D and the game libraries together are larger than
    // Vite's 500 kB default
    chunkSizeWarningLimit: 1000,
  },
  environments: {
    // The game server serves public/ from dist/client, so skip a second copy
    colyseus: { build: { copyPublicDir: false } },
  },
});
