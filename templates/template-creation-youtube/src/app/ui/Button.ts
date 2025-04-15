import { FancyButton } from "@pixi/ui";

import { engine } from "../getEngine";

import { Label } from "./Label";

const defaultButtonOptions = {
  text: "",
  width: 301,
  height: 112,
  fontSize: 28,
};

type ButtonOptions = typeof defaultButtonOptions;

/**
 * The big rectangle button, with a label, idle and pressed states
 */
export class Button extends FancyButton {
  constructor(options: Partial<ButtonOptions> = {}) {
    const opts = { ...defaultButtonOptions, ...options };

    super({
      defaultView: "button.png",
      nineSliceSprite: [38, 50, 38, 50],
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
            y: 0,
          },
          duration: 100,
        },
        pressed: {
          props: {
            scale: { x: 0.97, y: 0.97 },
            y: 10,
          },
          duration: 100,
        },
      },
    });

    this.width = opts.width;
    this.height = opts.height;

    this.onDown.connect(this.handleDown.bind(this));
    this.onHover.connect(this.handleHover.bind(this));
  }

  private handleHover() {
    engine().audio.sfx.play("main/sounds/sfx-hover.wav");
  }

  private handleDown() {
    engine().audio.sfx.play("main/sounds/sfx-press.wav");
  }
}
