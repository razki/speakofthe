---
tags: [frontend, components, animation]
updated: 2026-10-09
---

# Client logos

`src/components/hero/client-logos.tsx` adds the owner-requested company strip
between Services and About. The GetLayers `vexon-marquee` composition and
Vexon's `src/components/ui/loops.tsx` supplied the single-row, two-copy spring
loop. The existing Cortex style, off-white ink and continuous burgundy ground
remain; the reference's divider and hover colour changes are omitted.

`HomeView` supplies `clientLogosContent` from `src/data/mocks/clients.ts` through
`StudioSections`. `ClientLogosProps` and `ClientLogosContent` type the component,
company names, local asset URLs, optical format, source dimensions, measured
non-transparent bounds, accessible labels and 80-second cycle duration. The
company relationships are owner-supplied experience.

## Layout and motion

- **Owner amendment, 2026-10-09:** spacing is equal between the visible logo
  edges, superseding the former equal-width slots. Each list item now hugs its
  mark's measured non-transparent bounds. A shared `client-gap` separates them;
  the `client-height`, fade and optical format tokens remain in use.
- Further owner review widens `client-gap` to `clamp(36px, 5vw, 80px)`:
  the desktop gap increases from 64px to 80px while every pair and the loop
  seam retain equal spacing. Optical logo sizes are unchanged.
- Source dimensions and `ink` bounds in `clients.ts` size/position the original
  mask to remove intrinsic transparent padding. Dynamic `width` and
  `aspect-ratio` keep the exact prior contain-scale optical size, while the list
  item's width becomes its visible mark width. Wide, compact and square formats
  remain undistorted and keep their established size balance. The former
  `client-slot` token is no longer used by this component.
- Original transparent assets are alpha masks over `hero-ink`, giving every
  mark exactly the same off-white colour without recolouring source artwork.
- Two identical lists include the same trailing gap. A linear react-spring
  transform moves the track from zero to minus 50%, then repeats seamlessly.
  Rendering consumes the protected engine's `AnimatedVarTextTag` through a
  typed `animated()` adapter. No engine files or dependencies changed.
- IntersectionObserver and document visibility pause off-screen/hidden motion;
  hovering the logos also pauses. A labelled, keyboard-operable pause/play
  button provides a persistent manual pause, including on touch devices.
- Reduced motion and robot views show all eight logos as one wrapping static
  list. Reduced-motion utility variants cover the server-rendered first paint.
  Loops are disabled, preventing react-spring's global skip-animation setting
  from repeatedly restarting a zero-duration animation.
- A named section and list expose every company once. Repeated visual content
  is `aria-hidden`; masked artwork has adjacent visually hidden company names.
- The section has no opaque background, allowing the shared lower-page burgundy
  decoration to continue behind it.

## Visible-edge measurements

Source alpha bounds were measured on 2026-10-09 with Sharp: native bitmap
resolution and SVGs rasterized at 8× density, including every nonzero-alpha
pixel. Source files remain unmodified. Bounds use source-pixel coordinates:

| Company | Source width × height | Ink x, y, width, height |
|---------|-----------------------|------------------------|
| Sky Bet | 284 × 90 | 4, 4, 275, 82 |
| DAZN | 120 × 120 | 0, 0, 120, 120 |
| Gamma Telecom | 284 × 64 | 0, 0, 283.5, 63.625 |
| Transport for Greater Manchester | 235 × 60 | 0, 1, 235, 59 |
| Fanatics Markets | 135 × 16 | 0, 0, 135, 16 |
| Data Edge Analytics | 150 × 26 | 0, 0, 149.25, 26 |
| CreateFuture | 988 × 140 | 0, 0, 987.5, 139.625 |
| Apergy | 424 × 233 | 6, 7, 413, 217 |

The `logoMaskStyle` helper sets mask size to source/ink dimensions and positions
the enlarged mask so the ink begins at the element's left/top edge. The resulting
visible width equals the item width, so normal flex `gap` is also the visible-edge
gap. Geometry checks cover 320, 390, 768, 1440, 1593 and 1920px viewports, every
adjacent pair and the two-list seam: all gaps match `client-gap` to floating-point
precision. Evidence is `tmp/qa/logo-spacing/geometry.json`; SVG boundary precision
is one eighth of a source pixel, before normal browser rasterization.

For browser verification, pause the ticker and compare consecutive
`.client-logo-mark` bounding boxes within `.client-logo-track`: each next left
minus previous right should equal the computed list `column-gap`, including the
last mark of the first list and the first mark of the duplicate. Confirm the two
list widths match, then resume to check the seamless reset. Reduced/robot wrapping
lists use the same marks and gap calculation.

## Asset provenance

Downloaded from the companies' own sites on 2026-10-08. Assets live under
`public/assets/clients/`; the page makes no external image requests. Source
artwork is unmodified. The DAZN SVG is extracted from the official inline logo.

| Company | File | Official source |
|---------|------|-----------------|
| Sky Bet | `sky-bet-mono.png` | [Flutter media-library white variant](https://flutter.com/media/1y0jngu1/skybet-light-v.png) |
| DAZN | `dazn.svg` | [DAZN](https://www.dazn.com/), `.dzn-ldr-anmtn__logo` inline SVG |
| Gamma Telecom | `gamma.svg` | [Gamma header logo](https://gammagroup.co/wp-content/themes/gamma/dist/images/gamma-logo.svg) |
| Transport for Greater Manchester | `tfgm.png` | [TfGM travel portal logo](https://travelplantoolkit.tfgm.com/images/tfgm-header-logo.png) |
| Fanatics Markets | `fanatics-markets.svg` | [Fanatics Markets](https://fanaticsmarkets.com/logos/fanatics-markets.svg) |
| Data Edge Analytics | `data-edge-analytics.svg` | [Data-Edge Analytics Ltd](https://data-edge.co.uk/_astro/DEA_Website_Logo.Ciwr8kYU_2r1KKM.svg) |
| CreateFuture | `createfuture.svg` | [CreateFuture](https://createfuture.com/hubfs/create-future-logo.svg) |
| Apergy | `apergy.webp` | [Apergy Solutions Ltd](https://apergy.co.uk/_next/static/media/logo-dark.0efa5ee2.webp) |

The unused `sky-bet.png` is an alternate [official primary colour logo](https://flutter.com/media/h41f2mgk/sky_bet_primary_rgb_new-1.png).
Apergy is the UK software consultancy, and Fanatics Markets uses its specific
Markets wordmark rather than the parent Fanatics logo.

## Related

[[hero]] · [[animation-system]] · [[design-system]] · [[optimization-history]]
