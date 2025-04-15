import { ExtensionType } from "pixi.js";
import type { Application, ExtensionMetadata } from "pixi.js";

import type { CreationEngine } from "../engine";

import { Navigation } from "./navigation";

/**
 * Middleware for Application's navigation functionality.
 *
 * Adds the following methods to Application:
 * * Application#navigation
 */
export class CreationNavigationPlugin {
  /** @ignore */
  public static extension: ExtensionMetadata = ExtensionType.Application;

  private static _onResize: (() => void) | null;

  /**
   * Initialize the plugin with scope of application instance
   */
  public static init(): void {
    const app = this as unknown as CreationEngine;

    app.navigation = new Navigation();
    app.navigation.init(app);
    this._onResize = () =>
      app.navigation.resize(app.renderer.width, app.renderer.height);
    app.renderer.on("resize", this._onResize);
    app.resize();
  }

  /**
   * Clean up the ticker, scoped to application
   */
  public static destroy(): void {
    const app = this as unknown as Application;
    app.navigation = null as unknown as Navigation;
  }
}
