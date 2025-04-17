import { storage } from "../../engine/utils/storage";
import { engine } from "../getEngine";

// Keys for saved items in storage
const KEY_VOLUME_MASTER = "volume-master";
const KEY_VOLUME_BGM = "volume-bgm";
const KEY_VOLUME_SFX = "volume-sfx";

/**
 * Persistent user settings of volumes.
 */
class UserSettings {
  public async init() {
    engine().audio.setMasterVolume(await this.getMasterVolume());
    engine().audio.bgm.setVolume(await this.getBgmVolume());
    engine().audio.sfx.setVolume(await this.getSfxVolume());
  }

  /** Get overall sound volume */
  public async getMasterVolume(): Promise<number> {
    return (await storage.getNumber(KEY_VOLUME_MASTER)) ?? 0.5;
  }

  /** Set overall sound volume */
  public async setMasterVolume(value: number): Promise<void> {
    engine().audio.setMasterVolume(value);
    await storage.setNumber(KEY_VOLUME_MASTER, value);
  }

  /** Get background music volume */
  public async getBgmVolume(): Promise<number> {
    return (await storage.getNumber(KEY_VOLUME_BGM)) ?? 1;
  }

  /** Set background music volume */
  public async setBgmVolume(value: number): Promise<void> {
    engine().audio.bgm.setVolume(value);
    await storage.setNumber(KEY_VOLUME_BGM, value);
  }

  /** Get sound effects volume */
  public async getSfxVolume(): Promise<number> {
    return (await storage.getNumber(KEY_VOLUME_SFX)) ?? 1;
  }

  /** Set sound effects volume */
  public async setSfxVolume(value: number): Promise<void> {
    engine().audio.sfx.setVolume(value);
    await storage.setNumber(KEY_VOLUME_SFX, value);
  }
}

/** SHared user settings instance */
export const userSettings = new UserSettings();
