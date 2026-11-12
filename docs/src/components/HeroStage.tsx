import bunnyUrl from "@templates/layers/stack/assets/public/assets/bunny.png";
import clsx from "clsx";
import type { Sprite, Texture, Ticker } from "pixi.js";
import { useEffect, useRef, useState } from "react";

import styles from "./HeroStage.module.css";

const firstBatch = 24;
const batch = 12;
const maxBunnies = 480;
const gravity = 0.5;

interface Bunny {
  sprite: Sprite;
  vx: number;
  vy: number;
}

type AddBunnies = (x?: number, y?: number) => void;

/**
 * A small bunnymark: the bunny from the bundler templates, bouncing on a
 * transparent PixiJS canvas. PixiJS loads after the page is idle, so it never
 * delays first paint. With reduced motion the bunnies stay still.
 */
export default function HeroStage({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<AddBunnies | null>(null);
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let destroyed = false;
    let teardown = () => {};

    const start = async () => {
      const { Application, Assets, Sprite } = await import("pixi.js");
      if (destroyed) return;

      const app = new Application();

      // Clicks reach the stage through a DOM listener, so skip the PixiJS
      // event system, which would block touch scrolling over the canvas
      await app.init({
        backgroundAlpha: 0,
        width: host.clientWidth,
        height: host.clientHeight,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        preference: "webgl",
        autoStart: false,
        skipExtensionImports: true,
        roundPixels: true,
      });

      teardown = () => app.destroy(true, { children: true });
      if (destroyed) {
        teardown();
        return;
      }

      const texture = await Assets.load<Texture>(bunnyUrl);

      // The bunny is pixel art, so keep its edges sharp when scaled up
      texture.source.scaleMode = "nearest";

      if (destroyed) return;

      app.canvas.setAttribute("aria-hidden", "true");
      host.appendChild(app.canvas);
      setReady(true);

      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const bunnies: Bunny[] = [];
      let visible = true;

      const add: AddBunnies = (x, y) => {
        const { width, height } = app.screen;
        const amount = Math.min(
          bunnies.length ? batch : firstBatch,
          maxBunnies - bunnies.length,
        );
        const fromPointer = x !== undefined && y !== undefined;

        for (let i = 0; i < amount; i++) {
          const sprite = new Sprite(texture);

          sprite.anchor.set(0.5, 1);
          // Whole-number scaling keeps every pixel of the art the same size
          sprite.scale.set(2);

          if (motion.matches) {
            sprite.position.set(
              28 + Math.random() * (width - 56),
              sprite.height + Math.random() * (height - sprite.height),
            );
          } else {
            sprite.position.set(fromPointer ? x : 24, fromPointer ? y : 40);
          }

          app.stage.addChild(sprite);
          bunnies.push({
            sprite,
            vx: fromPointer ? Math.random() * 12 - 6 : 1 + Math.random() * 8,
            vy: Math.random() * -6,
          });
        }

        setCount(bunnies.length);
        if (!app.ticker.started) app.render();
      };

      const update = (ticker: Ticker) => {
        const dt = Math.min(ticker.deltaTime, 2);
        const { width, height } = app.screen;

        for (const bunny of bunnies) {
          const { sprite } = bunny;
          // Keep the whole bunny on the canvas. Its anchor is at its feet.
          const halfWidth = sprite.width / 2;

          sprite.x += bunny.vx * dt;
          sprite.y += bunny.vy * dt;
          bunny.vy += gravity * dt;

          if (sprite.x > width - halfWidth) {
            bunny.vx *= -1;
            sprite.x = width - halfWidth;
          } else if (sprite.x < halfWidth) {
            bunny.vx *= -1;
            sprite.x = halfWidth;
          }

          if (sprite.y > height) {
            bunny.vy *= -0.85;
            sprite.y = height;
            if (Math.random() > 0.5) bunny.vy -= Math.random() * 6;
          } else if (sprite.y < sprite.height) {
            bunny.vy = 0;
            sprite.y = sprite.height;
          }
        }
      };

      const sync = () => {
        setStill(motion.matches);
        if (visible && !motion.matches) {
          app.ticker.start();
        } else {
          app.ticker.stop();
          app.render();
        }
      };

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });

      // The stage's size follows the page layout, not only the window
      const resizer = new ResizeObserver(() => {
        const { clientWidth, clientHeight } = host;

        if (
          clientWidth === app.screen.width &&
          clientHeight === app.screen.height
        ) {
          return;
        }

        app.renderer.resize(clientWidth, clientHeight);

        // Bunnies that were standing below the new floor or past the new wall move inside
        for (const { sprite } of bunnies) {
          sprite.x = Math.min(sprite.x, clientWidth - sprite.width / 2);
          sprite.y = Math.min(sprite.y, clientHeight);
        }

        if (!app.ticker.started) app.render();
      });

      // A click, not pointerdown, so a swipe that starts on the stage only scrolls
      const onClick = (event: MouseEvent) => {
        const bounds = host.getBoundingClientRect();
        add(event.clientX - bounds.left, event.clientY - bounds.top);
      };

      app.ticker.add(update);
      observer.observe(host);
      resizer.observe(host);
      motion.addEventListener("change", sync);
      host.addEventListener("click", onClick);
      addRef.current = add;
      teardown = () => {
        addRef.current = null;
        observer.disconnect();
        resizer.disconnect();
        motion.removeEventListener("change", sync);
        host.removeEventListener("click", onClick);
        app.destroy(true, { children: true });
      };
      sync();
      add();
    };

    const run = () =>
      start().catch((error: unknown) => {
        console.error(error);
        if (destroyed) return;
        teardown();
        teardown = () => {};
        setFailed(true);
      });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(run, { timeout: 1500 })
      : window.setTimeout(run, 300);

    return () => {
      destroyed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      teardown();
    };
  }, []);

  const full = count >= maxBunnies;
  const hint = full ? null : (
    <>
      {" "}
      <span className={clsx(styles.sentence, styles.hint)}>
        <span className={styles.mouse}>Click</span>
        <span className={styles.touch}>Tap</span> the stage to add more.
      </span>
    </>
  );

  return (
    <figure className={clsx(styles.figure, className)}>
      <div ref={hostRef} className={styles.stage}>
        {(!ready || failed) && (
          <img
            className={styles.still}
            src={bunnyUrl}
            alt=""
            width={52}
            height={74}
          />
        )}
      </div>
      <figcaption className={styles.caption}>
        <span>
          {failed && (
            <>
              This browser couldn&apos;t start WebGL, so this bunny is a still
              image.
            </>
          )}
          {!failed && !ready && "Loading PixiJS."}
          {!failed && ready && (
            <>
              <span className={styles.sentence}>
                {count} bunnies, rendered live with PixiJS.
              </span>
              {hint}
            </>
          )}
          {still && !failed && " Motion is off to match your system setting."}
        </span>
        {!failed && (
          <button
            type="button"
            className={styles.add}
            onClick={() => addRef.current?.()}
            disabled={!count || full}
          >
            {full ? "That's plenty" : "Add bunnies"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
