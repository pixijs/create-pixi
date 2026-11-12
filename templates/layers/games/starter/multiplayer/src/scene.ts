import { Callbacks } from "@colyseus/sdk";
import { sound } from "@pixi/sound";
import { FancyButton } from "@pixi/ui";
import gsap from "gsap";
import { GlowFilter } from "pixi-filters";
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
import type { Application } from "pixi.js";

import { WORLD_HEIGHT, WORLD_WIDTH } from "../server/world.ts";
import { joinGame } from "./connect.ts";
import { createSpinningCube } from "./cube.ts";

/** How fast bunnies walk, in world units per second */
const SPEED = 400;

/**
 * A floor shared by everyone in the room, with a bunny for each player.
 * Click or tap the floor to move yours, and press Jump to make it jump. A 3D
 * cube spins in the middle of the floor.
 */
export function createScene(app: Application) {
  const scene = new Container();

  // Larger than the world, so bunnies at its edges still stand on the floor
  const area = new Rectangle(0, 0, WORLD_WIDTH, WORLD_HEIGHT).pad(40);

  const world = new Container({
    eventMode: "static",
    cursor: "pointer",
    hitArea: area,
  });

  const floor = new Graphics()
    .roundRect(area.x, area.y, area.width, area.height, 24)
    .fill({ color: 0xffffff, alpha: 0.2 });

  const status = new Text({
    text: "Connecting...",
    style: { fill: 0xffffff, fontSize: 32 },
    anchor: 0.5,
    position: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
  });

  const cube = createSpinningCube(app, 300);

  cube.position.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  world.addChild(floor, cube, status);

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

  button.position.set(WORLD_WIDTH / 2, WORLD_HEIGHT + 110);

  scene.addChild(world, button);

  const bounds = scene.getLocalBounds().clone();

  scene.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);

  // Scale the floor and the button to fit the screen, with a margin
  const fit = (width: number, height: number) => {
    scene.scale.set(
      Math.min(width / (bounds.width + 80), height / (bounds.height + 80)),
    );
    scene.position.set(width / 2, height / 2);
  };

  fit(app.screen.width, app.screen.height);
  app.renderer.on("resize", fit);

  join().catch((error: Error) => {
    console.error(error);
    status.text = error.message;
  });

  async function join() {
    const room = await joinGame();
    const callbacks = Callbacks.get(room);
    const players = new Map<string, Container>();

    status.text = "";

    callbacks.onAdd("players", (player, sessionId) => {
      const view = createPlayer(sessionId === room.sessionId, player.name);

      view.position.set(player.x, player.y);
      players.set(sessionId, view);
      world.addChild(view);

      const stopWalking = callbacks.onChange(player, () =>
        walk(view, player.x, player.y),
      );

      // Without this, a dev server reload can try to move a removed bunny
      view.once("destroyed", stopWalking);
    });

    const removePlayer = (sessionId: string) => {
      const view = players.get(sessionId)!;

      players.delete(sessionId);
      gsap.killTweensOf([view, ...view.children]);
      view.destroy({ children: true });
    };

    callbacks.onRemove("players", (_player, sessionId) =>
      removePlayer(sessionId),
    );

    room.onMessage("jump", (sessionId: string) => {
      const view = players.get(sessionId);

      if (view) jump(view.children[0]);
    });

    // The SDK tries to reconnect, but the room only keeps a dropped player's
    // seat when the dev server reloads, so other drops end in onLeave
    room.onDrop(() => (status.text = "Reconnecting..."));
    room.onReconnect(() => (status.text = ""));
    room.onLeave(() => {
      status.text = "Disconnected";
      players.forEach((_view, sessionId) => removePlayer(sessionId));
    });

    world.on("pointertap", (event) => {
      const { x, y } = world.toLocal(event.global);

      room.send("move", { x, y });
    });

    button.onPress.connect(() => {
      sound.play("sfx-press");
      room.send("jump");
    });
  }

  return scene;
}

/** Walking moves the container, so the bunny inside can jump while it walks */
function createPlayer(isYou: boolean, name: string) {
  const bunny = Sprite.from("bunny");

  bunny.anchor.set(0.5);
  bunny.scale.set(2);

  if (isYou) {
    bunny.filters = [new GlowFilter({ distance: 20, outerStrength: 3 })];
  }

  const label = new Text({
    text: name,
    style: { fill: 0xffffff, fontSize: 20 },
    anchor: { x: 0.5, y: 1 },
    y: -bunny.height / 2 - 4,
  });

  return new Container({ children: [bunny, label] });
}

function walk(view: Container, x: number, y: number) {
  gsap.to(view, {
    x,
    y,
    duration: Math.hypot(x - view.x, y - view.y) / SPEED,
    ease: "none",
    overwrite: true,
  });
}

function jump(bunny: Container) {
  if (gsap.isTweening(bunny)) return;

  gsap
    .timeline()
    .to(bunny, {
      y: -80,
      rotation: Math.PI * 2,
      duration: 0.4,
      ease: "power2.out",
    })
    .to(bunny, { y: 0, duration: 0.6, ease: "bounce.out" })
    .set(bunny, { rotation: 0 });
}
