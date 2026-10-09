---
tags: [architecture, decision]
updated: 2026-10-09
---

# Decisions Log

The vault referenced earlier ADR numbers through ADR-0012, but their source
decisions-log file was absent when this note was created. Those decisions are not
reconstructed here. Existing references and documented constraints remain in
their topic notes and [[optimization-history]].

## ADR-0013 — Scrollable SPEAKOFTHE redesign and responsive sizing

- **Status:** Accepted
- **Date:** 2026-10-08

**Context.** The owner requested a minimalist dark-red adaptation of the prism
template, incorporating the content and block font from `speakofthe.com`. The
original page used a fixed-screen hero, separate desktop/mobile stages and
viewport-dependent root-font scaling. The verified service and company content
requires a readable page beyond the first screen.

**Decision.** Keep the existing prism shader and spring animation system, while
making the hero a relative section in normal document flow. The server
`HomeView` owns the sole main landmark and renders the client hero plus server
`StudioSections`. `home.ts` supplies hero/scene content; `studio.ts` supplies
Services, About, Contact and footer content verified from the source site. The
owner's subsequent correction — established in 2020, North Yorkshire — takes
precedence over the imported site's year and location.

Use one responsive `hero-content.tsx`, with the header/menu breakpoint at `md`,
and fluid Tailwind tokens on a standard 16px root. Retire the separate fixed
desktop/mobile stages and stop mounting `AdaptiveGrid`; leave protected
animation components/hooks untouched. Use self-hosted Montserrat 900 and
Poppins 400/500 Latin WOFF2 through `next/font/local`. Keep normal Next Link
navigation and the accessible portalled mobile menu. Contact uses the verified
email address, and Careers links to the existing public page.

**Owner-review amendment, 2026-10-08.** The initial typography/navigation decision
above is superseded in these respects: General Sans 400/500 replaces Poppins;
the header now has only the far-right Careers link on all widths, with no
mounted hamburger or mobile menu. Explicitly removed CTAs and decorative
dividers remain removed. Services/About content stays, About shares the page
background, and Contact is compact email/location content. Supporting menu and
CTA-sweep code remains unused; the protected engine is unchanged.

**Consequences.** The page can carry real company content and working anchor
navigation at readable sizes across viewports. The prism frame loop pauses
when the hero leaves view or its tab is hidden. Existing DPR/frame limits,
robot rendering, consent behavior, preloader counter width and no-gyroscope
constraints remain. No runtime dependency was added. Prior Cortex performance
measurements stay historical and need fresh validation for any new claims.

## ADR-0014 — Owner annotations, local careers and deliberate email reveal

- **Status:** Accepted
- **Date:** 2026-10-08

**Context.** The owner supplied twelve browser annotations refining the page's
labels, typography, alignment and copy. They also requested a local careers
status page and removal of the public `mailto:` link to reduce unsolicited
contact from address scraping.

**Decision.** Remove the independent-consultancy eyebrow and Services/About
overlines. Center the hero supporting paragraph and use compact Montserrat 900
for that text (14–17px) and the About introduction (16–20px). Center the Services
heading beside its list; share the wordmark's letter grid with the location/year
line so its right edge ends at the E. Use the owner's supplied sectors and
maintain/uplift/design paragraph verbatim. Both Careers links now target
`/careers`, a Server Component view with a no-vacancies message, dedicated
metadata and sitemap entry.

Replace the large contact address and location with a small uppercase,
right-aligned `ContactEmail` client leaf. It accepts typed labels from
`studioContent`, while `useContactEmail` owns a discriminated state and the
user-triggered request. Keep the address in a `server-only` data module, outside
initial page props/HTML, JSON-LD and browser bundles. A same-origin
`POST /api/contact-email` validates strict zod input, checks Origin/fetch-site
headers, and uses the shared `{ data }` / `{ error }` envelope. Request and
response caching are disabled. The returned address is selectable plain text,
with loading/retry/live-region feedback and no `mailto:` action.

**Consequences.** Casual page-source and bundle scraping no longer exposes the
address; visitors must reveal it. The endpoint remains callable by an automated
client that reproduces the headers/body, so this is a scraping deterrent rather
than authentication or bot-proof protection. The feature does not send messages
or introduce a contact form, upstream service, dependency, or animation-engine
change. Earlier ADR-0013 references to external Careers and direct contact email
are superseded. `yarn lint` and production build pass for this revision; browser
verification is tracked separately in [[changelog]].

## ADR-0015 — Brand-fill loader and restrained decorative motion

- **Status:** Accepted
- **Date:** 2026-10-08

**Context.** The owner requested lighter hero supporting text, a preloader that
fills the brand letters, a visible contact prompt directing attention to the
email control, and an animated Careers background that fits the dark-red design
without overpowering its message.

