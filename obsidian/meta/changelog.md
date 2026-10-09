---
tags: [meta, changelog]
updated: 2026-10-09
---

# Changelog

Chronological log of notable changes to the project. Newest first.
This is a human-curated log — not a mirror of `git log`.

## 2026-10-09 - About introduction correction

- Updated the introduction to the owner's exact wording: Established in 2021,
  SPEAK OF THE LTD is a Software Consultancy based in North Yorkshire.
- Applied the same copy to the design workspace and website replacement branch.

## 2026-10-09 — AWS replacement prepared in the existing repository

- Replaced the old CRA app in `speakofthe` with the completed site, preserving
  existing Git/infrastructure ownership. The original Cortex preview is unchanged.
  Package name is `speakofthe`; Node 22 and Yarn 1.22.22 are pinned for CI, with no
  app dependency addition. Added standalone output and `/contact` → `/#contact`.
- Added Linux Lambda Web Adapter ZIP packaging, separate runtime Terraform
  state/provider, candidate/live HTTP APIs and guarded CloudFront promotion.
  Existing DNS, buckets and certificate remain; static sync uses no `--delete`.
  Every direct master push automatically deploys after validation/candidate smoke;
  branch/PR runs validate only. Manual runtime/production dispatch remains; no PR
  or AWS access preflight is required.
- Removed the committed contact literal: runtime `CONTACT_EMAIL` is validated,
  missing/blank returns 503, and canonical-origin checks work behind internal AWS
  origins. Private env files and deployment/state artifacts are ignored and kept
  out of the public package. A scoped no-store worker retires returning CRA clients.
- Added the [[aws-deployment]] runbook, script/worker catalog and ADR-0018, including
  secrets, state-upgrade prerequisites and recovery. Deployment is prepared only:
  no AWS credentials, real plan, permission validation or cutover occurred here.
- Promotion snapshots the previous Lambda version and CloudFront configuration,
  restores both on failure and checks propagation/invalidation. A failure-only
  seven-day artifact preserves recovery metadata, excluding secret-bearing plans.
- Validation: 12 deployment tests, lint/build, both backend-disabled Terraform
  stacks, actionlint and Bash syntax pass. The roughly 22 MiB staged standalone
  passes full HTTP smoke, including RSC, crawler routing, byte ranges and protected
  reveal. GitHub Actions run `37914370830` also passed Linux packaging and
  standalone smoke; the AWS job was skipped on the validation branch. No AWS
  access preflight, live plan or deployment was performed.

## 2026-10-09 — right-facing hero strand bow

- Matched the owner's broad bow direction by remapping the prism bundle's
  centerline before `field()`. The original filament equations, flow, dust,
  colours and cursor behavior remain; this explicitly supersedes the earlier
  unchanged scene-path restriction.
- Added typed `PrismConfig.arc` anchors: top x=0.48, peak x=0.84 at y=0.48 and
  return x=0.54 by y=0.90, in normalized top-down coordinates. Two cosine-eased
  legs shape the path; the peak blends from x=0.74 to x=0.84 over portrait-to-
  landscape aspect ratios 0.7–1.4. The coordinate offset accounts for aspect and
  the existing breathing effect.
- Existing DPR/frame limits, visibility suspension, robot omission and protected
  animation engine remain. No dependency or additional scene is added. See
  [[decisions-log]] ADR-0017.
- Validation: Yarn 1.22.22 lint and Next production build pass. Desktop browser
  review shows the broad right arc clear of the left heading and returning behind
  the wordmark. The 390×844 phone view keeps a narrower bow and readable heading,
  with no horizontal overflow. Browser warnings/errors were empty. Screenshots:
  `tmp/qa/hero-arc/desktop.jpg` and `mobile.jpg`.

## 2026-10-09 — plain hyphens in browser titles

- Replaced em-dash separators with ` - ` in Home, Careers and Privacy Policy
  metadata titles. The shared generator also carries these titles into social
  metadata.

## 2026-10-09 — Coral Light Arc on Careers

- Replaced the Careers spring glows with the actual GetLayers Coral Light Arc,
  materialized with `cortex-style` / `noir-vermillion`, as bare full-bleed media.
  Existing Careers layout, copy and navigation remain.
