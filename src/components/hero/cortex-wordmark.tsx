"use client";

import { easings, useSpringValue } from "@react-spring/web";
import { useEffect, useState } from "react";
import { Spring } from "@/components/common/robot-spring";
import { useRobot } from "@/components/common/robot-view";
import type { WordmarkLetter } from "@/data/mocks/home";

export interface CortexWordmarkProps {
  letters: WordmarkLetter[];
  play: boolean;
  location: string;
  established: string;
}

const REVEAL_CONFIG = { duration: 1300, easing: easings.easeOutExpo };
const METADATA_CONFIG = { tension: 120, friction: 24, clamp: true };

/** The original staggered reveal, sized for the longer brand name. */
export const CortexWordmark = ({ letters, play, location, established }: CortexWordmarkProps) => {
  const robot = useRobot();
  const [metadataReady, setMetadataReady] = useState(false);
  const completion = useSpringValue(0);
  const finalLetterDelay = Math.max(0, ...letters.map((letter) => letter.delay));

  useEffect(() => {
    if (!play || robot) return;
    let cancelled = false;

    // Share the final letter's spring clock: wall-clock delays can finish early
    // when a hidden tab or a slow frame suspends the letter animation.
    void completion.start(1, {
      delay: finalLetterDelay,
      config: REVEAL_CONFIG,
      onRest: (result) => {
        if (result.finished && !cancelled) setMetadataReady(true);
      },
    });

    return () => {
      cancelled = true;
      completion.stop(true);
    };
  }, [completion, finalLetterDelay, play, robot]);

  return (
    <div
      className="relative z-10 grid justify-between overflow-hidden px-page-gutter pt-wordmark-space pb-6"
      style={{ gridTemplateColumns: `repeat(${letters.length}, auto)` }}
    >
      {letters.map((letter, index) => (
        <Spring
          key={`${letter.char}-${index}`} tag="span" aria-hidden="true" enabled={play} mode="once"
          from={{ opacity: 0, y: "96px", filter: "blur(20px)" }}
          to={{ opacity: 1, y: "0px", filter: "blur(0px)" }}
          delayIn={letter.delay} config={REVEAL_CONFIG}
          className="cortex-clip-text cortex-letter-a pointer-events-none -mr-glyph-bleed block pr-glyph-bleed font-display text-wordmark font-black leading-none tracking-normal"
        >
          {letter.char}
        </Spring>
      ))}
      <Spring
        tag="p" enabled={metadataReady} mode="once"
        from={{ opacity: 0 }} to={{ opacity: 1 }} config={METADATA_CONFIG}
        className="relative -top-wordmark-meta-lift col-start-1 -col-end-2 mt-2 flex flex-wrap justify-end gap-x-6 gap-y-1 pr-wordmark-edge text-right font-sans text-label text-hero-muted"
      >
        <span>{location}</span>
        <span>{established}</span>
      </Spring>
    </div>
  );
};
