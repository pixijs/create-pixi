import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import express from "express";

import { getAccessToken } from "./discord.ts";

/**
 * The game's server. `npm run dev` adds its routes under /api/ to the dev
 * server. The build writes this file to dist/server/server.mjs, which also
 * serves the game from dist/client.
 */
export const app = express();

/** Trades the sign-in code from src/platform.ts for an access token */
app.post("/api/token", express.json(), async (req, res) => {
  const access_token = await getAccessToken(req.body?.code);

  if (!access_token) {
    res.sendStatus(401);
    return;
  }

  res.json({ access_token });
});

// `npm run dev` serves the game itself
if (!import.meta.env.DEV) {
  // Loads DISCORD_CLIENT_SECRET. Variables that are already set, for example
  // in a host's settings, keep their value.
  if (existsSync(".env")) process.loadEnvFile();

  const port = Number(process.env.PORT) || 8080;

  // Keeps stack traces out of error pages
  app.set("env", "production");

  app.use(express.static(fileURLToPath(new URL("../client", import.meta.url))));
  app.listen(port, (error) => {
    if (error) throw error;

    console.log(`Game server running at http://localhost:${port}`);
  });
}
