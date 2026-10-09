"use client";

/**
 * Shared hero primitives used by both the desktop and mobile layouts:
 * the logo lockup, the staggered nav-item reveal, and the entrance easing.
 */

import { easings } from "@react-spring/web";
import { useEffect, useState, type ReactNode } from "react";
import { Spring } from "@/components/common/robot-spring";
import Link from "next/link";

export const EASE_OUT = easings.easeOutExpo;

/** The source site's block wordmark, carried through to the masthead. */
export const HeroLogo = ({ brand }: { brand: string }) => (
  <Link
    href="/"
    aria-label={`${brand} — home`}
    className="pointer-events-auto font-display text-logo font-black leading-none tracking-tight"
  >
    {brand}
  </Link>
);

// The sweep's mask (top → bottom, following the drop): a ramp one box tall
// above the element (all hidden) at the start, past its bottom (all shown) at
// rest — the same gradient both ends, so the spring interpolates it.
const SWEEP_FROM =
  "linear-gradient(rgb(0, 0, 0) -100%, rgba(0, 0, 0, 0) 0%)";
const SWEEP_TO =
  "linear-gradient(rgb(0, 0, 0) 100%, rgba(0, 0, 0, 0) 200%)";

/**
 * Header item that settles down from above, staggered by `delay`.
 *
 * `sweep`: the fade drawn as a soft mask sweep instead of `opacity`, so the
 * item is fully opaque on every frame — for the filled "touch" CTA, whose dark
 * label on white read 1.1–1.8:1 to a contrast check sampling it half-faded
 * (axe-sweep, desktop).
 */
const NAV_REVEAL_MS = 700;

// Relative top preserves the short drop without react-spring's transform
// whitespace differing from the browser's CSSOM during hydration.

export const NavReveal = ({
  play,
  delay,
  sweep = false,
  children,
}: {
  play: boolean;
  delay: number;
  sweep?: boolean;
  children: ReactNode;
}) => {
  // The sweep's mask is dropped once the entrance has finished: a mask left on
  // at rest keeps the element a masked layer over the always-animating scene
  // for the whole visit (the Fix Catalog's rule: "removed at rest").
  const [rested, setRested] = useState(false);
  useEffect(() => {
    if (!sweep || !play) return;
    const id = window.setTimeout(() => setRested(true), delay + NAV_REVEAL_MS + 50);
    return () => window.clearTimeout(id);
  }, [sweep, play, delay]);
  return (
    <Spring
      tag="div"
      enabled={play}
      mode="once"
      from={sweep ? { maskImage: SWEEP_FROM, top: "-10px" } : { opacity: 0, top: "-10px" }}
      to={sweep ? { maskImage: SWEEP_TO, top: "0px" } : { opacity: 1, top: "0px" }}
      delayIn={delay}
      config={{ duration: NAV_REVEAL_MS, easing: EASE_OUT }}
      className="relative"
      style={rested ? { maskImage: "none" } : undefined}
    >
      {children}
    </Spring>
  );
};
