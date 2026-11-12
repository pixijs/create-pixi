import Link from "@docusaurus/Link";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";

import { ArrowIcon } from "./ArrowLink";

import styles from "./Button.module.css";

/** Share of the pointer's offset from the centre that the button follows, and that its label follows on top */
const PULL = 0.25;
const LABEL_PULL = 0.1;
/** Largest pull in px */
const MAX_PULL = 10;

/** GSAP's power3.out, which pixijs.com uses as the button follows the pointer */
const FOLLOW = "translate 400ms cubic-bezier(0.215, 0.61, 0.355, 1)";

/** GSAP's elastic.out(1, 0.4), which pixijs.com uses as the button springs back */
const elasticOut = Array.from({ length: 41 }, (_, index) => {
  const progress = index / 40;

  return index === 40
    ? 1
    : 2 ** (-10 * progress) * Math.sin(((progress - 0.1) * 2 * Math.PI) / 0.4) +
        1;
});
const SETTLE = `translate 800ms linear(${elasticOut.map((value) => value.toFixed(3)).join(", ")})`;

function pull(share: number, dx: number, dy: number) {
  const clamp = (value: number) =>
    Math.max(-MAX_PULL, Math.min(MAX_PULL, value * share));

  return `${clamp(dx)}px ${clamp(dy)}px`;
}

/** Leans the button toward a mouse pointer, and springs it back when the pointer leaves */
function useMagnetic(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const button = ref.current;
    const label = button?.querySelector<HTMLElement>("[data-label]");
    const motion = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    if (!button || !label || !motion.matches) return undefined;

    let centre = { x: 0, y: 0 };

    // The centre without the current lean, so the pull doesn't feed back on itself
    const enter = () => {
      const rect = button.getBoundingClientRect();
      const [x = 0, y = 0] = getComputedStyle(button)
        .translate.split(" ")
        .map((value) => parseFloat(value) || 0);

      centre = {
        x: rect.left + rect.width / 2 - x,
        y: rect.top + rect.height / 2 - y,
      };
      button.style.transition = FOLLOW;
      label.style.transition = FOLLOW;
    };
    const move = (event: PointerEvent) => {
      const dx = event.clientX - centre.x;
      const dy = event.clientY - centre.y;

      button.style.translate = pull(PULL, dx, dy);
      label.style.translate = pull(LABEL_PULL, dx, dy);
    };
    const leave = () => {
      for (const element of [button, label]) {
        element.style.transition = SETTLE;
        element.style.translate = "";
      }
    };

    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerleave", leave);

    return () => {
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerleave", leave);
    };
  }, [ref]);
}

/**
 * pixijs.com's outline button with an arrow. The link only leans toward the pointer; the hover and press transforms
 * move its body, so the area that keeps it hovered never slides out from under the pointer.
 */
export default function Button({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useMagnetic(ref);

  return (
    <Link ref={ref} to={to} className={clsx(styles.button, className)}>
      <span className={styles.body}>
        <span className={styles.label} data-label="">
          {children}
        </span>
        <ArrowIcon className={styles.arrow} />
      </span>
    </Link>
  );
}