- Added a local H.264 1440×1080, 30fps, 4.0667-second clip (529,246 bytes, audio
  removed) and 44,640-byte WebP poster. Original downloads are archived under
  `tmp/qa/coral-arc/`. Source colours/motion are unchanged; CSS grayscale,
  brightness and multiply compositing tint the presentation brand red at 20%
  opacity. The earlier glow tokens are removed.
- `CareersBackground` receives typed video/poster content and reuses
  `useDecorativeMotion`: deferred video source, paused inactive playback and
  cleanup, with poster-only initial reduced motion. No new hook, architecture
  abstraction, dependency or DOM animation. ADR-0016's media approach applies.
- Validation: `yarn lint` and production build pass. At 1895×1244 and 390×844,
  the bare red arc spans the page behind readable text with no horizontal
  overflow; the local clip plays muted and loops at 20% opacity. A reduced-motion
  reload retains the local poster with `src=null`, paused playback and time zero.
  Screenshots: `tmp/qa/coral-arc/careers-desktop.jpg` and `careers-mobile.jpg`.

## 2026-10-09 — wider logo spacing, compact footer and seamless Careers glows

- Widened the shared visible-edge logo gap from `clamp(28px, 4vw, 64px)` to
  `clamp(36px, 5vw, 80px)`. Original optical sizes, equal spacing and the repeat
  seam remain intact.
- Removed the repeated `SPEAK OF THE LTD` prefix from the footer details;
  the brand above and company/VAT numbers remain.
- Replaced Careers' farthest-corner radial gradients with explicit 50% ellipse
  radii. New background-image theme tokens fade fully transparent at every
  moving layer edge, removing the rectangular cutoff visible on wide screens.
  Spring motion and reduced-motion/off-screen behavior are unchanged.
- Validation: `yarn lint` and production build pass. At 1895×1244, Careers has
  no visible rectangular glow cutoff, and all 15 ticker gaps measure 80px,
  including the loop seam. The footer shows only company/VAT numbers. At 390px
  the gap is 36px with no horizontal overflow; Careers remains readable with
  smooth glows. Browser console is clean. Screenshots: `tmp/qa/spacing-careers/`.

## 2026-10-09 — loader lifecycle, logo spacing and lower-page ribbons

- Fixed the loader's 100→0 reset before curtain lift. The installed `useSpring`
  path could replay retained initial declarative targets on rerender; progress
  and lift now use imperative `useSpringValue`. Progress remains at 100 through
  exit, with explicit phase tracking, a current single reveal callback and
  cleanup/resume that preserves StrictMode and reduced-motion behavior.
- Added `useInitialDocumentEntry`, which captures React's SSR/hydration snapshot
  once. An initial hard home entry still plays the intro; home→Careers→home and
  direct Careers→home client navigation skip it without an overlay flash.
  No root provider, browser-global render check or storage is needed.
- Removed the hero supporting paragraph at the owner's request. The heading,
  wordmark and location/year remain.
- Changed the company ticker from equal-width slots to equal gaps between
  measured visible ink edges, including the repeated-list seam. Original assets,
  optical sizing, spring loop, pause controls and static reduced/robot lists
  remain. [[client-logos]] records alpha bounds and geometry verification.
- Added `RibbonBackground` and typed content in
  `src/data/mocks/ribbon-background.ts`. The actual unwatermarked GetLayers
  Neon Ribbon Waves clip is served locally as H.264 1440×1080 (1,547,117 bytes),
  with a 42,550-byte WebP poster. Original downloads are archived under
  `tmp/qa/ribbon-review/`.
- A sticky viewport carries the original ribbon motion behind Services through
  the footer. The page uses 22% opacity, grayscale/brightness and multiply
  compositing over brand red; source pixels are not recoloured. Lower sections
  are transparent. This adds no DOM animation, dependency or WebGL renderer.
- Ribbon video starts without `src` and is requested only when active. Initial
  reduced-motion/robot views remain poster-only; off-screen and hidden-tab
  playback pauses. `useDecorativeMotion` now uses threshold 0.001 and requires
  positive intersection ratio, preventing zero-area viewport-edge touches from
  starting playback. Protected engine and existing scene limits are unchanged.
  See [[decisions-log]] ADR-0016.