**Decision.** Add a real self-hosted Montserrat 400 Latin WOFF2 and use that
weight for the centered 14–17px hero paragraph. Retain Montserrat 900 for headings
and the About introduction. Replace the loader tiles/giant percentage with
stationary `SPEAKOFTHE` letters and a spring-driven left-to-right clip mask,
configured by `homeContent.preloader` (3.4s fill, 250ms hold, 850ms lift). Keep a
small counter with reserved final width. This is a graphic progress mask rather
than split-glyph text animation, consistent with the existing wordmark-gradient
exception; consume `AnimatedVarTextTag` without editing the spring engine.

Expose `Get in touch` as the contact `h2`, with a spring-driven traveling light
along a fine right-pointing line toward the existing email reveal control.
Add only broad, low-opacity burgundy radial glows to Careers, slowly drifting
behind its dark center. Keep both effects in client leaves with typed motion
configuration in content data; the surrounding views/sections stay server-side.
`useDecorativeMotion` shares reduced-motion/robot, intersection and document
visibility checks. Its stationary server snapshot prevents a hydration-time
loop; consumers disable looping for motion-off states and pause when inactive.

**Consequences.** The loader retains fixed-width-counter stability, reduced-motion
bypass and robot omission. Cancellation guards, timer cleanup and fallback
dismissal prevent a stopped spring from trapping the page. Decorative effects
render static under reduced motion/robot conditions and pause outside the viewport
or in hidden tabs. No runtime dependency, WebGL scene or protected-engine edit
is added. The earlier Montserrat 900 hero-paragraph and hidden contact-heading
choices are superseded; the email's server-only reveal boundary is unchanged.
This amendment does not establish new performance or browser-QA results.

## ADR-0016 — Stable entry intro and a shared lower-content media background

- **Status:** Accepted
- **Date:** 2026-10-09

**Context.** The loader reached 100 and then reset to zero before lifting, and
returning from Careers replayed the full intro. The owner also removed the hero
supporting paragraph, requested visually even company-logo gaps and asked for
GetLayers ribbon motion behind the lower page in the established red palette.

**Decision.** Use imperative `useSpringValue` instances for preloader progress
and lift. The installed `useSpring` implementation can replay retained initial
declarative targets from its layout effect on rerender; adding an empty dependency
array alone does not remove that target. Keep an explicit loading/exiting/hidden
phase, pin progress to 100 before exit, notify the hero once and preserve timer,
listener and spring cleanup. `useEffectEvent` keeps the reveal callback current
without restarting the effect when its caller rerenders. Reduced motion exits
immediately; StrictMode effect replay resumes the phase instead of resetting it.

The small `useInitialDocumentEntry` hook captures `useSyncExternalStore`'s first
snapshot in state: the server/hydration snapshot is true and the client snapshot
is false. Thus a hard home entry keeps matching server/hydration markup and plays
the intro, while any later client mount starts directly, including a direct
Careers entry followed by home. Do not add a root provider, storage or mutable
browser-global render check for this behavior. The hero supporting paragraph is
removed; previous ADR-0015 styling for that paragraph is superseded.

Replace equal ticker slots with widths derived from measured source ink bounds,
preserving original artwork and optical scale. One shared `client-gap` governs
every visible-edge gap and the repeated-list seam. The existing spring loop,
pause controls and reduced-motion/robot wrapping list remain; see [[client-logos]].

Use the actual unwatermarked GetLayers Neon Ribbon Waves clip as local H.264
1440×1080 media (1,547,117 bytes), with a local 42,550-byte WebP poster. Preserve
the original animation. Theme-only grayscale/brightness and multiply compositing
over brand red at 22% opacity provide the colour treatment without recolouring
source pixels. `RibbonBackground` is a decorative, pointer-transparent client
leaf configured by `src/data/mocks/ribbon-background.ts`. `HomeView` places it in
an isolated wrapper around lower content; a sticky viewport runs through the
footer behind transparent sections. Original downloads remain archived in
`tmp/qa/ribbon-review/`.

Render the video initially without `src`, with `preload="none"`. Request and play
it only while the shared `useDecorativeMotion` gate is active, and pause it
off-screen/in hidden tabs. Initial reduced-motion/robot views are poster-only.
The observer now uses threshold 0.001 and requires both intersection and positive
intersection ratio; zero-area edge touches must stay paused.

**Consequences.** The loader counter no longer reverses during exit, and client
navigation does not replay the document intro. Lower-page decoration uses the
source media's motion with no DOM animation, new dependency or renderer. The
video is 1,547,117 bytes when requested, while motion-disabled entry avoids that
request. Existing shader limits, protected spring engine, counter-width stability
and server-only email reveal boundary remain in force. Browser checks found no
horizontal overflow at 320px, uniform 63.729px gaps across all 15 desktop ticker
boundaries, monotonic loader progress over 582 samples with exit fixed at 100,
and no loader in either Careers return scenario. Deferred loading/play/pause and
reduced-motion static output were verified with a clean browser console. Final
`yarn lint`, production build and contact HTTP checks pass. These are functional
checks, not new Lighthouse/performance measurements.

