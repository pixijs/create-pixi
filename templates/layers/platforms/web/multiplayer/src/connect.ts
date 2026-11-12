import { Client } from "@colyseus/sdk";

import type { server } from "../server/index.ts";

/**
 * Joins a game room on the server that served this page. The scene shows the
 * message of any error this throws.
 */
export async function joinGame() {
  try {
    return await new Client<typeof server>().joinOrCreate("game");
  } catch (error) {
    throw new Error("Can't reach the game server", { cause: error });
  }
}