- Validation: final `yarn lint` and production build pass, including the observer
  correction. Browser tracing recorded 582 monotonic loader samples, exit counts
  `[100]` and complete dismissal; both Careers return scenarios reported
  `loaderSeen: false`. At 1593px all 15 visible logo gaps, including the seam,
  measured 63.729px. At 320px there was no overflow; reduced motion showed no
  video source and one static logo list. Contact HTTP checks passed. A fresh
  home visit left video unloaded and paused; entering Services requested/played
  it, and returning home paused it at the viewport boundary. Browser console
  checks were clean; paused video time stayed at 5.466002 seconds across repeated
  observations. A Googlebot home response retained the robot marker and poster,
  with no video source, loader or removed paragraph. Evidence: `tmp/qa/ribbon-review/` and
  `tmp/qa/logo-spacing/`. No new Lighthouse/performance scores are claimed.

## 2026-10-08 — lighter hero copy, brand-fill loader and subtle motion

- Hero supporting copy retains its centered 14–17px treatment with a lighter
  Montserrat 400 weight. Added the official Google Fonts Montserrat v31 Latin
  regular WOFF2 (18,780 bytes) as a self-hosted local asset; no third-party font request is
  needed at build time or from visitors.
- Replaced the preloader tiles and giant percentage with stationary Montserrat
  900 `SPEAKOFTHE` letters, filled left to right by a spring-driven graphic clip
  mask. `homeContent.preloader` controls the 3.4-second fill, 250ms hold and 850ms
  curtain lift. A small counter still reserves the width of `100%`. Cleanup and
  safety timers protect dismissal; reduced motion skips the animated count/lift,
  and robots still omit the loader.
- Contact now shows `Get in touch` with a fine right-pointing line and traveling
  light leading toward the email reveal control. The server-only address and
  deliberate reveal behavior are unchanged.
- Careers now has broad low-opacity burgundy corner glows, drifting slowly via
  a reversing spring configured in `careersContent.background`. The view remains
  a Server Component, with the effect isolated in `CareersBackground`.
- Added `useDecorativeMotion`, shared by the contact cue and careers background:
  stationary SSR, static reduced-motion/robot rendering, and paused loops while
  off-screen or the tab is hidden. No new WebGL, dependency or protected-engine
  modification. See [[decisions-log]] ADR-0015.
- Validation: `yarn lint` and production build pass. Desktop and 320px browser
  checks confirm the filling loader, regular-weight font, Careers background,
  contact layout and keyboard email reveal without horizontal overflow.
  Reduced motion skips the loader and leaves static glows/arrow. The contact
  pulse changes while visible and keeps its transform unchanged off-screen.
  Loop callbacks also guard global spring skipping to avoid immediate loops
  after robot navigation. Screenshots: `tmp/qa/motion-review/`.

## 2026-10-08 — twelve browser annotations and email reveal

- Removed the independent-consultancy eyebrow and Services/About overline
  labels. Hero supporting copy is centered in Montserrat 900 at fluid 14–17px;
  the About introduction uses the same face at fluid 16–20px.
- Services' heading is vertically centered beside the list on desktop, around
  item 02. Location/year sits tightly below the wordmark in its shared letter
  grid, right-aligned to the E before the final dot.
- The About “What we do” paragraph now uses the owner's supplied text covering
  Gambling, Defence, Public, Telecoms, eCommerce and Media/Live-streaming, and
  maintaining, uplifting and designing solutions to client requirements.
- Header/footer Careers links point to local `/careers`. Its Server Component
  view states no vacancies are available, provides return-home navigation and
  exports shared-generator metadata; the route is included in the sitemap.
- Removed the contact location and large `mailto:` address. A compact uppercase,
  right-aligned `ContactEmail` control uses the former location label's style.
  Its typed `useContactEmail` hook requests the address only on activation, then
  shows selectable plain text with loading, error and retry feedback.
