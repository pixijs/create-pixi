import { schema, t } from "@colyseus/schema";
import type { SchemaType } from "@colyseus/schema";

/**
 * A player's bunny. The server sets its position, and its name when players
 * sign in.
 */
export const Player = schema(
  { x: t.number(), y: t.number(), name: t.string() },
  "Player",
);

/** The room state. Every change is sent to every player in the room. */
export const GameState = schema({ players: t.map(Player) }, "GameState");
export type GameState = SchemaType<typeof GameState>;
