import { FancyButton } from "@pixi/ui";
import { NineSliceSprite, Texture } from "pixi.js";

import { engine } from "../getEngine";

import { Label } from "./Label";

const defaultLargeButtonOptions = {
  text: "",
  width: 301,
  height: 112,
  fontSize: 28,
};

type LargeButtonOptions = typeof defaultLargeButtonOptions;

/**
 * The big rectangle button, with a label, idle and pressed states
 */
export class LargeButton extends FancyButton {
  constructor(options: Partial<LargeButtonOptions> = {}) {
    const opts = { ...defaultLargeButtonOptions, ...options };

    const defaultView = new NineSliceSprite({
      texture: Texture.from("button-large.png"),
      leftWidth: 36,
      topHeight: 42,
      rightWidth: 36,
      bottomHeight: 52,
      width: opts.width,
      height: opts.height,
    });

    const pressedView = new NineSliceSprite({
      texture: Texture.from("button-large-press.png"),
      leftWidth: 36,
      topHeight: 42,
      rightWidth: 36,
      bottomHeight: 52,
      width: opts.width,
      height: opts.height,
    });

    super({
      defaultView,
      pressedView,
      anchor: 0.5,
      text: new Label({
        text: opts.text,
        style: {
          fill: 0x4a4a4a,
          align: "center",
          fontSize: opts.fontSize,
        },
      }),
      textOffset: { x: 0, y: -13 },
      defaultTextAnchor: 0.5,
      scale: 0.9,
      animations: {
        hover: {
          props: {
            scale: { x: 1.03, y: 1.03 },
          },
          duration: 100,
        },
        pressed: {
          props: {
            scale: { x: 1.03, y: 1.03 },
          },
          duration: 100,
        },
      },
    });

    this.onDown.connect(this.handleDown.bind(this));
    this.onUp.connect(this.handleUp.bind(this));
    this.onHover.connect(this.handleHover.bind(this));
  }

  private handleHover() {
    engine().sfx.play("game/sounds/sfx-hover.wav");
  }

  private handleDown() {
    engine().sfx.play("game/sounds/sfx-press.wav");
    this.textOffset = { x: 0, y: -7 };
  }

  private handleUp() {
    this.textOffset = { x: 0, y: -13 };
  }
}