- Added `POST /api/contact-email`: strict zod input, same-origin header checks,
  standard envelopes and no-store responses. The address stays in
  `contact.server.ts`, outside initial HTML/props, JSON-LD and browser bundles.
  This deters passive scraping but cannot prevent a bot imitating the request.
- No dependencies, scene behavior or protected spring-engine files changed.
  ADR-0014 records the contact boundary and superseded navigation decisions.
- Validation: `yarn lint` and production build pass. Browser checks at desktop,
  390px and 320px confirm typography, layout and no horizontal overflow; local
  Careers navigation and keyboard email reveal work without browser errors.
  HTTP checks confirm address-free initial HTML, valid reveal success, rejected
  missing/foreign origins and malformed input, no-store responses and GET 405.
  The address is absent from `.next/static`. Evidence: `tmp/qa/annotations/`.

## 2026-10-08 — company logo strip

- Added all eight owner-supplied companies between Services and About: Sky Bet,
  DAZN, Gamma Telecom, Transport for Greater Manchester, Fanatics Markets, Data
  Edge Analytics, CreateFuture and Apergy. Genuine local assets are masked to
  the existing off-white ink, centred in equal slots with optical sizing.
- Adapted GetLayers' Vexon marquee to the existing spring engine and dark-red
  theme. Seamless scrolling includes hover/manual pause and off-screen/hidden-tab
  suspension. Reduced-motion and robot views display all logos in a static wrap.
- No new dependencies or protected-engine changes. Asset sources, data flow and
  component behaviour are documented in [[client-logos]].
- Validation: `yarn lint` and production build pass. Browser checks at 1440,
  390 and 320px verify all eight assets, no errors/overflow, actual scrolling,
  manual pause/resume, hover pause and off-screen pause. Reduced-motion and
  robot views each expose one static wrapped list of all eight companies.
  Screenshots and movement measurements are in `tmp/qa/client-logos/`.

## 2026-10-08 — owner review: simpler navigation and continuous background

- Header navigation is a single far-right **Careers** link, set in Montserrat
  900 at 13px on every viewport. Services/About navigation links, the header
  “Let's talk” CTA, and the mounted hamburger/mobile menu are removed.
- Services/About substantive content remains. Decorative dividers and white
  outlines are removed throughout; About now uses the surrounding page's
  background. Services use whitespace between rows.
- Hero/contact “Let's get to work” and “Explore what we do” prompts are removed.
  Contact is compact email/location content with a visually hidden `Contact`
  heading. Established 2020, North Yorkshire and all company details remain.
- General Sans 400/500 replaces Poppins for body/UI, alongside Montserrat 900
  display type. Fonts remain self-hosted WOFF2 through `next/font/local`;
  `font-sans` now binds to `--font-general-sans`. Hero supporting copy uses a
  fluid 18–21px token. No dependencies were added.
- The explicit CTA/menu removal supersedes their earlier display requirements;
  their supporting components remain unused, and the protected animation engine
  remains unchanged.
- Validation for this owner-review revision: `yarn lint` and production build
  pass. Browser checks at 1440, 390 and 320px show no errors or horizontal
  overflow. Careers typography/alignment, removed navigation/CTAs, loaded General
  Sans, border-free content and matching section backgrounds are verified.

## 2026-10-08 — initial redesign verification (before owner review above)

Validation for that initial revision: production build and `yarn lint` pass.
Production browser checks at 1440, 390 and 320px report no console errors or
horizontal overflow. Mobile menu, anchor links, consent and privacy route work.
WebGL draw calls stop off-screen and resume on return; robot output preserves
the page content with one h1 and no decorative canvas. Owner corrections are
2020 / North Yorkshire, including metadata and the social preview image.

## 2026-10-08 — initial SPEAKOFTHE redesign

- **Owner-requested rebrand:** the template now carries content verified from
  `speakofthe.com`, with near-black burgundy, oxblood light streaks and warm-white
  type. The existing source-site block font is Montserrat 900, paired with
  Poppins 400/500; all fonts remain self-hosted Latin WOFF2 via `next/font/local`.
- **Owner correction:** established **2020**, based in **North Yorkshire**.
  These facts take precedence over the imported site's 2021 / West Yorkshire
  wording in current site content and metadata.
