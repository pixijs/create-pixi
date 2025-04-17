import type { TextOptions, TextStyleOptions } from "pixi.js";
import { Text } from "pixi.js";

const defaultLabelStyle: Partial<TextStyleOptions> = {
  fontFamily: "Arial Rounded MT Bold",
  align: "center",
};

export type LabelOptions = typeof defaultLabelStyle;

/**
 * A Text extension pre-formatted for this app, starting centred by default,
 * because it is the most common use in the app.
 */
export class Label extends Text {
  constructor(opts?: TextOptions) {
    const style = { ...defaultLabelStyle, ...opts?.style };
    super({ ...opts, style });
    // Label is always centred, but this can be changed in instance afterwards
    this.anchor.set(0.5);
  }
}
