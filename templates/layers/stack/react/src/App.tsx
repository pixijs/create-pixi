import {
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  View3D,
} from "@pixi/3d";
import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";

// extend tells @pixi/react which PixiJS classes it can render as <pixi* /> elements
extend({ Sprite, View3D });

// Soft light from the sky above and the ground below
const environment = { skyColor: 0xc9d6ff, groundColor: 0x3a2f45 };

/** A lit cube that spins behind the bunny, drawn by PixiJS 3D */
const SpinningCube = () => {
  const viewRef = useRef<View3D>(null);
  const cubeRef = useRef<Mesh3D>(null);

  // The 3D scene isn't JSX: the effect builds it and adds it to the view's root
  useEffect(() => {
    const view = viewRef.current!;
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
    view.camera.position.set(0, 1.6, 3);
    view.camera.lookAt(cube.position);
    cubeRef.current = cube;

    // Undo all this on unmount, and before a hot reload runs it again.
    // destroy also takes each one out of the view.
    return () => {
      cubeRef.current = null;
      cube.destroy({ geometry: true, material: true });
      sun.destroy();
    };
  }, []);

  useTick((ticker) => {
    const cube = cubeRef.current;
    if (!cube) return;

    cube.rotation.y += 0.01 * ticker.deltaTime;
  });

  // autoResize makes the view fill the screen
  return <pixiView3D ref={viewRef} autoResize environment={environment} />;
};

const BunnySprite = () => {
  const { app } = useApplication();
  const spriteRef = useRef<Sprite>(null);
  const [texture, setTexture] = useState(Texture.EMPTY);

  useEffect(() => {
    Assets.load<Texture>("assets/bunny.png").then(setTexture);
  }, []);

  useTick((ticker) => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    // Keep the bunny centered, even after the window resizes
    sprite.position.set(app.screen.width / 2, app.screen.height / 2);

    // deltaTime keeps the speed the same at any frame rate
    sprite.rotation += 0.1 * ticker.deltaTime;
  });

  return <pixiSprite ref={spriteRef} texture={texture} anchor={0.5} />;
};

export default function App() {
  return (
    <Application background="#1099bb" resizeTo={window} antialias>
      <SpinningCube />
      <BunnySprite />
    </Application>
  );
}
