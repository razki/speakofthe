"use client";

/**
 * Full-screen mobile menu (< lg) — opened by the hero's burger.
 *
 * The panel drops over the whole screen like the preloader's curtain played
 * backwards: a brand-blue sheet leads, the black scene ground follows it down,
 * then the links rise out of line masks one after another in large extralight
 * display type (the wordmark's face). The burger's three lines morph into the
 * close cross with the same spring. Closing runs the film backwards, faster.
 *
 * Every motion is `@react-spring/web` (hard rule #1 — no CSS transitions). The
 * links never fade — they slide out of an `overflow: hidden` mask — so their
 * contrast holds on every frame. Reduced motion: `ReducedMotion` turns on
 * react-spring's `skipAnimation`, so the panel simply appears.
 *
 * Portalled to `<body>`: the hero lives inside a `position: fixed` `<main>`,
 * which is its own stacking context below the consent banner — the menu must
 * cover both. Behaviour: Escape closes, focus moves to the first link and
 * returns to the burger, Tab stays inside, `main` is `inert`, scrolling is
 * stopped through the scroll store, and a link click closes the panel first.
 */

import {
  animated,
  easings,
  useSpring,
  useSprings,
  type SpringValue,
} from "@react-spring/web";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import type { CortexCta, NavLink } from "@/data/mocks/home";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";

import { HeroLogo } from "./hero-shared";

/** The curtain: the preloader's lift easing, slightly quicker. */
const OPEN_CONFIG = { duration: 820, easing: easings.easeInOutQuart };
const CLOSE_CONFIG = { duration: 520, easing: easings.easeInOutQuart };
/** Each row's rise out of its mask. */
const ROW_CONFIG = { duration: 900, easing: easings.easeOutExpo };
const ROW_EXIT_CONFIG = { duration: 260, easing: easings.easeInCubic };
/** Rows wait for the black sheet to pass them. */
const ROW_LEAD_MS = 360;
const ROW_STAGGER_MS = 60;
/** How far the blue sheet runs ahead of the black one (fraction of travel). */
const SHEET_LEAD = 0.22;

export interface MobileMenuProps {
  open: boolean;
  onClose: (returnFocus: boolean) => void;
  brand: string;
  links: readonly NavLink[];
  cta: CortexCta;
  /** The burger, so focus can return to it. */
  toggleRef: RefObject<HTMLButtonElement | null>;
}

