"use client";

import { easings } from "@react-spring/web";
import { Spring } from "@/components/common/robot-spring";
import type { WordmarkLetter } from "@/data/mocks/home";

export interface CortexWordmarkProps {
  letters: WordmarkLetter[];
  play: boolean;
  location: string;
  established: string;
}

const REVEAL_CONFIG = { duration: 1300, easing: easings.easeOutExpo };

/** The original staggered reveal, sized for the longer brand name. */
export const CortexWordmark = ({ letters, play, location, established }: CortexWordmarkProps) => (
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
    <p className="relative -top-wordmark-meta-lift col-start-1 -col-end-2 mt-2 flex flex-wrap justify-end gap-x-6 gap-y-1 pr-wordmark-edge text-right font-sans text-label text-hero-muted">
      <span>{location}</span>
      <span>{established}</span>
    </p>
  </div>
);
