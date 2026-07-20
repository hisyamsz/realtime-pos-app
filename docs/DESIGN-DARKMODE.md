---
version: alpha
name: Nike-design-analysis-dark
description: |
  Dark mode variant of the Nike commerce system. The same extreme typographic
  contrast and pill-first retail chrome survive the inversion untouched —
  only the surface/text polarity flips and the semantic accents are re-tuned
  for luminance on a near-black canvas. Photography stays the system's only
  source of color and depth; the chrome remains a two-tone (near-black /
  near-white) skeleton with a single elevated dark-gray surface standing in
  for the light mode's soft-cloud stage.

colors:
  primary: "#ffffff"
  on-primary: "#111111"
  canvas: "#111111"
  soft-cloud: "#1c1c1e"
  ink: "#ffffff"
  charcoal: "#e4e4e6"
  ash: "#c7c7c9"
  mute: "#9e9ea0"
  stone: "#707072"
  hairline: "#3a3a3c"
  hairline-soft: "#2c2c2e"
  sale: "#ff4d4f"
  sale-deep: "#ff8a8b"
  success: "#30d158"
  success-bright: "#6ee68a"
  info: "#5c8aff"
  info-deep: "#8fabff"
  accent-pink: "#ff4dc4"
  accent-pink-soft: "#ffb0dd"
  accent-purple-soft: "#c9bbff"
  accent-purple-pale: "#a89bfd"
  accent-teal: "#3fb6c9"
  accent-pink-deep: "#ff9fd6"

typography:
  display-campaign:
    fontFamily: Nike Futura ND
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: 0
    textTransform: uppercase
  heading-xl:
    fontFamily: Helvetica Now Display Medium
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-lg:
    fontFamily: Helvetica Now Display Medium
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-md:
    fontFamily: Helvetica Now Display Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0
  body-md:
    fontFamily: Helvetica Now Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: Helvetica Now Text Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button-lg:
    fontFamily: Helvetica Now Display Medium
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  button-md:
    fontFamily: Helvetica Now Text Medium
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button-sm:
    fontFamily: Helvetica Now Text Medium
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  link-md:
    fontFamily: Helvetica Now Text
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0
    textDecoration: underline
  caption-md:
    fontFamily: Helvetica Now Text Medium
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  caption-sm:
    fontFamily: Helvetica Now Text Medium
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  utility-xs:
    fontFamily: Helvetica Neue
    fontSize: 9px
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: 0

rounded:
  none: 0px
  sm: 18px
  md: 24px
  lg: 30px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 24px
  xxl: 30px
  section: 48px

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 16px 32px
    height: 48px
  button-outline-on-image:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-icon-circular:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 40px
  search-pill:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 40px
  search-pill-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  form-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 16px
    height: 48px
  form-input-focused:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  badge-promo:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.full}"
    padding: 4px 12px
  badge-sale-text:
    textColor: "{colors.sale}"
    typography: "{typography.caption-md}"
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    padding: 0px
  product-card-image:
    backgroundColor: "{colors.soft-cloud}"
    rounded: "{rounded.none}"
  swatch-dot:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 12px
  swatch-dot-active:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 12px
  campaign-tile:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-campaign}"
    rounded: "{rounded.none}"
  category-icon-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
  member-benefit-card:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.on-primary}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.none}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.heading-md}"
    rounded: "{rounded.none}"
    padding: 24px 0px
  pdp-disclosure-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    padding: 24px 0px
  utility-bar:
    backgroundColor: "{colors.soft-cloud}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.none}"
    height: 36px
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
    height: 56px
  filter-sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.none}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
---

## Overview

Dark mode is a straight polarity flip, not a redesign. Every token name from the light system carries over unchanged — `{colors.ink}`, `{colors.canvas}`, `{colors.soft-cloud}` — only their hex values invert. `{colors.ink}` is now `#ffffff` and does the same job it always did (primary text, primary CTA fill, active states); `{colors.canvas}` drops to `#111111` and still means "page background." The one structural change is that `{colors.soft-cloud}` — the product-photo stage — becomes a lifted dark gray (`#1c1c1e`) rather than a lifted light gray, because product photography still needs a surface that reads as _slightly_ separated from true black.

