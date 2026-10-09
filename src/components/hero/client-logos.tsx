"use client";

import { animated, easings, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

import { AnimatedVarTextTag } from "@/components/animation/springs/animated-var-text-tag";
import { useRobot } from "@/components/common/robot-view";
import type { ClientLogo, ClientLogosContent } from "@/data/mocks/clients";

// Consume the engine's semantic animated primitive without changing its API.
const LogoTrack = animated(AnimatedVarTextTag);
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const reducedMotionSnapshot = () => window.matchMedia(motionQuery).matches;
const serverMotionSnapshot = () => false;

export interface ClientLogosProps {
  content: ClientLogosContent;
}

interface LogoListProps {
  companies: ClientLogo[];
  duplicate?: boolean;
  stationary?: boolean;
}

const logoWidths: Record<ClientLogo["format"], { className: string; token: string }> = {
  wide: { className: "max-w-client-wide", token: "var(--spacing-client-wide)" },
  compact: { className: "max-w-client-compact", token: "var(--spacing-client-compact)" },
  square: { className: "max-w-client-square", token: "var(--spacing-client-square)" },
};

/** Crop transparent padding in the mask, keeping each mark's previous optical scale. */
const logoMaskStyle = ({ src, format, source, ink }: ClientLogo): CSSProperties => ({
  width: `min(calc(${logoWidths[format].token} * ${ink.width / source.width}), calc(var(--spacing-client-mark-height) * ${ink.width / source.height}))`,
  aspectRatio: `${ink.width} / ${ink.height}`,
  maskImage: `url("${src}")`,
  maskSize: `${source.width / ink.width * 100}% ${source.height / ink.height * 100}%`,
  maskPosition: `${source.width === ink.width ? 0 : ink.x / (source.width - ink.width) * 100}% ${source.height === ink.height ? 0 : ink.y / (source.height - ink.height) * 100}%`,
});

const LogoList = ({ companies, duplicate = false, stationary = false }: LogoListProps) => (
  <ul
    className={`client-logo-list flex flex-none items-center gap-client-gap motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-page-gutter ${stationary ? "w-full flex-wrap justify-center px-page-gutter" : "pr-client-gap"} ${duplicate ? "motion-reduce:hidden" : ""}`}
    aria-hidden={duplicate || undefined}
  >
    {companies.map((company) => (
      <li key={company.name} className="flex h-client-height flex-none items-center justify-center">
        <span className="sr-only">{company.name}</span>
        <span
          aria-hidden="true"
          className={`client-logo-mark block max-h-client-mark-height bg-hero-ink mask-no-repeat ${logoWidths[company.format].className}`}
          style={logoMaskStyle(company)}
        />
      </li>
    ))}
  </ul>
);

/** Vexon's single-row ticker, adapted to real logos and the site's spring engine. */
export const ClientLogos = ({ content }: ClientLogosProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const robot = useRobot();
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion, reducedMotionSnapshot, serverMotionSnapshot,
  );
  const motionOff = robot || reducedMotion;
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (motionOff || !sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(sectionRef.current);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionOff]);

  const spring = useSpring({
    from: { transform: "translate3d(0%, 0, 0)" },
    to: { transform: "translate3d(-50%, 0, 0)" },
    loop: !motionOff,
    pause: motionOff || !inView || !tabVisible || paused || hovered || focused,
    config: { duration: content.cycleDuration, easing: easings.linear },
  });

  return (
    <section
      id="companies"
      ref={sectionRef}
      aria-labelledby="companies-title"
      className="py-8 text-hero-ink"
    >
      <div className="mx-auto max-w-site-width">
        <div className="mb-8 flex min-h-11 items-center justify-between gap-6 px-page-gutter">
          <h2 id="companies-title" className="text-label uppercase tracking-widest text-hero-muted">
            {content.title}
          </h2>
          {!motionOff && (
            <button
              type="button"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-hero-muted hover:text-hero-ink motion-reduce:hidden"
              aria-label={paused ? content.resumeLabel : content.pauseLabel}
              onClick={() => setPaused((value) => !value)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
                {paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M6 5h4v14H6zm8 0h4v14h-4z" />}
              </svg>
            </button>
          )}
        </div>
        <div
          className={`client-logo-window overflow-hidden motion-reduce:mask-none ${motionOff ? "" : "mask-client-edges"}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
        >
          {motionOff ? (
            <div className="client-logo-track flex w-full">
              <LogoList companies={content.companies} stationary />
            </div>
          ) : (
            <LogoTrack tag="div" className="client-logo-track flex w-max motion-reduce:w-full motion-reduce:transform-none!" style={spring}>
              <LogoList companies={content.companies} />
              <LogoList companies={content.companies} duplicate />
            </LogoTrack>
          )}
        </div>
      </div>
    </section>
  );
};