export const MobileMenu = ({
  open,
  onClose,
  brand,
  links,
  cta,
  toggleRef,
}: MobileMenuProps) => {
  // Mounted while open or while the exit is still playing.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const pendingAnchor = useRef<string | null>(null);

  const { reveal } = useSpring({
    reveal: open ? 1 : 0,
    from: { reveal: 0 },
    config: open ? OPEN_CONFIG : CLOSE_CONFIG,
    onRest: (result) => {
      if (result.value.reveal === 0) {
        setMounted(false);
        if (returnFocus.current) toggleRef.current?.focus({ preventScroll: true });
        returnFocus.current = false;
        if (pendingAnchor.current) {
          const target = document.getElementById(pendingAnchor.current);
          pendingAnchor.current = null;
          if (target) {
            target.scrollIntoView({ behavior: "instant", block: "start" });
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        }
      }
    },
  });

  // Links, then the CTA row.
  const rowCount = links.length + 1;
  const [rows] = useSprings(
    rowCount,
    (index) => ({
      from: { y: 110 },
      to: { y: open ? 0 : 110 },
      delay: open ? ROW_LEAD_MS + index * ROW_STAGGER_MS : 0,
      config: open ? ROW_CONFIG : ROW_EXIT_CONFIG,
    }),
    [open],
  );

  const close = (withFocus: boolean) => {
    returnFocus.current = withFocus;
    onClose(withFocus);
  };

  useEffect(() => {
    if (!open) return;
    const { stop, start } = useScroll.getState();
    stop();
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => { if (desktop.matches) onClose(false); };
    desktop.addEventListener("change", onDesktop);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnFocus.current = true;
        onClose(true);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = [...panel.querySelectorAll<HTMLElement>("a[href], button")];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    panelRef.current
      ?.querySelector<HTMLElement>("nav a[href]")
      ?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      main?.removeAttribute("inert");
      start();
    };
  }, [open, onClose]);

  // Close first; follow a same-page anchor only if it exists on the page.
  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") ?? "";
    if (href.startsWith("#")) {
      event.preventDefault();
      pendingAnchor.current = href.slice(1);
      window.history.replaceState(null, "", href);
    }
    close(false);
  };

  if (!mounted || typeof document === "undefined") return null;

  const rise = (index: number) => ({
    transform: rows[index].y.to((value) => `translate3d(0, ${value}%, 0)`),
  });
  // Bottom inset of each sheet: 100% = fully up (hidden), 0% = covering.
  const blueInset = reveal.to(
    (v) => `inset(0 0 ${(1 - Math.min(1, v / (1 - SHEET_LEAD))) * 100}% 0)`,
  );
  const blackInset = reveal.to(
    (v) =>
      `inset(0 0 ${(1 - Math.max(0, (v - SHEET_LEAD) / (1 - SHEET_LEAD))) * 100}% 0)`,
  );

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      id="mobile-menu"
      onClickCapture={handleClick}
      className="fixed inset-0 z-[900] h-dvh font-display text-hero-ink md:hidden"
    >
      <animated.div
        aria-hidden="true"
        className="absolute inset-0 bg-brand"
        style={{ clipPath: blueInset }}
      />
      <animated.div
        className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain bg-hero-bg px-6 pt-6 pb-10"
        style={{ clipPath: blackInset }}
      >
        <div
          aria-hidden="true"
          className="cortex-scrim pointer-events-none absolute inset-x-0 bottom-0 h-[53vh]"
        />

        <div className="relative flex items-center justify-between">
          <HeroLogo brand={brand} />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => close(true)}
            className="relative flex size-10 items-center justify-center"
          >
            <BurgerLines progress={reveal} />
          </button>
        </div>

        <nav aria-label="Menu" className="relative mt-[12vh] flex flex-1 flex-col">
          <ul className="flex flex-col">
            {links.map((link, index) => (
              <li key={link.href} className="overflow-hidden">
                <animated.div style={rise(index)}>
                  <Link
                    href={link.href}
                    className="flex items-baseline gap-4 py-3 text-section-title leading-tight font-black tracking-tight uppercase hover:text-hero-muted"
                  >
                    <span className="font-sans text-label font-normal tracking-normal text-hero-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </animated.div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative mt-10 overflow-hidden">
          <animated.div style={rise(links.length)}>
            <Link
              href={cta.href}
              className="flex w-full items-center justify-center bg-hero-ink px-4 py-3.5 font-sans text-body font-medium text-hero-bg"
            >
              {cta.label}
            </Link>
          </animated.div>
        </div>
      </animated.div>
    </div>,
    document.body,
  );
};

/**
 * Three lines → a cross. `progress` 0 = burger, 1 = close. Shared by the
 * burger and the panel's close button so the morph reads as one control.
 */
export const BurgerLines = ({ progress }: { progress: SpringValue<number> }) => (
  <span aria-hidden="true" className="relative block h-[16px] w-6">
    <animated.span
      className="absolute inset-x-0 top-0 block h-[2px] bg-hero-ink"
      style={{
        transform: progress.to(
          (p) => `translate3d(0, ${p * 7}px, 0) rotate(${p * 45}deg)`,
        ),
      }}
    />
    <animated.span
      className="absolute inset-x-0 top-[7px] block h-[2px] bg-hero-ink"
      style={{ opacity: progress.to((p) => 1 - Math.min(1, p * 2)) }}
    />
    <animated.span
      className="absolute inset-x-0 top-[14px] block h-[2px] bg-hero-ink"
      style={{
        transform: progress.to(
          (p) => `translate3d(0, ${-p * 7}px, 0) rotate(${-p * 45}deg)`,
        ),
      }}
    />
  </span>
);
