import { sound } from "@pixi/sound";
import { ExtensionType } from "pixi.js";
import type { Application, ExtensionMetadata } from "pixi.js";

import { BGM, SFX } from "./audio";

/**
 * Middleware for Application's audio functionality.
 *
 * Adds the following methods to Application:
 * * Application#audio
 * * Application#audio.bgm
 * * Application#audio.sfx
 * * Application#audio.getMasterVolume
 * * Application#audio.setMasterVolume
 */
export class CreationAudioPlugin {
  /** @ignore */
  public static extension: ExtensionMetadata = ExtensionType.Application;

  /**
   * Initialize the plugin with scope of application instance
   */
  public static init(): void {
    const app = this as unknown as Application;

    app.audio = {
      bgm: new BGM(),
      sfx: new SFX(),
      getMasterVolume: () => sound.volumeAll,
      setMasterVolume: (volume: number) => {
        sound.volumeAll = volume;
        if (!volume) {
          sound.muteAll();
        } else {
          sound.unmuteAll();
        }
      },
    };
  }

  /**
   * Clean up the ticker, scoped to application
   */
  public static destroy(): void {
    const app = this as unknown as Application;
    app.audio = null as unknown as Application["audio"];
  }
}
