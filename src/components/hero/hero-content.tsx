"use client";

import Link from "next/link";
import { Spring } from "@/components/common/robot-spring";
import type { HomeContent } from "@/data/mocks/home";
import { EASE_OUT, HeroLogo, NavReveal } from "./hero-shared";

export interface HeroContentProps {
  content: HomeContent;
  play: boolean;
}

export const HeroContent = ({ content, play }: HeroContentProps) => {
  return (
    <div className="relative z-10 flex flex-1 flex-col px-page-gutter text-hero-ink">
      <header className="flex items-center justify-between gap-6 py-6">
        <NavReveal play={play} delay={100}>
          <HeroLogo brand={content.brand} />
        </NavReveal>
        <nav aria-label="Primary" className="ml-auto flex items-center font-display text-nav font-black uppercase tracking-tight">
          {content.navigation.map((link, index) => (
            <NavReveal key={link.href} play={play} delay={180 + index * 60}>
              <Link href={link.href} className="inline-block py-3 hover:text-hero-muted">{link.label}</Link>
            </NavReveal>
          ))}
        </nav>
      </header>
      <div className="my-auto grid gap-10 py-hero-space md:grid-cols-12 md:items-end">
        <Spring
          tag="div" enabled={play} mode="once"
          from={{ opacity: 0, y: "18px", filter: "blur(8px)" }}
          to={{ opacity: 1, y: "0px", filter: "blur(0px)" }}
          delayIn={300} config={{ duration: 1100, easing: EASE_OUT }}
          className="md:col-span-7"
        >
          <h1 className="whitespace-pre-line font-display text-hero-title font-black uppercase leading-tight tracking-tight">{content.lead}</h1>
        </Spring>
      </div>
    </div>
  );
};
