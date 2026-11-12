import { DiscordSDK, DiscordSDKMock } from "@discord/embedded-app-sdk";
import type { CommandResponse, IDiscordSDK } from "@discord/embedded-app-sdk";
import type { Application } from "pixi.js";

/**
 * Talks to the Discord app the game runs in. In a plain browser tab,
 * `npm run dev` uses a mock instead, so the game runs without Discord. A
 * production build opened outside Discord has neither.
 */
export const discordSdk = createDiscordSdk();

/**
 * The signed-in player's Discord account, once initPlatform has run. It's
 * undefined when nobody is signed in: in a production build opened outside
 * Discord, or when sign-in failed.
 */
export let user: CommandResponse<"authenticate">["user"] | undefined;

/** The player's access token, which your server can check with Discord */
export let accessToken: string | undefined;

function createDiscordSdk(): IDiscordSDK | undefined {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

  // Discord adds frame_id to the page URL when it opens the game
  if (new URLSearchParams(location.search).has("frame_id")) {
    if (!clientId) throw new Error("Set VITE_DISCORD_CLIENT_ID in .env");

    return new DiscordSDK(clientId);
  }

  if (import.meta.env.DEV) {
    return new DiscordSDKMock(clientId, null, null, null);
  }

  return undefined;
}

/** Runs first, before PixiJS starts. Connects to Discord and signs in. */
export async function initPlatform() {
  if (!discordSdk) return;

  await discordSdk.ready();

  try {
    await signIn(discordSdk);
  } catch (error) {
    // The game still starts, so a player who declines can play signed out
    console.error("Discord sign-in failed:", error);
  }
}

/** Asks the player to share their Discord account with the game */
async function signIn(sdk: IDiscordSDK) {
  const { code } = await sdk.commands.authorize({
    client_id: sdk.clientId,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: ["identify"],
  });

  // The server trades the code for a token, since only it has the secret
  const response = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) throw new Error(`/api/token answered ${response.status}`);

  const { access_token } = (await response.json()) as { access_token: string };

  user = (await sdk.commands.authenticate({ access_token })).user;
  accessToken = access_token;
}

/** Discord has no loading screen to update */
export function setLoadingProgress(_progress: number) {}

/** Discord doesn't need to know when the game is ready */
export function gameReady(_app: Application) {}