- **Scrollable page:** `HomeView` owns one main landmark. The hero is a relative
  section; `hero-content.tsx` replaces the old fixed desktop/mobile stages with
  one responsive layout. `StudioSections` and `src/data/mocks/studio.ts` add
  Services, About, Contact and company footer, including verified email,
  LinkedIn, company/VAT details and a link to the existing careers page.
- **Minimal visual direction:** GetLayers Noir Vermillion and Artist Process
  references informed the palette and ruled editorial services layout. The
  existing GLSL scene is recoloured through `homeContent.prism`; its filament
  shader is unchanged. IntersectionObserver and document visibility suspend
  its frame loop when the hero is off-screen or the tab is hidden. No runtime
  dependencies were added.
- **Responsive sizing:** standard 16px root and named fluid spacing/type tokens
  replace the fixed stage and `AdaptiveGrid` root-size scaling; the provider is
  no longer mounted. See [[decisions-log]] ADR-0013.
- **Preserved behavior:** spring-based DOM motion, protected animation engine,
  preloader counter width, CTA mask removal at rest, robot form, server-rendered
  consent, scene DPR 1.5 cap, desktop frame limiter and no gyroscope.
- **Documentation:** component catalog, design system, tech stack and
  optimization notes distinguish this authorized redesign from prior Cortex
  measurements. Those historical performance scores are not measurements of
  the redesigned page.

## 2026-10-06 — owner review 2 (D-036): the streaks follow the phone

