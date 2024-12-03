import type { GameEngine } from "../engine/engine";

let instance: GameEngine | null = null;

export function engine(): GameEngine {
  return instance!;
}

export function setEngine(app: GameEngine) {
  instance = app;
}
