import {
  CubeGeometry,
  DirectionalLight,
  Material3D,
  Mesh3D,
  View3D,
} from "@pixi/3d";
import { Application, Assets, Sprite } from "pixi.js";

const app = new Application();

await app.init({ background: "#1099bb", resizeTo: window, antialias: true });
document.getElementById("pixi-container")!.appendChild(app.canvas);

// A View3D draws a 3D scene. autoResize makes it fill the screen.
const view = new View3D({
  autoResize: true,
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
view.camera.position.set(0, 1.6, 3);
view.camera.lookAt(cube.position);

const texture = await Assets.load("assets/bunny.png");
const bunny = new Sprite(texture);

bunny.anchor.set(0.5);

// Center the bunny, and keep it centered when the window resizes
bunny.position.set(app.screen.width / 2, app.screen.height / 2);
app.renderer.on("resize", (width, height) => {
  bunny.position.set(width / 2, height / 2);
});

// The bunny is added after the view, so it draws in front of the cube
app.stage.addChild(view, bunny);

// deltaTime keeps the speed the same at any frame rate
app.ticker.add((time) => {
  cube.rotation.y += 0.01 * time.deltaTime;
  bunny.rotation += 0.1 * time.deltaTime;
});
