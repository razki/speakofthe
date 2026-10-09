---
tags: [frontend, design-system, stable]
updated: 2026-10-09
---

# Design System — Tailwind v4

Styling uses **Tailwind CSS v4**, configured entirely in CSS. There is **no
`tailwind.config.js`**. ADR: [[decisions-log]] ADR-0004.

## Where config lives

The 2026-10-08 SPEAKOFTHE redesign uses a near-black burgundy ground, oxblood
accent, warm-white ink and muted warm text. Tokens come from the reduced
GetLayers Noir Vermillion direction, with the existing site's Montserrat block
headings. All values remain in `src/app/globals.css`; see [[components/hero]] and
[[decisions-log]] ADR-0013.

`src/app/globals.css` is the single config file:

```css
@import "tailwindcss";

:root {
  --background: #0d0506;
  --foreground: #f7eedf;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-general-sans), Arial, sans-serif;
  --font-display: var(--font-montserrat), Arial, sans-serif;
}
```

Extra CSS layers can be split into `src/style/index.css` and imported.

## Design tokens

All colours, spacing, font sizes, radii, and shadows are **tokens** declared under
`:root` (raw values) and `@theme inline` (Tailwind bindings).

Once a token is in `@theme`, it becomes a utility automatically:

| Token | Generated utilities |
|-------|--------------------|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--radius-card` | `rounded-card` |
| `--spacing-section` | `pt-section`, `mt-section`, … |

> [!important] The token rule
> **Never** hardcode hex values, pixel spacing, or named colours in `className` or
> inline styles. If a value doesn't exist as a token, **add it to `globals.css`
> first** — with a comment noting where it came from (e.g. a Figma frame).

## CSS layers

Every custom style goes inside a layer — never outside one:

```css
@layer base {        /* element resets & defaults: h1, p, a … */ }
@layer components {  /* pseudo-elements & 3rd-party overrides only — see below */ }
@layer utilities {   /* single-purpose helpers: .scrollbar-none … */ }
```

## Where a style goes (ADR-0012)

`globals.css` is **not** a place to park component styles — it holds tokens and
base resets and stays a few hundred lines forever. Follow this order; the first
match wins:

| Situation | Goes where |
|-----------|-----------|
| One-off styling | Tailwind utilities in `className` — nothing in CSS |
| Repeated pattern with markup / structure / props | a **React component** in `components/ui/` |
| Repeated *pure-utility* combo, no structure | a Tailwind v4 `@utility` |
| Pseudo-elements, 3rd-party DOM overrides, complex selectors | `@layer components` — the genuine exceptions |
| A new colour / spacing / radius value | a **token** in `:root` + `@theme` |

> [!important] The default answer to "this looks repeated" is a **React
> component**, not a CSS class. An eyebrow label with a `::before` dot is an
> `<Eyebrow>` component — not a `.label-eyebrow` global class. `@layer
> components` is for what utilities and components genuinely *cannot* express.

There are **no CSS Modules** in this project — utilities + components cover
every case (motion is spring-based, so there are no keyframes to co-locate).

## Current theme state

The site keeps its dark palette independent of the operating-system theme.
Primary active tokens are `hero-bg`, `hero-ink`, `hero-muted` and `brand`.
Services, About, Contact and footer share a continuous lower-content ribbon
background and use spacing instead of decorative divider lines or white outlines.
The sections themselves are transparent over the isolated media layer. Prism shader colours
are scene configuration values in `src/data/mocks/home.ts`, not duplicated
component styles.

The root is a standard **16px**. Fluid `clamp()` tokens supply `page-gutter`,
`section-space`, hero spacing and section/contact/display type sizes; the page
container is `site-width`. The former `AdaptiveGrid` root-font scaling provider
is no longer mounted. Normal responsive grids now reflow the page and preserve
readable text sizes. Use named tokens and Tailwind's spacing scale, not new
design-pixel coordinates. This change supersedes the earlier fixed 1440px stage.

The company ticker uses `client-*` spacing tokens for equal visible-edge gaps
and optical logo sizes. Measured source ink bounds remove intrinsic transparent
padding from layout without changing the source art or established optical
scale. This supersedes equal-width slots. A compact alpha-mask utility fades the
row edges; each original transparent logo masks the existing `hero-ink` colour.
Component layout stays in Tailwind utilities, with no borders or opaque section
background. See [[client-logos]].

The actual GetLayers Neon Ribbon Waves footage supplies the lower background's
motion. `--ribbon-opacity: 0.22` and `--ribbon-filter: grayscale(1) brightness(1.8)`
keep the treatment quiet; `ribbon-media` multiplies over a `brand` background
inside an isolated `ribbon-scene`. A top/bottom mask uses `section-space` to fade
the sticky viewport behind Services through the footer. These component-layer
rules implement media compositing; they do not animate the DOM or recolour the
source pixels. The local H.264 clip and WebP poster preserve the original motion,
with no additional dependency. Initial reduced-motion/robot views use only the
poster. See [[components/hero]] and [[decisions-log]] ADR-0016.

## Typography

**Montserrat 900** preserves the existing site's bold block headings/wordmarks
(`font-display`). The self-hosted **Montserrat 400** weight remains available,
but the owner removed the hero supporting paragraph on 2026-10-09.
**General Sans 400/500** supplies body and UI (`font-sans`,
bound to `--font-general-sans`), replacing the first redesign's Poppins. The
fonts are self-hosted WOFF2 files in `src/app/fonts/`, loaded with
`next/font/local` in `src/app/layout.tsx`; builds and visitors do not fetch fonts
from a third party. Onest/Inter are historical template fonts.

The single far-right Careers header link uses Montserrat 900 at the 13px
`text-nav` token on all viewport widths and targets local `/careers`. The hero
retains its display heading and wordmark without the former supporting paragraph.
The About introduction uses the display face with the fluid 16–20px
`text-about-intro` token. Other body/UI copy retains General Sans.

The independent-consultancy eyebrow and Services/About overline labels are
removed. Services vertically centers its heading beside the three-item list on
desktop. The wordmark and its location/year share a letter grid: the secondary
line sits tightly below, right-aligned to the E before the final dot. This uses
the wordmark's actual column geometry rather than viewport-specific positioning.

The visible `Get in touch` contact heading uses Montserrat 900 at
`text-service-title`. A fine line with a rightward traveling light leads toward
the right-aligned email reveal control, which replaces the removed location.
The control uses General Sans at the 12px `text-label` token, uppercase and wide
tracking. Once revealed, the address remains selectable plain text in that style;
there is no `mailto:` link.

The preloader uses stationary Montserrat 900 letters at `text-preloader-wordmark`
on the warm `preloader-bg`, with a spring mask filling the oxblood `brand` colour
left to right. Its compact `text-service-title` counter reserves its final width;
the previous tiles and oversized percentage treatment are retired. The
`z-preloader` token keeps its curtain above the page until dismissal. Imperative
spring values preserve the completed fill/counter throughout exit. The intro is
limited to a hard entry on home; client navigation back from Careers skips it.

Careers uses the actual GetLayers Coral Light Arc as bare full-bleed local
video/poster media. `--careers-arc-opacity: 0.2` and
`--careers-arc-filter: grayscale(1) brightness(1.35)` combine with multiply
compositing over the existing `brand` colour. This is a CSS presentation tint;
source colours and motion remain unchanged. The old radial-glow tokens are
removed. The existing Careers layout and no-vacancies message remain.

The contact direction cue remains spring-driven. Both decorative videos use
`useDecorativeMotion` to defer their source requests and pause inactive playback;
initial reduced motion renders only their posters. Positive viewport intersection
is required, not a zero-area edge touch. No CSS animation, new dependency or
additional scene renderer is introduced. See [[decisions-log]] ADR-0016.

## Styling rules

- Use utilities in JSX `className`; keep class strings short and readable.
- Extract a repeated pattern to a **React component** — not a `@layer
  components` class. See *Where a style goes* above (ADR-0012).
- Mobile-first responsive: `sm:` / `md:` / `lg:` / `xl:` prefixes.
- Dark mode: `dark:` prefix or token overrides in a `prefers-color-scheme` block.
- No inline `style` except for dynamic values (e.g. spring-animated values).

## Related

[[component-conventions]] · [[animation-system]] · [[new-page]]