**Careers media amendment, 2026-10-09.** Apply the same local-media and
visibility-gating approach to the owner's requested GetLayers Coral Light Arc.
`CareersBackground` replaces ADR-0015's spring glows with bare full-bleed
video/poster media configured by typed `careersContent.background` URLs. The
local H.264 clip is 1440×1080, 30fps, 4.0667 seconds and 529,246 bytes with audio
removed; the poster is 44,640 bytes. Preserve source colours/motion and tint only
the presentation using grayscale/brightness, brand-red multiply compositing and
20% opacity. Keep deferred source loading, inactive/unmount pause and poster-only
initial reduced motion. Remove obsolete glow tokens; keep the existing Careers
layout/copy. Original downloads live in `tmp/qa/coral-arc/`. This reuses the
existing hook and media pattern without a new abstraction or dependency.

## ADR-0017 — Owner-directed prism centerline bow

- **Status:** Accepted
- **Date:** 2026-10-09

**Context.** The owner supplied a broad right-facing bow reference for the hero
strands, explicitly overriding the earlier requirement to leave the scene path
unchanged.

**Decision.** Add typed `PrismConfig.arc` anchors in `home.ts` and remap only the
horizontal coordinate entering the shader's `field()`. Two cosine-eased legs
join top x=0.48 to peak x=0.84 at y=0.48, then return to x=0.54 by y=0.90, using
normalized top-down coordinates. Blend the peak from portrait x=0.74 to desktop
x=0.84 over aspect ratios 0.7–1.4. Account for aspect ratio and the existing
breathing scale in the offset.

**Consequences.** The bundle follows the requested bow while retaining the
original filament equations, animated flow, widths, colours, dust and cursor
behavior. DPR/frame limits, visibility suspension, robot omission and the
protected spring engine remain. No dependency or additional scene is introduced.
This amendment changes only the authorized strand path and does not establish
new performance measurements.

## ADR-0018 — Next runtime migration while retaining the AWS edge

- **Status:** Accepted implementation; AWS deployment pending
- **Date:** 2026-10-09

**Context.** The owner wants the completed Cortex-derived site in the existing
SPEAKOFTHE repository. Its POST contact reveal and crawler Proxy require a Next
runtime; the old CRA S3-only deployment cannot serve these features unchanged.
The public repository must not commit the contact address.

**Decision.** Use Next standalone output, Node 22 and Lambda Web Adapter ZIP
packaging. A separate runtime Terraform state/provider creates the private
release bucket, Lambda and preview/live HTTP APIs. Keep the legacy edge state,
AWS provider 3.35.x, DNS, buckets and certificate. The preview invokes a candidate;
promotion moves the live alias only after smoke checks. Failure recovery restores
the saved alias version and CloudFront configuration, checking propagation and
invalidation. The guarded edge plan allows only an in-place root CloudFront update. HTML/RSC/API traffic bypasses
caching; existing S3 serves static bundles/media without deleting older assets.

Pin Yarn 1.22.22 and CI Terraform 1.13.5. Preserve automatic deployment after
validation on every direct master push; no PR or deployment variable is required.
Branch/PR runs validate only. Retain manual runtime/production dispatch and the
GitHub production environment. Use the owner's existing GitHub AWS credential
secrets; OIDC is optional. No AWS access preflight or credential inspection is
part of local preparation. Preserve a pre-upgrade Terraform 0.14 state backup;
state/provider migration is not implicit in this release.
Retain a scoped, self-unregistering cleanup worker at `/service-worker.js` for
returning CRA clients. No new worker registration or fetch handler is introduced.

Read optional `CONTACT_EMAIL` only from validated server environment; missing
configuration returns 503. Compare reveal Origin against configured public
`NEXT_PUBLIC_SITE_URL` so internal proxy host/protocol changes do not reject
legitimate requests. Keep strict payload/fetch-site checks, no-store responses,
GET 405 and the existing plain-text reveal UI. The address is supplied through a
production secret and also resides in sensitive Terraform state, never source.

**Consequences.** The visual/animation implementation is preserved without an
app dependency change. Delivery now needs reviewed AWS permissions and state,
Linux packaging and candidate/public smoke checks. Plan guards and rollback are
safeguards, not evidence that the live account is ready. Local tests, lint/build
and offline infrastructure/workflow validation pass; AWS deployment and its real
plan remain unverified. Linux validation CI also passes packaging and standalone
smoke; its AWS job was skipped. [[aws-deployment]] catalogs scripts, recovery
evidence and the current validation status.

## Related

[[components/hero]] · [[design-system]] · [[tech-stack]] · [[changelog]] ·
[[optimization-history]]
