import { Room } from "colyseus";
import type { Client } from "colyseus";

import { GameState, Player } from "./GameState.ts";
import { onAuth } from "./platform.ts";
import type { JoinOptions } from "./platform.ts";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./world.ts";

/** Every player who joins gets a bunny they can move and make jump */
export class GameRoom extends Room<{ state: GameState }> {
  /** Signs players in on platforms that need it, before they join */
  static onAuth = onAuth;

  state = new GameState();

  messages = {
    move: (client: Client, message: { x: number; y: number }) => {
      const player = this.state.players.get(client.sessionId);

      // Clients can send anything, so check the message before using it
      if (
        !player ||
        !Number.isFinite(message?.x) ||
        !Number.isFinite(message?.y)
      ) {
        return;
      }

      player.x = clamp(message.x, 0, WORLD_WIDTH);
      player.y = clamp(message.y, 0, WORLD_HEIGHT);
    },
    jump: (client: Client) => {
      this.broadcast("jump", client.sessionId);
    },
  };

  /** The options src/connect.ts joins with, already checked by onAuth */
  onJoin(client: Client<{ auth?: { name: string } }>, _options?: JoinOptions) {
    // Reloading the dev server rejoins every player into the restored room
    if (this.state.players.has(client.sessionId)) return;

    this.state.players.set(
      client.sessionId,
      new Player({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        // Templates that sign players in, like Discord, set client.auth
        name: client.auth?.name ?? "",
      }),
    );
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }

  /** Without this, an error in the room stops the whole server */
  onUncaughtException(error: Error) {
    console.error(error);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
