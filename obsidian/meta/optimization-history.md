---
tags: [meta, optimization]
updated: 2026-10-09
---

# Optimization history — Cortex

What the performance/SEO optimization pipeline changed in this project, why,
and what must not be undone. Maintained by the optimization pipeline
(`getlayers-pipeline/optimization-pipeline`); the full chronological record with
every measurement is its `obsidian/Projects/cortex.md`, raw runs in
`runs/cortex/`. Per-change prose is in [[changelog]] (entries 2026-10-04 to
2026-10-06). D-numbers are the pipeline's decisions log. Last updated
2026-10-06. Note: many files in this repo are CRLF — keep each file's line
endings when editing.

## Current state

> [!important] Authorized redesign — 2026-10-08
> The owner requested a dark-red SPEAKOFTHE site using the content and block
> typography of `speakofthe.com`. The current working tree is a scrollable page,
> with a relative prism hero followed by Services, About, Contact and footer.
> `HomeView` now owns the main landmark. Its unified responsive hero and fluid
> tokens replace the original fixed stage; `AdaptiveGrid` is no longer mounted.
> See [[decisions-log]] ADR-0013 and [[components/hero]].
>
> This request supersedes the earlier **Cortex branding**, **Onest/Inter font
> selection** and **fixed single-screen layout** below. Montserrat 400/900 and
> General Sans 400/500 remain self-hosted WOFF2 via `next/font/local`: do not
> restore a build-time Google Fonts fetch. Prism colours are supplied through
> the existing scene configuration. The original GLSL filament equations remain,
> with an owner-authorized centerline remap added on 2026-10-09 as noted below.
> The scene's frame loop now pauses when IntersectionObserver reports the
> canvas off-screen or the document is hidden, and resumes when visible.
>
> Retain the **DPR 1.5 cap**, **desktop draw limiter**, **robot form**,
> **server-rendered consent**, **fixed-width preloader counter**,
> **no gyroscope** and **protected spring engine**. The
> historical performance numbers below describe earlier builds, not the new
> design; the redesign does not by itself establish new Lighthouse scores.
>
> Owner review on the same date explicitly removed CTAs, Services/About header
> links, the mobile menu and decorative divider/outline treatment. The header
> now shows only Careers beside the logo on all widths. This supersedes the
> prior mounted CTA-sweep/mobile-menu requirements below; their retained
> components are unused. General Sans replaces the initial Poppins pairing.
> Content sections remain, with a continuous background and compact contact.
>
> The owner's company-logo strip now sits between Services and About. Keep its
> local assets, equal visible-edge gaps, spring-only loop and off-screen/hidden-tab
> suspension. Reduced-motion and robot views render one static wrapping list;
> do not let global `skipAnimation` restart an infinite loop. See [[client-logos]].
>
> A further twelve owner annotations remove the hero eyebrow and Services/About
> overlines, center the Services heading, and use smaller Montserrat for the
> About introduction (16–20px). The formerly smaller hero supporting paragraph
> was subsequently removed on 2026-10-09. Location/year now shares the
> wordmark grid below it, right-aligned to the E before the dot. Careers resolves
> to local `/careers`, with no vacancies, route metadata and a sitemap entry.
>
> Contact is now a small uppercase control at the right, replacing its location
> label. Preserve the server-only address boundary: no initial HTML/props,
> browser bundle or JSON-LD email. A user-triggered same-origin POST reveals
> selectable plain text without a `mailto:` link. No-store responses and strict
> validation deter passive scraping, but the endpoint is not bot-proof. See
> [[decisions-log]] ADR-0014 and [[api-architecture]]. No new performance scores
> are established by these layout/contact changes.
>
> The real self-hosted Montserrat 400 added for the earlier centered hero
> paragraph remains available; that paragraph is now removed. Display type
> retains Montserrat 900. The loader now
> fills stationary `SPEAKOFTHE` letters left to right (3.4s fill, 250ms hold, 850ms
> lift); this supersedes its four tiles and giant counter. Its small counter
> still reserves `100%` width. Keep reduced-motion bypass, robot omission and
> safety dismissal/cleanup. The graphic progress mask uses existing spring
> primitives; the protected animation engine remains unchanged.
>
> Contact now has a visible `Get in touch` heading with a traveling light toward
> the email reveal control. Its spring loop uses `useDecorativeMotion` and stays
> static for motion-off states. Careers now uses Coral Light Arc media as described
> below, superseding ADR-0015's radial glows. These decorations add no WebGL;
> existing scene limits and the server-only contact-address boundary still apply.

