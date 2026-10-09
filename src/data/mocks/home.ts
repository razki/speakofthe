/**
 * SPEAKOFTHE content and scene settings for the adapted Cortex hero.
 *
 * Everything the hero renders — nav, copy, the decorative wordmark, and
 * the WebGL scene parameters — lives here as data, so the components stay free
 * of hardcoded content (project hard rule #4).
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface CortexCta {
  label: string;
  href: string;
}

/** One letter of the decorative brand wordmark. */
export interface WordmarkLetter {
  char: string;
  /** Entrance stagger delay in ms. */
  delay: number;
}

/**
 * Tunable parameters for the Prism Streaks fragment shader. Colours are hex
 * strings passed as shader uniforms (scene config, not CSS tokens).
 */
export interface PrismConfig {
  coreColor: string;
  warmFringe: string;
  coolFringe: string;
  dustColor: string;
  bgColor: string;
  bgTint: string;
  speed: number;
  twist: number;
  bend: number;
  /** Centerline anchors in top-down, normalized viewport coordinates. */
  arc: {
    startX: number;
    peakX: number;
    endX: number;
    peakY: number;
    endY: number;
    portraitPeakX: number;
    portraitAspect: number;
    landscapeAspect: number;
  };
  waist: number;
  width: number;
  dispersion: number;
  brightness: number;
  dustAmount: number;
  dustRadius: number;
  exposure: number;
  mouseLean: number;
  mainAlpha: number;
}

export interface PreloaderContent {
  wordmark: string;
  loadingLabel: string;
  duration: number;
  holdDuration: number;
  exitDuration: number;
}

export interface HomeContent {
  brand: string;
  location: string;
  established: string;
  navigation: NavLink[];
  lead: string;
  wordmark: WordmarkLetter[];
  prism: PrismConfig;
  preloader: PreloaderContent;
}

export const homeContent: HomeContent = {
  brand: "SPEAKOFTHE.",
  location: "North Yorkshire, UK",
  established: "Est. 2020",
  preloader: {
    wordmark: "SPEAKOFTHE",
    loadingLabel: "Loading SPEAKOFTHE",
    duration: 3400,
    holdDuration: 250,
    exitDuration: 850,
  },
  navigation: [
    { label: "Careers", href: "/careers" },
  ],
  lead: "Software expertise.\nA personal touch.",
  wordmark: Array.from("SPEAKOFTHE.", (char, index) => ({
    char,
    delay: 220 + index * 65,
  })),
  prism: {
    coreColor: "#8e1617",
    warmFringe: "#8e1617",
    coolFringe: "#8e1617",
    dustColor: "#8e1617",
    bgColor: "#0d0506",
    bgTint: "#240709",
    speed: 2,
    twist: 5,
    bend: 0.06,
    arc: {
      startX: 0.48,
      peakX: 0.84,
      endX: 0.54,
      peakY: 0.48,
      endY: 0.9,
      portraitPeakX: 0.74,
      portraitAspect: 0.7,
      landscapeAspect: 1.4,
    },
    waist: 0,
    width: 0.33,
    dispersion: 0.048,
    brightness: 0.8,
    dustAmount: 0.35,
    dustRadius: 0.44,
    exposure: 1.35,
    mouseLean: 0.06,
    mainAlpha: 1,
  },
};
