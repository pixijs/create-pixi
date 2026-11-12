import { createEndpoint, createRouter, ErrorCode, ServerError } from "colyseus";

import { DISCORD_API, getAccessToken } from "./discord.ts";

export interface JoinOptions {
  /** src/connect.ts joins with the Activity session the player is in */
  instanceId: string;
}

/**
 * Runs before a player joins, and only lets in players signed in with
 * Discord. What it returns becomes `client.auth`.
 */
export async function onAuth(
  token: string | undefined,
  options: { instanceId?: unknown },
) {
  const { instanceId } = options;

  // Without an instanceId, filterBy would let the player into any room
  if (typeof instanceId !== "string" || instanceId.length > 100) {
    throw new ServerError(ErrorCode.AUTH_FAILED, "Open this game from Discord");
  }

  const name = token && (await getDiscordName(token));

  if (!name) {
    throw new ServerError(ErrorCode.AUTH_FAILED, "Sign in with Discord");
  }

  return { name };
}

/** Each Activity session gets its own room */
export const filterBy = ["instanceId"];

/** The sign-in route src/platform.ts calls */
export const routes = createRouter({
  discordToken: createEndpoint(
    "/api/token",
    { method: "POST" },
    async (ctx) => {
      const access_token = await getAccessToken(ctx.body?.code);

      if (!access_token) {
        throw ctx.error("UNAUTHORIZED", { message: "Discord sign-in failed" });
      }

      return { access_token };
    },
  ),
});

/** Asks Discord for the name of the player an access token belongs to */
async function getDiscordName(token: string) {
  if (import.meta.env.DEV && token.startsWith("mock_")) {
    return `Player ${token.slice(5, 9)}`;
  }

  const response = await fetch(`${DISCORD_API}/oauth2/@me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return undefined;

  const { application, user } = (await response.json()) as {
    application: { id: string };
    user?: { username: string; global_name: string | null };
  };

  // Only accept tokens from this app's sign-in, not from other Discord apps
  if (application.id !== import.meta.env.VITE_DISCORD_CLIENT_ID) {
    return undefined;
  }

  // global_name is the display name, when the player has set one
  return user && (user.global_name ?? user.username);
}
