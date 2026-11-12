import { Client } from "@colyseus/sdk";

import type { server } from "../server/index.ts";
import { accessToken, discordSdk } from "./platform.ts";

/**
 * Joins the room for this Activity session with the player initPlatform
 * signed in, so everyone in the session plays together. The scene shows the
 * message of any error this throws.
 */
export async function joinGame() {
  if (!discordSdk) throw new Error("Open this game from Discord");
  if (!accessToken) throw new Error("Discord sign-in failed");

  // Discord's proxy sends every path to this server. Without a urlBuilder, the
  // SDK would rewrite URLs to /.proxy/colyseus/... inside Discord.
  const client = new Client<typeof server>(undefined, {
    urlBuilder: (url) => url.href,
  });

  // The room asks Discord who the token belongs to
  client.auth.token = accessToken;

  return await client.joinOrCreate("game", {
    instanceId: discordSdk.instanceId,
  });
}