> [!important] Owner amendments — 2026-10-09
> The supplied broad right-facing bow reference explicitly authorizes changing
> the hero strand path. `homeContent.prism.arc` sets normalized top-down anchors:
> top x=0.48, peak x=0.84 at y=0.48, and return x=0.54 by y=0.90. Portrait peak
> x=0.74 blends to the desktop peak across aspect ratios 0.7–1.4. Two cosine-eased
> legs produce an aspect/breathing-adjusted horizontal coordinate remap for
> `field()` only. This supersedes the earlier unchanged scene-path restriction;
> the original filament equations, flow, colours, dust and cursor behavior remain.
> Preserve DPR 1.5, desktop draw limiting, off-screen/hidden-tab suspension, robot
> omission, no gyroscope and the protected spring engine. See ADR-0017 in
> [[decisions-log]]. No performance score is implied by this geometry change.
>
> The brand-fill loader now uses imperative `useSpringValue` instances for its
> progress and lift. Retained declarative initial targets could be replayed on
> rerender, causing the observed 100→0 reset before exit. Keep progress pinned at
> 100 through the lift, the explicit phase lifecycle, one reveal notification,
> StrictMode-safe cleanup/resume and reduced-motion dismissal. The new
> `useInitialDocumentEntry` captures SSR/hydration eligibility once: hard home
> entry gets the intro; client navigation to home never replays it, including
> direct Careers entry followed by home. No browser-global render check is used.
>
> Logo spacing now follows measured visible ink bounds rather than equal slots,
> preserving source art and optical sizes. The shared gap also spans the repeat
> seam. See [[client-logos]]; do not restore transparent padding as visible space.
> Further owner review widens that shared gap to `clamp(36px, 5vw, 80px)`.
>
> A local, unwatermarked GetLayers Neon Ribbon Waves H.264 asset (1440×1080,
> 1,547,117 bytes) and WebP poster (42,550 bytes) supply the original motion behind
> lower content through the footer. Source pixels are not recoloured: grayscale,
> brightness and brand-red multiply compositing at 22% opacity provide the page
> treatment. Keep its sticky viewport, transparent sections, local assets and
> deferred `src`. Initial reduced-motion/robot views are poster-only; video is
> requested only while active and paused off-screen/in hidden tabs. No new DOM
> animation, WebGL or dependency is added. Originals are archived in
> `tmp/qa/ribbon-review/`.
>
> Careers now uses bare, full-bleed actual GetLayers Coral Light Arc media in place
> of the earlier spring glows. Keep the local H.264 1440×1080, 30fps, 4.0667-second
> video (529,246 bytes, audio removed) and 44,640-byte WebP poster. Grayscale,
> brightness and brand-red multiply compositing at 20% opacity provide the tint;
> source colours/motion are unchanged. The video follows the same deferred-source
> and inactive-pause pattern, with poster-only initial reduced motion. Originals
> are archived in `tmp/qa/coral-arc/`. The existing Careers layout/copy remain;
> do not restore the superseded glow tokens or add DOM animation to this media.
>
> `useDecorativeMotion` uses observer threshold 0.001 and requires positive
> intersection ratio as well as `isIntersecting`, so merely touching a viewport
> edge stays paused. Preserve the existing scene limits and contact boundary.
> See [[components/hero]], [[hooks]] and [[decisions-log]] ADR-0016.

Earlier ribbon/loader verification: final `yarn lint` and production build pass. The
loader had 582 monotonic browser samples, remained at 100 throughout exit and
disappeared; both Careers→home scenarios skipped it. All 15 visible logo gaps
including the seam measured 63.729px at 1593px. At 320px there was no horizontal
overflow, and reduced motion showed no video source and one static logo list.
Contact HTTP checks passed. Fresh home entry left video unloaded/paused, entry
into Services requested/played it, and return to the home boundary paused it.
The browser console was clean. No new Lighthouse/performance scores are claimed.

### AWS repository migration amendment — 2026-10-09

The owner authorized replacing the old CRA application in the existing
`speakofthe` repository. The original Cortex preview remains separate. Keep all
scene, loader, crawler, local-font, visibility and protected-engine invariants
above. Next standalone output is required for the POST API and Proxy; do not
replace it with a static export or restore CRA's cached HTML fallback.

CloudFront's application behavior bypasses caching, preserving human/crawler
routing and RSC/API semantics; only hashed bundles/media use static S3 behaviors.
A no-store cleanup worker at the old URL retires scoped CRA/Workbox precaches,
unregisters and refreshes controlled same-origin windows. It neither claims new
visitors nor intercepts requests. Public asset sync retains old hashed assets.

