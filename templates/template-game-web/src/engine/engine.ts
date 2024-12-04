import { sound } from "@pixi/sound";
import type { ApplicationOptions } from "pixi.js";
import { Application, Assets } from "pixi.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - This is a dynamically generated file by AssetPack
import manifest from "../manifest.json";

import { BGM, SFX } from "./audio";
import { Navigation } from "./navigation";

/**
 * The main game engine class.
 *
 * This is a lightweight wrapper around the PixiJS Application class.
 * It provides a few additional features such as:
 * - Navigation manager
 * - Audio manager
 * - Resize handling
 * - Visibility change handling (pause/resume sounds)
 *
 * It also initializes the PixiJS application and loads any assets in the `preload` bundle.
 */
export class GameEngine {
  /** Reference to the PixiJS application */
  public readonly pixiApp = new Application();

  /** Options for resizing the application */
  public resizeOptions: {
    /** Minimum width of the application */
    minWidth: number;
    /** Minimum height of the application */
    minHeight: number;
    /** Whether to letterbox the application when resizing */
    letterbox?: boolean;
  } = { minWidth: 768, minHeight: 1024, letterbox: true };

  /** Navigation manager */
  public readonly navigation = new Navigation();

  /** The background music audio manager */
  public bgm = new BGM();
  /** The sound effects audio manager */
  public sfx = new SFX();

  /** Initialize the application */
  public async init(
    opts: Partial<ApplicationOptions> & {
      resizeOptions?: Partial<GameEngine["resizeOptions"]>;
    },
  ): Promise<void> {
    await this.pixiApp.init(opts);

    // Append the application canvas to the document body
    document.getElementById("game-container")!.appendChild(this.pixiApp.canvas);

    this.navigation.init(this);

    // Store the resize options
    this.resizeOptions = {
      ...this.resizeOptions,
      ...(opts.resizeOptions || {}),
    };

    // Whenever the window resizes, call the 'resize' function
    window.addEventListener("resize", () => this.resize());

    // Trigger the first resize
    this.resize();

    // Add a visibility listener, so the app can pause sounds and screens
    document.addEventListener("visibilitychange", this.visibilityChange);

    // Init PixiJS assets with this asset manifest
    await Assets.init({ manifest, basePath: "assets" });
    await Assets.loadBundle("preload");

    // List all existing bundles names
    const allBundles = manifest.bundles.map((item) => item.name);
    // Start up background loading of all bundles
    Assets.backgroundLoadBundle(allBundles);
  }

  /** Reference to the renderer's screen rectangle. Its safe to use as filterArea or hitArea for the whole screen. */
  public get screen() {
    return this.pixiApp.screen;
  }

  /**
   * Get the root container that is rendered.
   * This stage also contains the container for navigation
   */
  public get stage() {
    return this.pixiApp.stage;
  }

  /** Get the shared pixi ticker */
  public get ticker() {
    return this.pixiApp.ticker;
  }

  /** Reference to the current renderer. */
  public get renderer() {
    return this.pixiApp.renderer;
  }

  /** Reference to the renderer's canvas element. */
  public get canvas() {
    return this.pixiApp.canvas;
  }

  /** Get overall sound volume */
  public getMasterVolume() {
    return sound.volumeAll;
  }

  /** Set the overall sound volume, affecting all music and sound effects */
  public setMasterVolume(v: number) {
    sound.volumeAll = v;
    if (!v) {
      sound.muteAll();
    } else {
      sound.unmuteAll();
    }
  }

  /**
   * Resize the application ensuring that the minimum width and height are maintained.
   * @param w - The new width to resize to
   * @param h - The new height to resize to
   */
  public resize(w?: number, h?: number) {
    const minWidth = this.resizeOptions.minWidth;
    const minHeight = this.resizeOptions.minHeight;
    const aspectRatio = minWidth / minHeight;
    let canvasWidth = w ?? window.innerWidth;
    let canvasHeight = h ?? window.innerHeight;

    if (this.resizeOptions.letterbox) {
      if (minWidth < minHeight) {
        canvasHeight = window.innerHeight;
        canvasWidth = Math.min(
          window.innerWidth,
          minWidth,
          canvasHeight * aspectRatio,
        );
      } else {
        canvasWidth = window.innerWidth;
        canvasHeight = Math.min(
          window.innerHeight,
          minHeight,
          canvasWidth / aspectRatio,
        );
      }
    }

    const scaleX = canvasWidth < minWidth ? minWidth / canvasWidth : 1;
    const scaleY = canvasHeight < minHeight ? minHeight / canvasHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = Math.floor(canvasWidth * scale);
    const height = Math.floor(canvasHeight * scale);

    this.pixiApp.renderer.canvas.style.width = `${canvasWidth}px`;
    this.pixiApp.renderer.canvas.style.height = `${canvasHeight}px`;
    window.scrollTo(0, 0);

    this.pixiApp.renderer.resize(width, height);
    this.navigation.resize(width, height);
  }

  /** Fire when document visibility changes - lose or regain focus */
  protected visibilityChange = () => {
    if (document.hidden) {
      sound.pauseAll();
      this.navigation.blur();
    } else {
      sound.resumeAll();
      this.navigation.focus();
    }
  };
}
