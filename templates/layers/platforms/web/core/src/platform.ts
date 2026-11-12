import type { Application } from "pixi.js";

/**
 * Startup hooks that main.ts calls. A plain web page needs none of them.
 * Other platforms, such as Discord, have their own version of this file that
 * starts their SDK and tells the platform when the game is ready.
 */

/** Runs first, before PixiJS starts */
export async function initPlatform() {}

/** Called while assets load, with progress from 0 to 1 */
export function setLoadingProgress(_progress: number) {}

/**
 * Runs once the scene is on screen and the game can be played. A platform
 * that pauses the game can stop `app.ticker` here.
 */
export function gameReady(_app: Application) {}
