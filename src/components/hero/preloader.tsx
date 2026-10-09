"use client";

import { animated, easings, Globals, useSpringValue } from "@react-spring/web";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { AnimatedVarTextTag } from "@/components/animation/springs/animated-var-text-tag";
import type { PreloaderContent } from "@/data/mocks/home";

const LoaderLayer = animated(AnimatedVarTextTag);
type LoaderPhase = "loading" | "exiting" | "hidden";

export interface PreloaderProps {
  content: PreloaderContent;
  /** Fired once, as the curtain starts lifting — cue the hero entrance. */
  onReveal: () => void;
}

/** A progress mask fills the stationary brand letters, then lifts the curtain. */
export const Preloader = ({ content, onReveal }: PreloaderProps) => {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const phaseRef = useRef<LoaderPhase>("loading");
  // Imperative values cannot replay an initial target when exit causes a render.
  const progress = useSpringValue(0);
  const lift = useSpringValue(0);
  const notifyReveal = useEffectEvent(onReveal);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      if (cancelled) return;
      phaseRef.current = "hidden";
      setPhase("hidden");
    };

    const reveal = () => {
      if (cancelled || phaseRef.current === "hidden") return;
      clearTimeout(holdTimer);
      progress.stop(true);
      progress.set(100);
      if (phaseRef.current === "loading") {
        phaseRef.current = "exiting";
        setPhase("exiting");
        notifyReveal();
      }
      if (preference.matches || Globals.skipAnimation) {
        lift.set(100);
        finish();
        return;
      }
      void lift.start(100, {
        config: { duration: content.exitDuration, easing: easings.easeInOutQuart },
        onRest: (result) => { if (result.finished) finish(); },
      });
    };

    const complete = () => {
      if (cancelled || phaseRef.current !== "loading") return;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(reveal, preference.matches ? 0 : content.holdDuration);
    };

    const onMotionChange = () => {
      if (preference.matches) reveal();
    };
    preference.addEventListener("change", onMotionChange);

    // Effect replay resumes the current phase instead of resetting either value.
    if (preference.matches || Globals.skipAnimation || phaseRef.current === "exiting") {
      reveal();
    } else if (phaseRef.current === "loading") {
      if (progress.get() >= 100) {
        complete();
      } else {
        void progress.start(100, {
          config: { duration: content.duration, easing: easings.easeInOutCubic },
          onRest: (result) => { if (result.finished) complete(); },
        });
      }
    }

    // A cancelled spring must never strand the page behind the curtain.
    const safetyTimer = setTimeout(reveal, content.duration + content.holdDuration + 2000);
    const dismissTimer = setTimeout(() => {
      reveal();
      finish();
    }, content.duration + content.holdDuration + content.exitDuration + 3000);

    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      clearTimeout(safetyTimer);
      clearTimeout(dismissTimer);
      preference.removeEventListener("change", onMotionChange);
      progress.stop(true);
      lift.stop(true);
    };
  }, [content.duration, content.holdDuration, content.exitDuration, progress, lift]);

  if (phase === "hidden") return null;
  const exiting = phase === "exiting";

  return (
    <div className={`fixed inset-0 z-preloader overflow-hidden ${exiting ? "pointer-events-none" : ""}`} aria-hidden={exiting}>
      <LoaderLayer tag="div" style={{ transform: lift.to((value) => `translateY(${-value}%)`) }} className="relative flex size-full items-center justify-center bg-preloader-bg px-page-gutter font-display">
        <div role="status" aria-live="polite" className="sr-only">{content.loadingLabel}</div>
        <div aria-hidden="true" className="relative whitespace-nowrap text-preloader-wordmark font-black leading-none tracking-tight">
          <span className="text-brand/20">{content.wordmark}</span>
          <LoaderLayer
            tag="span"
            className="absolute inset-0 text-brand"
            style={{ clipPath: progress.to((value) => `inset(0 ${100 - value}% 0 0)`) }}
          >
            {content.wordmark}
          </LoaderLayer>
        </div>
        {/* Reserve the final counter width to preserve the no-layout-shift invariant. */}
        <div aria-hidden="true" className="absolute right-page-gutter bottom-8 text-right text-service-title font-black leading-none text-brand">
          <span className="invisible">100%</span>
          <span className="absolute inset-0">
            <LoaderLayer tag="span">{progress.to((value) => Math.round(value))}</LoaderLayer>%
          </span>
        </div>
      </LoaderLayer>
    </div>
  );
};
