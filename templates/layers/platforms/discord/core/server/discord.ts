export const DISCORD_API = "https://discord.com/api/v10";

/**
 * Trades the code from Discord's `authorize` command for an access token, or
 * returns undefined if Discord refuses the code or can't be reached. It runs
 * on the server because it needs the client secret.
 */
export async function getAccessToken(code: unknown) {
  if (typeof code !== "string" || code.length > 200) return undefined;

  // Outside Discord, `npm run dev` signs each tab in as a made-up player
  if (import.meta.env.DEV && code === "mock_code") {
    return `mock_${crypto.randomUUID()}`;
  }

  try {
    const response = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
        grant_type: "authorization_code",
        code,
      }),
    });

    if (response.ok) {
      const { access_token } = (await response.json()) as {
        access_token: string;
      };

      return access_token;
    }

    console.error("Discord sign-in failed:", await response.text());
  } catch (error) {
    console.error("Discord sign-in failed:", error);
  }

  return undefined;
}
