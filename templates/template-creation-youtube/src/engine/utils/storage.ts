/**
 * Simple local storage utility that can safely get/set number, boolean and object values too
 * not only string as in plain localStorage.
 */
class StorageWrapper {
  private STORAGE_KEY = "user_settings";

  private isPlayableEnv(): boolean {
    return (
      typeof ytgame !== "undefined" &&
      ytgame.game &&
      typeof ytgame.game.saveData === "function" &&
      typeof ytgame.game.loadData === "function"
    );
  }

  /** Loads the full settings object from persistent storage (async) */
  private async loadAll(): Promise<Record<string, unknown>> {
    if (this.isPlayableEnv()) {
      const data = await ytgame.game.loadData();
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.warn("Failed to parse Playables settings:", e);
        }
      }
      return {};
    } else {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          console.warn("Failed to parse local settings:", e);
        }
      }
      return {};
    }
  }

  /** Saves the full settings object to persistent storage (async) */
  private async saveAll(obj: Record<string, unknown>): Promise<void> {
    const data = JSON.stringify(obj);
    if (this.isPlayableEnv()) {
      await ytgame.game.saveData(data);
    } else {
      localStorage.setItem(this.STORAGE_KEY, data);
    }
  }

  /** Get a string value from storage (async) */
  public async getString(key: string): Promise<string | undefined> {
    const obj = await this.loadAll();
    const val = obj[key];
    return typeof val === "string"
      ? val
      : val !== undefined
        ? String(val)
        : undefined;
  }

  /** Set a string value to storage (async) */
  public async setString(key: string, value: string): Promise<void> {
    const obj = await this.loadAll();
    obj[key] = value;
    await this.saveAll(obj);
  }

  /** Get a number value from storage (async) */
  public async getNumber(key: string): Promise<number | null> {
    const val = await this.getString(key);
    if (val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }

  /** Set a number value to storage (async) */
  public async setNumber(key: string, value: number): Promise<void> {
    await this.setString(key, String(value));
  }

  /** Get a boolean value from storage (async) */
  public async getBool(key: string): Promise<boolean | undefined> {
    const val = await this.getString(key);
    if (val === undefined) return undefined;
    // Accept 'true', 'false', '1', '0', etc.
    if (val.toLowerCase() === "true" || val === "1") return true;
    if (val.toLowerCase() === "false" || val === "0") return false;
    return Boolean(val);
  }

  /** Set a boolean value to storage (async) */
  public async setBool(key: string, value: boolean): Promise<void> {
    await this.setString(key, String(value));
  }

  /** Get an object value from storage (async) */
  public async getObject<T = unknown>(key: string): Promise<T | undefined> {
    const val = await this.getString(key);
    if (val === undefined) return undefined;
    try {
      return JSON.parse(val) as T;
    } catch (e) {
      console.warn("Failed to parse object for key", key, e);
      return undefined;
    }
  }

  /** Set an object value to storage (async) */
  public async setObject(
    key: string,
    value: Record<string, unknown>,
  ): Promise<void> {
    await this.setString(key, JSON.stringify(value));
  }
}

export const storage = new StorageWrapper();
