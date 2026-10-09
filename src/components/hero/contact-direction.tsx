"use client";

import { animated, Globals, useSpring } from "@react-spring/web";

import { AnimatedVarTextTag } from "@/components/animation/springs/animated-var-text-tag";
import type { ContactDirectionMotion } from "@/data/mocks/studio";
import { useDecorativeMotion } from "@/hooks/use-decorative-motion";

const DirectionPulse = animated(AnimatedVarTextTag);

export interface ContactDirectionProps {
  motion: ContactDirectionMotion;
}

export function ContactDirection({ motion }: ContactDirectionProps) {
  const { ref, motionOff, active } = useDecorativeMotion();
  const { progress } = useSpring({
    from: { progress: 0 },
    to: { progress: 1 },
    loop: () => !motionOff && !Globals.skipAnimation,
    pause: !active,
    delay: motion.pauseDuration,
    config: {
      tension: motion.tension,
      friction: motion.friction,
      mass: motion.mass,
      clamp: true,
    },
  });

  return (
    <div ref={ref} aria-hidden="true" className="flex min-w-0 flex-1 items-center text-hero-muted">
      <div className="relative h-px min-w-0 flex-1 overflow-hidden bg-hero-muted/30">
        {!motionOff && (
          <DirectionPulse
            tag="span"
            className="absolute inset-0 motion-reduce:hidden"
            style={{
              transform: progress.to((value) => `translate3d(${value * 125 - 25}%, 0, 0)`),
              opacity: progress.to([0, 0.1, 0.75, 1], [0, 0.8, 0.8, 0]),
            }}
          >
            <span className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-hero-ink to-transparent" />
          </DirectionPulse>
        )}
      </div>
      <svg viewBox="0 0 16 16" fill="none" className="-ml-2 size-4 shrink-0" focusable="false">
        <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
