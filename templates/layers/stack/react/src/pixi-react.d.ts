import type { View3D } from "@pixi/3d";
import type { PixiReactElementProps } from "@pixi/react";

// Classes from pixi.js are typed already. Add a line here for each other class
// you pass to extend.
declare module "@pixi/react" {
  interface PixiElements {
    pixiView3D: PixiReactElementProps<typeof View3D>;
  }
}