Semantic colors (`{colors.sale}`, `{colors.success}`, `{colors.info}`) are re-tuned brighter and slightly desaturated so they hold WCAG contrast against `#111111` instead of `#ffffff`. Category accents keep roughly the same hue family but lift in lightness for the same reason. Typography, spacing, radii, grid, and breakpoints are untouched — dark mode never changes rhythm or shape, only luminance.

**Key Characteristics:**

- Full polarity inversion of the two-tone chrome: `{colors.canvas}` `#111111` / `{colors.ink}` `#ffffff`, everywhere the light system used white-on-black it's now black-on-white and vice versa
- `{colors.soft-cloud}` becomes a lifted dark surface (`#1c1c1e`) — one step brighter than canvas, same role as before: product backdrop, search pill, secondary CTA, utility bar
- Primary CTA is now a white pill on dark surfaces (`{component.button-primary}` inherits `{colors.ink}` = white); it still never doubles up with `{component.button-secondary}` on the same fold
- Hairlines lighten from `#cacacb`/`#e5e5e5` to `#3a3a3c`/`#2c2c2e` — same 1px-divider role, tuned to stay visible without glowing
- Semantic accents (`{colors.sale}`, `{colors.success}`, `{colors.info}`) shift brighter/lighter to hold contrast on `#111111`; hue identity (red/green/blue) is preserved so the meaning doesn't change across modes
- Photography is still the only place saturated color and depth live — dark mode does not add glow, gradient, or shadow to compensate for the darker chrome
- Sale signaling stays background-free: brighter `{colors.sale}` text + strike-through `{colors.mute}` original, no badge container

## Colors

### Brand & Accent

- **Nike White** (`{colors.ink}` — `#ffffff`): Inherits every job `{colors.ink}` did in light mode — primary CTA fill, active filter chip, active swatch ring, headline color, body text. In dark mode this is the color that asserts.
- **Near Black** (`{colors.canvas}`, `{colors.on-primary}` — `#111111`): The dominant background and the inverse text color sitting on white pills. Not pure `#000000` — Nike's dark surfaces stop just short of true black so photography and white text both keep separation from the edge.

### Surface

- **Soft Cloud Dark** (`{colors.soft-cloud}` — `#1c1c1e`): The dark-mode equivalent of the light system's product-photo stage. One perceptual step above canvas — enough to read as a distinct surface (search pill, secondary CTA, utility bar, product card backdrop) without competing with photography for attention.
- **Hairline** (`{colors.hairline}` — `#3a3a3c`): 1px dividers — filter rows, footer columns, PDP disclosure rows. Tuned to sit clearly above `{colors.canvas}` without reading as a glow.
- **Hairline Soft** (`{colors.hairline-soft}` — `#2c2c2e`): Inset shadow-line under sticky bars and tab strips — the system's only "shadow," now a subtle lighter-than-canvas edge instead of a darker one.

### Text

- **Ink** (`{colors.ink}` — `#ffffff`): Primary text on dark surfaces — headlines, product names, prices, nav.
- **Charcoal** (`{colors.charcoal}` — `#e4e4e6`): Slightly softer body where full white is too heavy.
- **Ash** (`{colors.ash}` — `#c7c7c9`): Secondary border/text on light-inverted surfaces and low-emphasis utility copy.
- **Mute** (`{colors.mute}` — `#9e9ea0`): Product category subtitles, footer link text, secondary metadata — held close to the light-mode value since mid-gray reads similarly against both extremes.
- **Stone** (`{colors.stone}` — `#707072`): Lowest-emphasis utility text and inverse secondary text on light (white) surfaces.

### Semantic

