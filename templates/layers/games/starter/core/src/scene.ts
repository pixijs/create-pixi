import { sound } from "@pixi/sound";
import { FancyButton } from "@pixi/ui";
import gsap from "gsap";
import { GlowFilter } from "pixi-filters";
import { Container, Sprite, Text } from "pixi.js";
import type { Application } from "pixi.js";

import { createSpinningCube } from "./cube.ts";

/** How high the bunny jumps */
const JUMP_HEIGHT = 120;

/**
 * A glowing bunny in front of a spinning 3D cube, and a button that makes the
 * bunny jump, centered on screen
 */
export function createScene(app: Application) {
  const scene = new Container();

  const glow = new GlowFilter({ distance: 20, outerStrength: 1.5 });

  gsap.to(glow, {
    outerStrength: 5,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  const bunny = Sprite.from("bunny");

  bunny.anchor.set(0.5);
  bunny.scale.set(3);
  bunny.filters = [glow];

  const button = new FancyButton({
    defaultView: "button",
    text: new Text({
      text: "Jump",
      style: { fill: 0x4a4a4a, fontSize: 44, fontWeight: "bold" },
    }),
    textOffset: { y: -12 },
    anchor: 0.5,
    scale: 0.7,
    animations: {
      hover: { props: { scale: { x: 1.05, y: 1.05 } }, duration: 100 },
      pressed: { props: { scale: { x: 0.95, y: 0.95 } }, duration: 100 },
    },
  });

  button.y = 160;
  button.onPress.connect(() => {
    sound.play("sfx-press");
    jump(bunny);
  });

  scene.addChild(bunny, button);

  const bounds = scene.getLocalBounds().clone();

  // Leave room above the bunny for its jump
  bounds.minY -= JUMP_HEIGHT;
  scene.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

  // Center the scene, and shrink it to fit small screens, with a margin
  const fit = (width: number, height: number) => {
    scene.scale.set(
      Math.min(1, width / (bounds.width + 80), height / (bounds.height + 80)),
    );
    scene.position.set(width / 2, height / 2);
  };

  fit(app.screen.width, app.screen.height);
  app.renderer.on("resize", fit);

  // Added behind the bunny and the button after measuring them, so the empty
  // space around the cube doesn't change the layout
  scene.addChildAt(createSpinningCube(app, 300), 0);

  return scene;
}

function jump(bunny: Sprite) {
  if (gsap.isTweening(bunny)) return;

  gsap
    .timeline()
    .to(bunny, {
      y: -JUMP_HEIGHT,
      rotation: Math.PI * 2,
      duration: 0.4,
      ease: "power2.out",
    })
    .to(bunny, { y: 0, duration: 0.6, ease: "bounce.out" })
    .set(bunny, { rotation: 0 });
}
