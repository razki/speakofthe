---
tags: [architecture, stable]
updated: 2026-10-09
---

# Tech Stack

Every dependency in `package.json`, what it does, and why it is here.
Package name: `speakofthe` · version `0.1.0` · private.

The current site is **SPEAKOFTHE.**, a software consultancy. The 2026-10-08
redesign changed content, visual tokens and local font assets; it introduced no
package dependency changes. GetLayers supplied palette/composition references,
not an additional runtime package.

## Core framework

| Package | Version | Role |
|---------|---------|------|
| `next` | `16.2.0` | App Router framework. ⚠️ See warning below. |
| `react` / `react-dom` | `19.2.4` | UI runtime |
| `typescript` | `^5` | Type system — `any` is banned |

> [!warning] This is not the Next.js you may know
> `AGENTS.md` warns: APIs, conventions, and file structure may differ from older
> Next.js knowledge. Always check [[routing]] before writing routing code, and
> heed deprecation notices.

## Styling

| Package | Version | Role |
|---------|---------|------|
| `tailwindcss` | `^4` | Utility CSS — **no `tailwind.config.js`** |
| `@tailwindcss/postcss` | `^4` | PostCSS integration |

Tailwind v4 is configured entirely in `src/app/globals.css` via `@theme inline`.
See [[design-system]].

Typography uses `next/font/local`: Montserrat 400/900 (`font-display`) and General
Sans 400/500 (`font-sans`, via `--font-general-sans`), self-hosted WOFF2 assets in
`src/app/fonts/`. General Sans replaces the first redesign's Poppins following
owner review; Montserrat preserves the source website's block typography.
`montserrat-regular-latin.woff2` adds the real 400 weight for the lighter hero
supporting paragraph: an 18,780-byte Latin WOFF2 from the official Google Fonts
Montserrat v31 distribution, stored alongside the existing local 900 weight.
No font runtime dependency or network fetch was added. The root is 16px with
fluid CSS tokens; `AdaptiveGrid` is no longer mounted in the root layout
(ADR-0013).

## Animation (the heart of the starter)

| Package | Version | Role |
|---------|---------|------|
| `@react-spring/web` | `^10.0.3` | Spring physics — drives **all** motion |
| `spring-text-engine` | `^0.1.5` | Scroll-aware spring text animation |

No `framer-motion`, no CSS transitions/keyframes. See [[animation-system]] and
[[text-engine]]. ADR: [[decisions-log]] ADR-0002.

The wordmark-fill preloader and contact direction light reuse react-spring and
the engine's `AnimatedVarTextTag` primitive. Careers and lower-content backgrounds
now use local video/poster media. `useDecorativeMotion` gates decorative playback
for viewport, visibility, reduced motion and robot rendering. The vendored engine
remains unchanged; see ADR-0016 and [[hooks]].

## 3D / WebGL

| Package | Version | Role |
|---------|---------|------|
| `three` | `^0.180.0` | WebGL renderer for the SPEAKOFTHE hero's inherited Prism Streaks fragment-shader background (`src/components/hero/prism-streaks.tsx`). `@types/three` in dev deps. |

> [!note] Why a non-spring animation here
> The prism background is a GLSL fragment shader driven by its own `requestAnimationFrame`
> loop — it is a **canvas effect, not DOM motion**, so it sits outside the
> spring/CSS-motion system by necessity (react-spring cannot drive a shader).
> All *DOM* motion in the hero (preloader, entrances, wordmark) remains
> spring-based. See [[components/hero]].

## Scroll & state

| Package | Version | Role |
|---------|---------|------|
| `lenis` | `^1.3.19` | Smooth scrolling |
| `zustand` | `^5.0.12` | Lightweight global state (scroll store) |
| `resize-observer-polyfill` | `^1.5.1` | ResizeObserver fallback for animation hooks |
| `zod` | `^4.4.3` | Schema validation — env (`src/env.ts`) + API payloads. See [[api-architecture]] |

See [[smooth-scroll]] and [[data-flow]].

## Misc

No miscellaneous runtime dependencies. Cookie consent is an in-house component
(`src/components/common/Cookie/`) built on Zustand + `@react-spring/web` — the
former `react-cookie-consent` package was removed. See [[components/common]].

## Tooling

| Package | Role |
|---------|------|
| `eslint` `^9` + `eslint-config-next` | Linting — run `yarn lint` before commits |
| `@types/*` | Type definitions for node/react |

## Scripts

```bash
yarn dev      # next dev — local development
yarn build    # next build — production build
yarn start    # next start — serve production build
yarn lint     # eslint
yarn test:deployment  # Node tests for app/deployment guards
yarn package:lambda   # Linux standalone ZIP + public asset archive
yarn smoke            # HTTP smoke checks against SMOKE_BASE_URL
```

Package manager: **Yarn 1.22.22**, pinned in `packageManager`; `yarn.lock` is the
only package lock. CI uses Node **22** (package engines permit `>=22 <25`). The
migration changes no app dependency. Next standalone output is packaged with the
external AWS Lambda Web Adapter layer, not an added npm runtime package.
Terraform 1.13.5, isolated AWS provider 6.20.0 for runtime and legacy provider
3.35.x for the existing edge stack are documented in [[aws-deployment]].

## Not yet in the stack

Auth, database/ORM, payments, i18n, data-fetching libraries. The original starter
spec listed these as "add as needed" placeholders. Document them here when adopted,
and add an ADR to [[decisions-log]].

## Related

[[system-overview]] · [[folder-structure]]
