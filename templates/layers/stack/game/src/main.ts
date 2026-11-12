// Registers PixiJS 3D, so app.init loads its WebGL or WebGPU code. Keep this
// import here even if your 3D code moves to a lazily loaded file.
import "@pixi/3d";
// Registers the asset loader for sound files
import "@pixi/sound";
import { Application, Assets } from "pixi.js";

import { assets } from "./assets.ts";
import { gameReady, initPlatform, setLoadingProgress } from "./platform.ts";
import { createScene } from "./scene.ts";

await initPlatform();

const app = new Application();

await app.init({
  background: "#1099bb",
  resizeTo: window,
  // Capped at 2: a 3x phone screen looks almost the same at 2, and the canvas
  // needs less than half the memory
  resolution: Math.min(window.devicePixelRatio, 2),
  autoDensity: true,
  antialias: true,
});

document.getElementById("pixi-container")!.appendChild(app.canvas);

await Assets.load(assets, setLoadingProgress);

app.stage.addChild(createScene(app));

gameReady(app);
