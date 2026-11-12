import {
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  View3D,
} from "@pixi/3d";
import type { Application, Ticker } from "pixi.js";

/**
 * A lit, spinning cube drawn by PixiJS 3D. The view is a square `size` pixels
 * wide, centered on its position like a sprite with its anchor at 0.5.
 */
export function createSpinningCube(app: Application, size: number) {
  const view = new View3D({
    width: size,
    height: size,
    anchor: 0.5,
    // It's only decoration, so pointer events go to whatever is behind it
    eventMode: "none",
    // Soft light from the sky above and the ground below
    environment: { skyColor: 0xc9d6ff, groundColor: 0x3a2f45 },
  });

  const cube = new Mesh3D({
    geometry: new CubeGeometry(),
    material: new Material3D({ baseColor: 0xe72264 }),
  });

  // A directional light works like the sun: only its direction matters.
  // This one shines down on the cube from the upper left.
  const sun = new DirectionalLight({ intensity: 3 });

  sun.position.set(-3, 5, 2);
  sun.lookAt(cube.position);

  view.root.addChild(cube, sun);
  view.camera.position.set(0, 1.2, 2.2);
  view.camera.lookAt(cube.position);

  const spin = (ticker: Ticker) => {
    cube.rotation.y += 0.01 * ticker.deltaTime;
  };

  app.ticker.add(spin);

  // Without this, the ticker keeps the cube alive after the view is destroyed
  view.once("destroyed", () => app.ticker.remove(spin));

  return view;
}
