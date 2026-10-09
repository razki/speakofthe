---
tags: [frontend, components, stable]
updated: 2026-10-09
---

# SPEAKOFTHE Hero — component catalog

## Current implementation — 2026-10-09

The owner requested the existing prism template in dark red, with the content
and block typography from [speakofthe.com](https://speakofthe.com/). The result
is a scrollable SPEAKOFTHE software-consultancy page. File names retain
`cortex-*` where they continue the template's existing components.

`src/views/home.tsx` is the Server Component and owns the sole `<main id="main">`.
It passes `homeContent` from `src/data/mocks/home.ts` to `CortexHero`, followed by
an isolated lower-content wrapper containing `RibbonBackground` and
`StudioSections` with `studioContent` from `src/data/mocks/studio.ts`. The same
content is present in the robot form; only decorative WebGL and the preloader
are omitted there, and first-screen springs render at rest.

| File | Client? | Current role |
|------|---------|--------------|
| `cortex-hero.tsx` | Yes | Named, relative hero section in normal document flow. Coordinates the preloader, hero entrances, prism canvas, wordmark and location. `useInitialDocumentEntry` limits the intro to the initial hard entry on home. |
| `hero-content.tsx` | Yes | One responsive layout with the visible page `h1`; the header contains the logo and a far-right Careers link on every viewport. The supporting paragraph is removed. No CTA, hamburger or menu is mounted. |
| `hero-shared.tsx` | Yes | Montserrat block-text logo and staggered nav reveals. The retained CTA sweep support is unused by the current header. |
| `cortex-wordmark.tsx` | Yes | Decorative, fluid-width `SPEAKOFTHE.` letters with the existing staggered spring reveal. A shared letter grid places location/year tightly below the wordmark, right-aligned to the E rather than the final dot. |
| `mobile-menu.tsx` | Yes | Retained but unused. The single visible Careers link makes a mobile menu unnecessary. Its original portal, focus management and spring behavior remain available. |
| `preloader.tsx` | Yes | Stationary Montserrat 900 `SPEAKOFTHE` letters fill left to right through a spring-driven clip mask, followed by curtain lift. Imperative `useSpringValue` values preserve 100% during exit and cannot reset on rerender. Compact counter retains its reserved `100%` width. Content/timing arrive via `homeContent.preloader`. |
| `prism-streaks.tsx` | Yes | Original GLSL filament equations with an owner-authorized right-facing bow centerline remap. `homeContent.prism.arc` supplies normalized anchors and portrait adaptation. Keeps the DPR 1.5 cap, desktop draw limiter and off-screen/hidden-tab suspension. |
| `studio-sections.tsx` | No | Typed `StudioSectionsProps` / `StudioContent`: named Services, About and compact Contact sections, then company footer. Desktop sections use a 5/7 editorial grid with spacing instead of dividers; About shares the page background. |
| `client-logos.tsx` | Yes | [[client-logos]]: eight official off-white logos in a seamless spring ticker between Services and About. Measured ink bounds give equal visible-edge gaps while preserving optical sizing; pause button, off-screen suspension and static reduced-motion/robot lists remain. |
| `ribbon-background.tsx` | Yes | Local GetLayers Neon Ribbon Waves media behind the lower content through the footer. A sticky viewport preserves the source motion; shared visibility/motion gating defers the video request and pauses playback. Reduced-motion/robot entry is poster-only. |
| `contact-email.tsx` | Yes | Small uppercase, right-aligned email reveal control. Typed labels arrive from `studio.ts`; `useContactEmail` owns the request/state. Shows selectable plain text after activation, with loading, retry and live-region feedback. No `mailto:` link. |
| `contact-direction.tsx` | Yes | A traveling light moves right along a fine line toward the email control. `studioContent.contact.direction` supplies spring parameters; `useDecorativeMotion` pauses it off-screen/in hidden tabs and keeps reduced-motion/robot views static. |
| `../careers/careers-background.tsx` | Yes | Full-bleed local GetLayers Coral Light Arc video/poster behind Careers, tinted brand red at 20% opacity. Typed `careersContent.background` supplies the media URLs; the shared motion gate defers the source and pauses inactive playback. Replaces the earlier spring glows. |

The previous `hero-desktop.tsx` and `hero-mobile.tsx` fixed-stage layouts are
retired. The new layout uses a standard 16px root and fluid spacing/type tokens;
`AdaptiveGrid` is no longer mounted. See [[design-system]] and [[decisions-log]]
ADR-0013. All DOM animation remains spring-based; protected animation engine
files are unchanged.

Content was verified against the public site's app bundle on 2026-10-08, then
revised by the owner. The About introduction now says **Established in 2021**
and **Software Consultancy**, based in **North Yorkshire**, following the
owner's 2026-10-09 copy correction.
Services, About, contact-control labels, LinkedIn, company and VAT details live in `studio.ts`;
hero copy, navigation, wordmark and scene configuration live in `home.ts`.
Header and footer Careers links now target the local `/careers` page.
`src/views/careers.tsx` remains a Server Component with no-vacancies copy from
`src/data/mocks/careers.ts`, return-home navigation, and shared-generator metadata.
Its decorative background is isolated in `CareersBackground` and uses the actual
GetLayers **Coral Light Arc** materialized with `cortex-style` / `noir-vermillion`.
The bare, full-bleed media replaces the earlier spring glows; the Careers layout,
copy, metadata and navigation remain. The route delegates to the view and is
included in the sitemap.

`public/assets/backgrounds/coral-light-arc-1080.mp4` is local H.264, 1440×1080,
30fps, 4.0667 seconds and 529,246 bytes, with audio removed. Its WebP poster is
44,640 bytes; original downloads are archived in `tmp/qa/coral-arc/`. Source
colours and motion remain unchanged: theme-only grayscale/brightness and multiply
compositing over the existing brand red tint the presentation at 20% opacity.
The muted inline video loops without DOM animation or a new dependency. It starts
without `src`, uses `preload="none"`, and is requested only when
`useDecorativeMotion` is active. Inactive playback and unmount cleanup pause it;
initial reduced motion leaves the poster with no video source.

The email address is supplied privately as runtime `CONTACT_EMAIL`; the
`server-only` getter in `src/data/contact.server.ts` reads it after a request.
`POST /api/contact-email` validates the request and compares Origin with the
configured canonical origin (or the local request origin). Missing configuration
returns 503; success is non-cacheable. See [[aws-deployment]] / ADR-0018. The address is absent from initial
page props, HTML, JSON-LD and browser bundles. This deters passive address scraping;
an automated client can still imitate the reveal request. See [[hooks]],
[[api-architecture]] and [[decisions-log]] ADR-0014.

GetLayers' Noir Vermillion palette and Artist Process composition informed the
restrained oxblood palette and services layout; the prism keeps the template's
filament equations with the owner's later centerline remap. Following owner review, section dividers and white
outlines are removed. The Services and About content stays, while their header
links are removed. The header “Let's talk”, hero/contact “Let's get to work”
and “Explore what we do” prompts are removed. The independent-consultancy eyebrow
and Services/About overline labels are also removed. The Services heading is
vertically centered beside the service list, around item 02 on desktop. The About
“What we do” block uses the owner's supplied sectors/maintain-uplift-design copy.
Contact now has a visible `Get in touch` `h2` and a fine right-pointing line with
a traveling light leading toward the compact, right-aligned email reveal control.
The contact location stays removed; the email reveal boundary is unchanged.

Fonts are self-hosted WOFF2 via `next/font/local`: Montserrat 900 for block
headings and General Sans 400/500 for body/UI. The loaded Montserrat 400 asset
remains available, but the owner removed the hero supporting paragraph on
2026-10-09. General Sans replaces the initial
Poppins adaptation. Careers uses Montserrat 900 at the 13px `text-nav` token on
all widths. The About introduction uses Montserrat 900 with fluid 16–20px
`text-about-intro`. Contact uses the former location's General Sans 12px
`text-label`, uppercase with wide tracking. No
dependencies were added. The prior CTA-sweep/mobile-menu requirements are
superseded by this explicit removal; protected animation engine files remain
unchanged.

### Hero strand bow — 2026-10-09

The owner's supplied reference authorizes a broad right-facing bow, superseding
the earlier unchanged scene-path restriction. `PrismConfig.arc` in
`src/data/mocks/home.ts` sets normalized, top-down anchors: top x=0.48, peak
x=0.84 at y=0.48, and return x=0.54 by y=0.90. The peak blends from x=0.74 on
portrait screens to x=0.84 across aspect ratios 0.7–1.4 using `smoothstep`.

Two cosine-eased legs define the centerline. An aspect- and breathing-adjusted
horizontal offset remaps only the coordinates passed to `field()`. Its filament
equations, flow, width, colours and cursor sway remain; dust and pointer-glow
coordinates are not remapped. No engine, frame-loop or dependency change is part
of this amendment. See [[optimization-history]] and [[decisions-log]] ADR-0017.

### Current preloader behavior

`homeContent.preloader` supplies the stationary wordmark, loading label, 3.4-second
fill, 250ms hold and 850ms curtain lift. `AnimatedVarTextTag` and react-spring drive
the graphic clip mask and lift; the letters themselves do not move or split.
This is a progress-indicator mask, following the existing gradient-wordmark
exception rather than a text-engine entrance. The compact bottom-right counter
still reserves the width of `100%` to avoid layout shifts. `onReveal` fires once
as the curtain lifts; unmount cleanup cancels springs/listeners/timers, and safety
timers prevent a cancelled spring from trapping the page behind the curtain.
The progress and lift are imperative `useSpringValue` instances: the previous
`useSpring` initial targets could be replayed by a render as exit began, resetting
the count from 100 to 0. An explicit loading/exiting/hidden phase resumes safely
after effect cleanup; progress is pinned to 100 before exit. `useEffectEvent`
keeps the reveal callback current without restarting the lifecycle on rerender.

`useInitialDocumentEntry` captures React's server/hydration snapshot once. The
loader appears on an initial hard entry to home, while client navigation to home
starts the hero directly, including a fresh Careers entry followed by home.
No browser-global render reads, session storage or root provider are needed.
Reduced motion bypasses the animated count and lift; the robot form still omits
the loader entirely. See [[hooks]] and [[decisions-log]] ADR-0015 / ADR-0016.

### Lower-content ribbon background

`RibbonBackground` receives local URLs from `src/data/mocks/ribbon-background.ts`.
It uses the actual unwatermarked GetLayers **Neon Ribbon Waves** footage:
`public/assets/backgrounds/neon-ribbon-waves-1080.mp4` is H.264, 1440×1080,
1,547,117 bytes; its WebP poster is 42,550 bytes. Original downloads are archived
in `tmp/qa/ribbon-review/`. The source animation is preserved; grayscale,
brightness and multiply compositing against the existing brand red apply the
page treatment without editing or recolouring source pixels.

The isolated media layer is 22% opaque and fills a sticky viewport behind
Services, the logo ticker, About, Contact and footer. Those sections have
transparent backgrounds. It is decorative and pointer-transparent, with no DOM
animation, additional renderer or dependency. A muted inline video starts
without a `src`, with `preload="none"`; the shared motion gate requests it only
when active and pauses it off-screen or in hidden tabs. Initial reduced-motion
and robot views remain poster-only with no video request. The observer requires
positive visible area, so touching a viewport edge does not start playback.

### Verification — 2026-10-09

Browser tracing recorded 582 monotonic loader samples; exit counts remained
`[100]` and the curtain disappeared. Home→Careers→home and fresh Careers→home
both reported `loaderSeen: false`. At 1593px all 15 ticker gaps, including the
duplicate-list seam, measured 63.729px. At 320px there was no horizontal overflow;
reduced motion had no video source and one static logo list. Contact HTTP checks
passed. After the observer correction, a fresh top-of-home visit kept video
`src=null` and playback paused; entering Services attached the source and played,
and returning home paused it at the viewport boundary. Browser console checks
were clean. Final `yarn lint` and production build reruns passed. These checks do
not establish new Lighthouse or performance scores.

## Original template implementation — historical, 2026-07-02

The following documents the original fixed-screen Cortex design. Its branding,
font selection and responsive stage have been superseded above; its shader and
spring-system rationale still apply.

The hero on route `/` (Figma frame 419:171 / preloader 425:340), ported from the
`prism-streaks` source bundle. A WebGL shader background, a spring preloader, a
coordinated entrance, and a giant wordmark. Lives in `src/components/hero/`.

## Data flow

`src/views/home.tsx` (Server Component) → `<CortexHero content={homeContent} />`.
All copy, nav, wordmark letters, and the shader config come from
`src/data/mocks/home.ts` — nothing is hardcoded in the components.

## Components

| File | Client? | Role |
|------|---------|------|
| `cortex-hero.tsx` | ✅ | Coordinator. Owns `played`; the preloader flips it as its curtain lifts, cueing the wordmark + content entrances together. Renders the `<main>`, canvas, and bottom scrim. |
| `prism-streaks.tsx` | ✅ | Full-screen Three.js fragment-shader background (chromatic filaments + cursor-following sparkle dust). Config via props. |
| `preloader.tsx` | ✅ | White curtain: 0→100 % counter (bottom-right, fluid `vw`), four-square clockwise loader (top-left), curtain lift. All spring-based. Calls `onReveal` as it lifts. |
| `hero-content.tsx` | ✅ | Breakpoint switch — renders both `HeroDesktop` + `HeroMobile` (CSS `lg` toggles which paints) and holds the page `<h1 class="sr-only">`. |
| `hero-desktop.tsx` | ✅ | Desktop (≥ lg): the faithful 1440×800 stage in design px, uniformly scaled to viewport width (`scale = w/1440`). |
| `hero-mobile.tsx` | ✅ | Tablet/mobile (< lg): reflowed single-column copy + a hamburger that toggles a spring menu panel. Fluid `clamp()` type. |
| `hero-shared.tsx` | ✅ | Shared `HeroLogo`, staggered `NavReveal`, and the `EASE_OUT` easing used by both layouts. |
| `cortex-wordmark.tsx` | ✅ | Giant "Cortex" bled off the viewport bottom; letters spread with `justify-between` + fluid `vw`, each keeping its gradient + rise/blur reveal. Decorative (`aria-hidden`). |

## Layout, responsiveness & tokens

**Responsive strategy = reflow** (chosen 2026-07-02). Two layouts switch at Tailwind
`lg` (1024px):

- **Desktop (≥ lg):** the exact Figma composition on a fixed 1440×800 px stage,
  uniformly scaled by `w/1440` (like the source's `--s`). This keeps it 1:1 at the
  design width and proportional at every desktop width — the earlier
  rem-on-adaptive-grid layout broke above 1440 and at ≤1024 because the grid
  rebases per band.
- **< lg:** a reflowed column (stacked copy, hamburger menu), sized with fluid
  `clamp()`/`vw` so it stays readable from ~320px up.

The wordmark and preloader counter use viewport-relative `vw` so they fit at any
width without the band rebasing. Colours and the display font are tokens in
`globals.css` (`--brand`, `--hero-*`, `--font-display`); gradient-text fills use
the sanctioned `@layer components` exception (`.cortex-clip-text`,
`.cortex-letter-a/b`, `.cortex-lead`, `.cortex-scrim`). Desktop-stage coordinates
are one-off design-px utilities (they scale as a unit).

## Key decisions (would-be ADRs)

1. **WebGL background is exempt from the spring rule.** A GLSL fragment shader
   cannot be expressed with react-spring; it is a canvas effect on its own rAF
   loop, not DOM motion. New dependency `three` — see [[tech-stack]]. All *DOM*
   motion in the hero stays spring-based.
2. **`<Spring>` (not the text engine) for the wordmark, lead & subcopy.** Each
   wordmark letter needs an **independent gradient fill**, and the lead is a
   single-element `background-clip:text` gradient — neither is expressible with
   `spring-text-engine`'s span-splitting / uniform letter styling. Element-level
   reveals also let the letters flow with `justify-between` for responsiveness.
   (Not a custom text-animation engine — just element springs.)
3. **Preloader converted from CSS keyframes → springs.** The counter is a numeric
   `useSpring`, the square loader a stepped `useSprings` loop, the curtain a
   `translateY` spring — honouring the no-CSS-keyframes/transitions rule.

## Related

[[components/animation-springs]] · [[design-system]] · [[animation-system]] · [[tech-stack]]
