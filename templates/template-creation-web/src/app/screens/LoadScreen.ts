import { animate } from "motion";
import type { ObjectTarget } from "motion/react";
import { Container, Sprite, Text, Texture } from "pixi.js";

/** Screen shown while loading assets */
export class LoadScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["preload"];
  /** The PixiJS logo */
  private pixiLogo: Sprite;
  /** LThe loading message display */
  private message: Text;

  constructor() {
    super();

    this.message = new Text({
      text: "Loading...",
      style: {
        fill: "white",
        fontFamily: "Verdana",
        align: "center",
        fontSize: 40,
      },
    });
    this.message.anchor.set(0.5);
    this.addChild(this.message);

    this.pixiLogo = new Sprite({
      texture: Texture.from("logo.svg"),
      anchor: 0.5,
      scale: 0.5,
    });
    this.addChild(this.pixiLogo);
  }

  /** Resize the screen, fired whenever window size changes  */
  public resize(width: number, height: number) {
    this.message.position.set(width * 0.5, height * 0.5 + 125);
    this.pixiLogo.position.set(width * 0.5, height * 0.5);
  }

  /** Show screen with animations */
  public async show() {
    this.alpha = 1;
  }

  /** Hide screen with animations */
  public async hide() {
    // Change then hide the loading message
    this.message.text = "Ready!";

    await animate(this, { alpha: 0 } as ObjectTarget<this>, {
      duration: 0.3,
      ease: "linear",
      delay: 1,
    });
  }
}
