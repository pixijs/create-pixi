import { defineRoom, defineServer } from "colyseus";

import { GameRoom } from "./GameRoom.ts";
import { filterBy, routes } from "./platform.ts";

export const server = defineServer({
  rooms: {
    // The platform can split players into separate rooms, as Discord does
    // with one room per Activity session
    game: defineRoom(GameRoom).filterBy(filterBy),
  },
  routes,
});
