"use client";

/**
 * Cortex hero — the client coordinator for route `/`.
 *
 * Owns the single piece of shared state (`played`): the preloader flips it as
 * its curtain lifts, which cues the wordmark and content entrances together.
 * The WebGL background and bottom scrim sit underneath, unaffected. Content
 * arrives as props from the server view — nothing hardcoded here.
 */

import { useCallback, useState } from "react";
import type { HomeContent } from "@/data/mocks/home";
import { useInitialDocumentEntry } from "@/hooks/use-initial-document-entry";
import { CortexWordmark } from "./cortex-wordmark";
import { HeroContent } from "./hero-content";
import { Preloader } from "./preloader";
import { PrismStreaks } from "./prism-streaks";

export interface CortexHeroProps {
  content: HomeContent;
  /** The robot form (D-016): no curtain, no decorative WebGL, played from the start. */
  robot?: boolean;
}

export const CortexHero = ({ content, robot = false }: CortexHeroProps) => {
  const initialDocumentEntry = useInitialDocumentEntry();
  const showIntro = initialDocumentEntry && !robot;
  const [played, setPlayed] = useState(!showIntro);
  const revealHero = useCallback(() => setPlayed(true), []);

  return (
    <section aria-label={content.brand} className="relative isolate flex min-h-hero flex-col overflow-hidden bg-hero-bg">
      {robot ? null : (
        <PrismStreaks
          config={content.prism}
          className="absolute inset-0 block size-full"
        />
      )}

      {/* bottom scene-tint gradient, pinned to the viewport bottom */}
      <div
        aria-hidden="true"
        className="cortex-scrim pointer-events-none absolute inset-0"
      />

      <HeroContent content={content} play={played} />
      <CortexWordmark letters={content.wordmark} play={played} location={content.location} established={content.established} />
      {showIntro ? <Preloader content={content.preloader} onReveal={revealHero} /> : null}
    </section>
  );
};