The contact boundary now obtains runtime `CONTACT_EMAIL` through its server-only
getter, with no committed literal and 503 when absent. Reveal Origin uses the
configured public canonical origin behind AWS, retaining strict input/fetch-site
checks and no-store responses. CI pins Node 22/Yarn 1.22.22; the runtime and legacy
edge Terraform states/providers stay separate. See [[aws-deployment]] and
[[decisions-log]] ADR-0018. Local validation does not establish AWS readiness or
new performance scores; deployment and the real plan remain pending.

### Last recorded production state — before the redesign

- **Live:** https://getlayers-cortex-sxcvb.vercel.app (deploys `main`). Status:
  **optimized** (2026-09-29; re-confirmed 2026-10-05 under D-031).
- **Production only caught up on 2026-10-05.** Vercel refused every production
  build from 2026-07-09 (TEAM_ACCESS_REQUIRED — a repo-local git identity that
  wasn't a team member; #41). Fixed under D-031: identity removed, owner-authored
  commit `1405f8a` deployed.
- **Lighthouse:** D-031 verification on production vs branch (2026-10-05):
  people desktop 100 / mobile 99, A11y/BP/SEO 100. Robot form 100 / 97 (robot
  mobile is bimodal 92 / 97–99 on every tree). After D-033 (local): mobile 99,
  desktop 100.
- **Scroll, production** (D-031 sweep, 2026-10-06, 3 runs): desktop **ideal**
  (0 %, max 10.4 ms), mobile **ideal** (0 %, max 10.4 ms).
- One-screen hero: counting preloader, three.js "prism streaks" background,
  wordmark + copy that play when the curtain lifts.
- Last commit on `main`: `abbe90c` (D-037 gyroscope revert).

## Invariants — do not undo

- **No gyroscope** — the owner asked for it (D-036, `0e8921d`) and then for its
  removal (D-037): reverted in `abbe90c`, `src` identical to `618dcb9`. Don't
  re-add `device-tilt` here.
- **The preloader counter is held at the width of "100%"** — an invisible copy
  sizes the box, the live count overlays it with the same right edge
  (`src/components/hero/preloader.tsx`). Proportional digits at 20vw moved the
  box every step: PC CLS 0.142 → 0, PC perf 94 → 100.
  The 2026-10-08 wordmark-fill loader keeps this invariant with a small counter;
  the old 20vw sizing and four-square decoration are historical, not requirements.
  The 2026-10-09 lifecycle also holds 100 through exit and skips the intro on
  client navigation. Do not reintroduce declarative zero targets on rerender.
- **The streak shader draws at most 60 fps on desktop** —
  `src/components/hero/prism-streaks.tsx` (cursor lerp per tick). A full-screen
  shader at 120 Hz: desktop janky (up to 15 %) → ideal 0 %. Phones unchanged.
- **Fonts are self-hosted Latin WOFF2** — `src/app/fonts/onest-latin.woff2`
  (weight axis 400–700, 34 → 21 KB) and `inter-latin.woff2` (200–500, 48 →
  31 KB) via `next/font/local`. `next/font/google` failed a `vercel build` when
  Google Fonts was unreachable — builds must not fetch Google.
- **Consent banner server-rendered** (`src/components/common/Cookie/consent-flag.ts`)
  — it was the mobile LCP (3.7 s): mobile 88 → 96–99. Visible: the banner appears
  with the first frame and covers the counter's corner on phones.
- **Header "touch" CTA reveals with a mask sweep** (`sweep` in
  `src/components/hero/hero-shared.tsx`, `NavReveal`) and **the mask comes off at
  rest** (delay + 700 ms) — a mask left on keeps a masked layer over the
  always-animating scene. axe-sweep failing every run → 0.
- **Robot form (D-016)** — `src/proxy.ts` → `src/app/robot-view/`; no curtain,
  no decorative WebGL, banner skipped; first-screen springs via
  `src/components/common/robot-spring.tsx` rendered as plain elements at their
  `to` state. Two traps: the rewrite keeps `/`, so robot detection is a server
  `<meta name="x-robot-view">` (`robot-view.tsx`), not a pathname check; the
  banner gate is a layout effect, not render-time (render-time was React #418,
  BP 96). Robot 95 → 100.
- **Real site metadata** (`src/lib/site.ts`): "Cortex", not "New Project";
  author Cortex; no Twitter handle. Origin falls back to
  `VERCEL_PROJECT_PRODUCTION_URL` (`618dcb9`) — until 2026-10-06 the live
  canonical and `og:image` were `http://localhost:3000`.
- **Brand kit + meta (D-033)** — `src/assets/brand/mark.svg` (the header's 2×2
  tile), favicon set, `public/open-graph.jpg` (the old `.png` deleted); title
  "Cortex — AI integration and automation for business". Robot head = people head.
- **Full-screen mobile menu (D-033)** — `src/components/hero/mobile-menu.tsx`:
  portalled to `<body>` at `z-[900]` (the fixed `<main>` is a stacking context
  below the consent banner), clip-path sheet drop, burger→cross morph, focus
  trap / Escape / inert.
- **`body { justify-content: safe center }`** (`src/app/globals.css`) — plain
  `center` on the 100vh body cut off the top of the taller `/privacy-policy`
  page (`5510540`).
- **Bot list includes AI crawlers** (`src/utils/bot-ua.ts`, `2e23dc2`); **no
  `src/app/loading.tsx`** (`1e2389e`); `/privacy-policy` (BP 96 → 100);
  `src/utils/math.ts` typed (CRLF kept).
- **No repo-local git identity** — commits must come from a Vercel team member
  or production won't build (#41).

## Owner decisions that bind this project

- D-016 / D-017 (2026-09-29) — robot form; A11y/BP/SEO 100.
- D-018 / D-027 — branches pushed, merged (cortex's merge build stalled;
  re-triggered with `8a923bb`).
- D-028 / D-029 (2026-10-02/03) — mobile ≥ 90, 100 elsewhere (met).
- **D-031 (2026-10-05)** — #41: remove the repo-local identity (alex), push as
  the owner; scroll ideal both devices (met).
- **D-033 (2026-10-06)** — favicon + OpenGraph + all required meta; a proper
  full-screen, animated mobile menu.
- D-034 (2026-10-06) — merge everything; the D-019 origin backfill was found
  missing here and applied.
- **D-036 (2026-10-06)** — gyroscope-driven hero on phones (done) …
- **D-037 (2026-10-06)** — … then: "remove the orientation animation" on cortex.
  Reverted.

## History by pass

**Pass 1 — 2026-09-29, commits `727f029`, `9f2ea0b`.** Baseline hosted: PC 94
(CLS 0.142) / mobile 94, BP 96; robot 95/95; scroll ideal. Counter width, robot
form (first use of `scaffold-robot`), real metadata, `/privacy-policy`,
`math.ts`. Hosted after: PC 100 / mobile 94, BP 100; robot 100 across.
- `5510540` (2026-09-29): `safe center` backfill.
- `2e23dc2` (2026-10-02): AI crawlers; `1e2389e` (2026-10-03): empty
  `loading.tsx` deleted.

**D-029 round — 2026-10-04, commit `00a3ec9`.** Self-hosted fonts, banner SSR,
CTA mask sweep. Hosted (temp deploy): PC 100 / mobile 99, robot 100/100,
axe-sweep 0; desktop scroll read janky — an A/B showed `main` flips the same way
(no regression). Merged; `blocked` on desktop scroll flipping around 1 %.

**#41 — 2026-10-05, `1405f8a`:** production rebuilt for the first time since
July.

**D-031 round — 2026-10-05, commit `c9e957b`.** Streaks at 60 fps on desktop.
Prod vs branch: desktop 0.61 → 0 %, mobile ideal; 100/99. Production sweep
2026-10-06: ideal both.

**D-033 — 2026-10-06, commit `c603c76`** (`optimize/pass-2`): brand kit +
meta + mobile menu. **D-034 — `618dcb9`:** origin fallback (live canonical was
localhost).
**D-036 — `0e8921d`** (`optimize/pass-3`): gyroscope streaks (mobile 96–99,
scroll ideal). **D-037 — `abbe90c`** (`optimize/pass-4`): gyroscope reverted.

## Tried and reverted / didn't help

- Hero at rest under the curtain (D-029): not the LCP; mobile 99 → 96 —
  reverted.
- A pathname check for the robot form (the rewrite keeps `/`) and a render-time
  banner gate (React #418) — replaced by the meta marker and a layout effect.
- The gyroscope (D-036) — removed by the owner (D-037).

## Open items / leads

- **Robot mobile perf is bimodal** (92 or 97–99) on every tree — unexplained.
- People mobile LCP is the counting intro (the design); robots skip it.
- Not verified on a real iPhone: the mobile menu.

## How to measure

Run from `getlayers-pipeline/optimization-pipeline`:

```sh
node tools/measure.mjs cortex --hosted --runs 5   # Lighthouse + one-screen scroll passes
node tools/measure.mjs cortex --hosted --as-bot   # robot form
node tools/axe-sweep.mjs <url> --device both      # the header CTA entrance
node tools/fps-probe.mjs <url> --desktop          # the 60 fps streak cap
```

After any meta change: fetch the live page, take `og:image`, curl it (it was a
localhost URL until 2026-10-06).