- **Gyroscope** — `src/lib/scene/device-tilt.ts` (the pipeline's shared module)
  read in `prism-streaks.tsx`'s render loop and added to the cursor target the
  shader already eases: tilt x leans the bundle and slides the dust pool
  (×0.6 uv), tilt y moves the waist (×0.5 uv). Phones only; off for reduced
  motion and the robot form (no canvas there); iOS asks inside the first tap.
  Before a sensor reading: a slow idle sway. Desktop unchanged.
- Measured (local, load 7–10): mobile 90,99 (origin/main) → 96,99 (TBT 58–68
  ms), desktop 100; A11y/BP/SEO 100; phone scroll ideal both; fps-probe 120
  scene frames/s both.

## 2026-10-06 — owner review (D-033), branch `optimize/pass-2`

- **Brand kit + all required meta.** Mark `src/assets/brand/mark.svg` — the
  header's 2×2 tile (blue · white / white · blue) on the black ground, rounded
  square; `tools/scaffold-brand.mjs` generated `public/icon.svg`, favicon.ico
  (public + app), 16/32 PNGs, apple 180, android 36–192, icon-512, maskable,
  `manifest.json` ("Cortex", #000000) and `public/open-graph.jpg` (1200×630
  capture of the running hero after the preloader). `open-graph.png` removed.
  `site.ts`: `title` "Cortex — AI integration and automation for business",
  `ogImage`/`ogImageAlt`, `keywords`; generator: `applicationName`, keywords,
  OG 1200×630 + alt, Twitter image alt, `icon.svg` first; JSON-LD logo →
  `/icon-512.png`. Same head for people and Googlebot.
- **Full-screen mobile menu** (`src/components/hero/mobile-menu.tsx`, wired in
  `hero-mobile.tsx`, replacing the small dropdown): portalled to `<body>` at
  `z-[900]` (the hero's fixed `<main>` is a stacking context under the consent
  banner). A brand-blue sheet drops first and the black ground follows it
  (clip-path insets, the preloader's easeInOutQuart, exit faster), the burger
  lines morph into the cross on the same spring, numbered extralight
  display-type links rise out of masks (60 ms stagger, opacity 1), white
  "Get in touch" at the foot over the scene's blue scrim. Escape, focus in/back,
  Tab trap, `main` inert, scroll store stopped. All springs, no CSS transitions.

## 2026-10-05 — The prism streaks draw at most 60 fps on desktop (pipeline D-031) — uncommitted

Blamed by: the hosted desktop scroll flipping ideal/smooth (1.44 % / 4.26 %),
main thread idle — the full-screen streak shader redrawn every 8.3 ms tick of
the scroll test's 120 Hz panel.

- `src/components/hero/prism-streaks.tsx`: on desktop the loop draws only when
  12.5 ms have passed since the last drawn frame (a 60 Hz screen keeps every
  frame, a 120 Hz one draws every other tick). The time uniforms read the clock;
  the cursor lerp still steps every display tick, so its tracking speed is
  unchanged. Phones (coarse pointer or < 768 px) draw every tick, as before.
- Measured (local, interleaved vs an origin/main build, 2 rounds × 3 runs):
  desktop main janky (0.41 % / 7.21 %, then 15.1 % / 2.24 % with one 50 ms
  frame) → **ideal 0 % / 0 %** in both rounds; mobile ideal on both.
  Lighthouse (3 runs): desktop 100 = 100, mobile 96 → 99, A11y/BP/SEO 100.

## 2026-10-04 — Self-hosted fonts, server-rendered consent banner (optimize, pipeline D-029)

Measured locally, `next build` of this tree against `origin/main`, interleaved
Lighthouse (simulated mobile 4G / 4× CPU): mobile **88 → 96–99** (LCP 3.75 →
2.0–2.6 s, TBT ~110 → 70–80 ms), desktop 100 → 100; robot form 100 / 97;
scroll ideal on PC and mobile; A11y/BP/SEO 100.

- **Fonts are self-hosted (`next/font/local`).** A Vercel build failed with
  "Failed to fetch `Onest` from Google Fonts" — `next/font/google` downloads at
  build time. Onest and Inter now ship from `src/app/fonts/` as the same Google
  faces, Latin subsets (Basic Latin, Latin-1, typographic punctuation, arrows),
  the weight axis cut to what the design sets: Onest 400–700 (34 → 21 KB),
  Inter 200–500 (48 → 31 KB). Recipe in `layout.tsx`. No other
  `next/font/google` use in the project. Lighthouse-neutral (A/B 2 rounds).
- **The consent banner is server-rendered** (the pipeline's `scaffold-consent`):
  it was the phone's LCP element, painted only after hydration — Lighthouse
  billed it ~3.7 s. Now in the served HTML at rest, hidden before first paint
  for a visitor who already chose (`Cookie/consent-flag.ts`, an inline script
  as the first child of `<body>`, `html[data-consent]`) and on the robot form.
  Checked: first visit shows it, Accept removes it, a reload has it hidden at
  DOMContentLoaded, no console errors. Visible change: the banner (which sits
  above the preloader) appears with the first frame instead of fading in after
  hydration — on a phone it now covers the counter's corner from the start
  (it covered it from ~0.4 s before).
- **The header "touch" CTA reveals with a mask sweep, not an opacity fade**
  (`NavReveal` `sweep`, top→bottom, same spring and drop): half-faded, its dark
  label on white read 1.1–1.8:1 to a contrast check sampling the entrance
  (`axe-sweep` desktop, every run on `origin/main`; 0 in 3 runs now). The mask
  is set to `none` once the entrance ends (delay + 700 ms), so nothing stays
  masked over the animating scene for the visit.
- Tried and reverted: serving the hero copy at rest under the preloader curtain
  (`AtRestUnderLoader`) — the LCP was the banner, not the copy; with the banner
  server-rendered it cost the switch's remount (mobile 96 vs 99).

## 2026-10-06 — origin falls back to the Vercel production domain (D-019 backfill, D-034)
The live canonical and og:image said `http://localhost:3000` (no NEXT_PUBLIC_SITE_URL on the deploy, and the D-019 fallback had never reached this project), so share previews could not load the new card. `tools/scaffold-origin.mjs`: `env.ts` + `site.ts` now fall back to `VERCEL_PROJECT_PRODUCTION_URL`. Checked: tsc, verify 0 FAIL, a build with the variable set renders the right canonical + og:image.

## 2026-10-06 — gyroscope removed (owner, D-037)
The owner asked to remove the orientation animation from cortex: `0e8921d` reverted (`device-tilt.ts` deleted, `prism-streaks.tsx` back to the cursor-only input). Desktop and the robot form were never affected.