- **Sale** (`{colors.sale}` — `#ff4d4f`): Brightened red so discounted price and "% off" copy hold contrast on `#111111`. Same and only role: price-row signaling, never a background.
- **Sale Deep** (`{colors.sale-deep}` — `#ff8a8b`): Now the _lighter_ pressed/hover step, since "deep" on a dark canvas means lighter, not darker.
- **Success** (`{colors.success}` — `#30d158`): Confirmation, in-stock, eligibility ticks — matched to a standard dark-mode systems green for contrast.
- **Success Bright** (`{colors.success-bright}` — `#6ee68a`): Inverse/emphasis success, used sparingly on the rare light-inverted surface.
- **Info** (`{colors.info}` — `#5c8aff`): Informational link/badge accent in member-experience callouts.
- **Info Deep** (`{colors.info-deep}` — `#8fabff`): Pressed state for info accent — lighter, per the same "deep = lighter on dark" logic.

### Category Accents (sport / collection chips)

Same restrained usage as light mode — swatch dots, soft tile fills, editorial category chips only, never primary CTA color.

- **Accent Pink** (`{colors.accent-pink}` — `#ff4dc4`): SKIMS / women's collection moments.
- **Accent Pink Soft** (`{colors.accent-pink-soft}` — `#ffb0dd`): Unchanged from light mode — already light enough to read on dark.
- **Accent Purple Soft** (`{colors.accent-purple-soft}` — `#c9bbff`): Editorial swatch dot, soft category chip.
- **Accent Purple Pale** (`{colors.accent-purple-pale}` — `#a89bfd`): Deepened slightly from the light-mode "pale" so it doesn't wash out against `#111111`.
- **Accent Teal** (`{colors.accent-teal}` — `#3fb6c9`): Trail / outdoor / ACG editorial accent, lifted for dark-surface contrast.
- **Accent Pink Deep** (`{colors.accent-pink-deep}` — `#ff9fd6`): Heritage/Jordan tile wash — lightened, since "deep overlay tint" on a dark base means a lighter tint, not a darker one.

## Typography

No changes from light mode. Font families, sizes, weights, line-heights, and letter-spacing are identical — dark mode is a color-only transform. `{typography.display-campaign}` (Nike Futura ND, 96px/0.9, uppercase) still burns directly into campaign photography; the only difference is the headline is chosen per-asset between `{colors.canvas}` and `{colors.ink}` just as before, now weighted toward white burn-in since dark-toned campaign photography is more common in a dark theme.

## Layout

No changes from light mode. Spacing scale (8px base, `{spacing.section}` 48px rhythm), grid (1440px max-width, 3-up/2-up/1-up PLP), and filter sidebar width behave identically. Dark mode is purely a surface/text substitution layered on the same structural skeleton.

## Elevation & Depth

| Level                 | Treatment                                                       | Use                                                                         |
| --------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 0 — Flat              | No shadow, no border                                            | Default for cards, buttons, sections — still the dominant treatment         |
| 1 — Hairline divider  | 1px solid `{colors.hairline}` (`#3a3a3c`)                       | Filter row separators, footer column borders, PDP disclosure-row separators |
| 2 — Inset bottom-line | `box-shadow: inset 0 -1px 0 {colors.hairline-soft}` (`#2c2c2e`) | Sticky utility/sub-nav bar bottom edge, tab strip underline                 |

Still no drop-shadow elevation. On a dark canvas a conventional dark drop-shadow would be invisible anyway — depth continues to come entirely from photography and from the light/dark contrast between `{colors.canvas}` and `{colors.soft-cloud}`, not from CSS effects.

## Shapes

No changes from light mode. Radius scale, pill CTA shape (`{rounded.lg}` 30px), circular icon buttons (`{rounded.full}`), and zero-radius cards/photography all carry over exactly.

## Components

> Structural specs (padding, height, radius, type) are unchanged from light mode — only the resolved colors differ, and only because the underlying tokens now point at dark-mode values.

