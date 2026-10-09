---
tags: [frontend, stable]
updated: 2026-10-09
---

# Catalog — Hooks

Custom hooks in `src/hooks/`, grouped by domain.

## `hooks/animation/` — `#do-not-modify`

The hooks powering the [[animation-system]]. Consume them through the spring
components — don't call them directly unless extending the engine.

| Hook | File | Role |
|------|------|------|
| `useInViewRef` | `use-in-view-ref.ts` | IntersectionObserver ref for viewport detection |
| `useDynamicInView` | `use-dynamic-in-view.ts` | in-view detection with dynamic targets |
| `useLoopInView` | `use-loop-in-view.ts` | in-view tied to a render loop |
| `useProgressTrigger` | `use-progress-trigger.ts` | scroll → 0–1 progress (powers `<SpringTrigger>` / `<ProgressTrigger>`); returns `progress` as a `RefObject<number>` — read `.current` |
| `useSpringTrigger` | `use-spring-trigger.ts` | scroll-driven spring logic |
| `useLoop` | `use-render-loop.ts` | subscribes a callback to the shared rAF ticker (`src/lib/animation/ticker.ts`) |
| `useResizeLoop` | `user-resize-loop.ts` | runs a callback when window width changes (via `useLoop`) |

## `hooks/smooth-scroll/`

| Hook | File | Role |
|------|------|------|
| `useScroll` | `use-scroll.ts` | Zustand store for Lenis + scroll state — see [[smooth-scroll]] |

## `hooks/` (root)

| Hook | File | Role |
|------|------|------|
| `useWindowWidth` / `useWindowHeight` / `useWindowSize` | `use-window-size.ts` | SSR-safe window dimensions — all three share **one** debounced (300 ms) `resize` listener via a `useSyncExternalStore` store |
| `useAdaptiveGrid` | `use-adaptive-grid.ts` | Scales the root `<html>` font-size up while the viewport exceeds `baseWidth` — powers `<AdaptiveGrid>`, see [[components/common]] |
| `useContactEmail` | `use-contact-email.ts` | Typed `idle` / `loading` / `error` / `revealed` state and user-triggered `POST /api/contact-email` request. Used by `ContactEmail`; see [[components/hero]] and [[api-architecture]]. |
| `useDecorativeMotion` | `use-decorative-motion.ts` | Shared reduced-motion/robot, viewport and tab-visibility gate for `ContactDirection`, `CareersBackground` and `RibbonBackground`. Returns `{ ref, motionOff, active }`. |
| `useInitialDocumentEntry` | `use-initial-document-entry.ts` | Captures SSR/hydration entry once so `CortexHero` shows the loader only on a hard document entry to home, never on subsequent client route mounts. |

`useContactEmail` returns `{ state, reveal }`. Only the `revealed` discriminated
state carries an email string. It requests `{ action: "reveal" }` through
`apiFetch`, with `cache: "no-store"` and same-origin credentials; duplicate calls
while loading or already revealed are ignored. Failures enter the retryable
`error` state. The presentational `ContactEmail` component receives typed display
labels, owns no fetching logic, and announces loading/results via a live region.
The hook never embeds the address in client source or receives it in page props.

`useDecorativeMotion` returns an `HTMLDivElement` ref for the observed decoration,
`motionOff` for reduced-motion or robot rendering, and `active` only when motion
is allowed, the element has positive visible area and the document is visible.
`useSyncExternalStore` supplies a stationary server snapshot so SSR/hydration
never starts an unguarded infinite loop. An IntersectionObserver and
`visibilitychange` listener update the gate without a per-frame callback and are
cleaned up on unmount. The observer uses `threshold: 0.001` and requires
`isIntersecting && intersectionRatio > 0`; a zero-area viewport-edge touch stays
paused. Both `RibbonBackground` and Careers' Coral Light Arc video start without
a source and request it only when this gate becomes active. They pause while
inactive and on cleanup; initial reduced motion stays poster-only. The hook's
robot-context gate also preserves poster-only output wherever that context is set.
Spring consumers guard each loop callback with `motionOff` and `Globals.skipAnimation`
to prevent immediate recursive loops after robot navigation, and pause while
`!active`; they render a quiet static treatment for reduced motion/robots. Do not
rely on global react-spring `skipAnimation` alone, which can restart a loop.

`useInitialDocumentEntry` uses constant `useSyncExternalStore` snapshots: `true`
for server rendering and hydration, `false` for client rendering. A state value
captures the first snapshot for that component mount, so the post-hydration
snapshot update cannot dismiss an in-progress intro. A client route mount reads
`false` immediately, including Careers→home after entering directly on Careers.
Hard home reloads read `true` again. It needs no mutable global, browser storage,
pathname effect or persistent root provider and keeps SSR/hydration markup equal.
The preloader's imperative `useSpringValue` phase lifecycle is documented in
[[components/hero]] and [[decisions-log]] ADR-0016.

> [!note] Shared render loop
> Loop-based hooks (`useLoop`, `useResizeLoop`, `useLoopInView`, the trigger
> hooks) all subscribe to the single app-wide ticker in `src/lib/animation/ticker.ts`
> rather than each starting their own `requestAnimationFrame`. See
> [[animation-system]]. The ticker is **not** `#do-not-modify`.

## Adding a hook

Place it under `hooks/<domain>/`. Data-fetching logic belongs in hooks, not in
presentational components. Use [[templates/hook-note]] to document it here.

## Related

[[animation-system]] · [[smooth-scroll]] · [[utils]]
