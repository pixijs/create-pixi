import { createRouter } from "colyseus";

// How the game server lets players in. On the web anyone can join any room,
// without options, so none of these change anything. Platforms with sign-in,
// such as Discord Activities, check players and split them into rooms here.

export type JoinOptions = undefined;

/** Runs before a player joins. `true` lets them in without signing in. */
export async function onAuth() {
  return true;
}

/** Join options that split players into separate rooms */
export const filterBy: string[] = [];

/** HTTP routes the platform adds to the game server */
export const routes = createRouter({});