- **`button-primary`**: now a white pill (`{colors.ink}` = `#ffffff`) with `{colors.on-primary}` (`#111111`) text — same universal-CTA role, same `scale(0.5)/opacity:0.5` pressed feedback in `button-primary-active`.
- **`button-secondary`**: `{colors.soft-cloud}` (`#1c1c1e`) pill with white text — the soft dark-gray alternate to the white primary pill.
- **`button-outline-on-image`**: `{colors.canvas}` (`#111111`) pill with white text — the dark-chip overlay that anchors sport-category and campaign tiles, mirroring the light system's white-chip-on-image logic exactly, just inverted.
- **`search-pill`** / **`form-input`**: same dark-gray/transparent treatment as before; focus state swaps the 2px border and halo to `{colors.ink}`/`{colors.soft-cloud}` so the "soft glove" focus ring still reads against a dark canvas instead of disappearing into it.
- **`product-card`**: unchanged structurally — full-bleed image on `{colors.soft-cloud}`, zero padding, zero radius, `{spacing.sm}` gap to metadata. Price row logic unchanged: sale price now brighter red, strike-through original in `{colors.mute}`.
- **`campaign-tile`** / **`member-benefit-card`**: background moves to `{colors.soft-cloud}` as a neutral dark base for cases where campaign photography doesn't fill the full container; text stays `{colors.on-primary}` (white) as before.
- **`swatch-dot`**: same 12px circle and concentric-ring active state; the "light colorway" outer ring (previously `{colors.hairline}` on white) now serves the opposite edge case — dark colorways get the subtle outer ring so they stay visible against `{colors.canvas}`.

## Do's and Don'ts

### Do

- Treat every token as a direct substitution — build dark mode by re-pointing `{colors.*}` values, never by re-authoring component structure.
- Keep `{colors.soft-cloud}` one clear luminance step above `{colors.canvas}` so product photography still reads as "staged," not as floating on pure black.
- Brighten semantic accents (`sale`, `success`, `info`) enough to clear contrast on `#111111` — check each against `{colors.canvas}`, not against `{colors.ink}`.
- Keep `{colors.ink}` (now white) the single primary-CTA color; don't invent a separate "dark-mode primary" hue.
- Let campaign photography lean into naturally dark-toned crops where possible — the system reads best when photography and chrome sit in the same tonal register.

### Don't

- Don't drop `{colors.canvas}` to pure `#000000` — it kills separation between canvas, soft-cloud, and true-black photography blacks.
- Don't add glow, gradient, or blur to compensate for lost drop-shadow depth — the system still gets depth from photography contrast only.
- Don't reuse the light-mode hex values for semantic accents; a light-mode `{colors.sale}` red at `#d30005` fails contrast on `#111111`.
- Don't let `{colors.hairline}` get bright enough to read as a glow or border-emphasis — it's a quiet 1px separator, not a highlight.
- Don't introduce a second dark surface tone beyond `{colors.soft-cloud}` — the system stays two-surface (canvas + soft-cloud) exactly as light mode stayed two-surface (canvas + soft-cloud).

## Responsive Behavior

No changes from light mode. Breakpoints, touch targets, grid collapsing, and image art-direction crops are identical — dark mode is a token-value swap layered on an unchanged responsive skeleton.

## Iteration Guide

1. Never hand-pick a new hex for a dark surface — derive it as a fixed luminance step from `{colors.canvas}`, matching the `#111111` → `#1c1c1e` relationship already established.
2. When adding a new semantic color, tune it against `{colors.canvas}` (`#111111`) for contrast, then verify the light-mode counterpart still passes against `#ffffff` — the pair should read as the same hue family at two luminances, not two different colors.
3. Reuse light-mode component structure entries verbatim; only add a new `components:` entry if a dark-specific interaction genuinely differs (none currently do).
4. Keep `{colors.ink}` scarce per viewport, same rule as light mode — more than one solid-white pill/block in the same fold should get neutralized to `{component.button-secondary}` or `{component.button-outline-on-image}`.

## Known Gaps

- **No captured dark-mode screenshots** — all values here are derived by systematic token inversion and contrast-tuning from the light-mode system, not extracted from live dark-mode surfaces.
- **Hover states** still undocumented per the same system policy as light mode.
- **Dialog / modal, bag, and wishlist states** remain unconfirmed in dark mode for the same reasons noted in the light-mode system.
