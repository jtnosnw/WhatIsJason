# Design system

All raw values live in [src/styles/tokens.css](src/styles/tokens.css). This document covers the rules a token file can't express: how to choose between tokens, and how things behave.

## 1. Principles

- **Tokens only.** Components use `var(--…)` for every colour, space, size, radius, shadow, stroke and duration. A missing value means a missing token: add it to `tokens.css` and document it here. Never inline a value.
- **Restrained by default.** The interface is neutral ink on off-white (or off-black). The accent marks what you can click. Domain colours are the only decoration, and they only appear as small marks.
- **Colour is never the only signal.** Every colour-coded thing also has a text label, an icon or a shape.
- **Contrast is measured, not eyeballed.** Every text token is ≥ 4.5:1, and every non-text token is ≥ 3:1, against `--color-bg`, `--color-surface` and `--color-surface-muted` in both themes. If you change a colour, re-verify it.

## 2. Colour

### 2.1 Themes

Every colour is declared once with `light-dark()`. The theme follows the OS setting. Setting `data-theme="light"` or `"dark"` on `<html>` overrides it, and this attribute is where the stored `prefs.theme` gets applied. Never write `@media (prefers-color-scheme)` in a component. If something needs a different value per theme, it needs a token.

### 2.2 Roles

| Token | Use for | Never for |
|---|---|---|
| `--color-bg` | The page plane | Cards |
| `--color-surface` | Cards, panels, sheets, popovers | |
| `--color-surface-muted` | Insets, code blocks, hover washes, table stripes | Large areas of text |
| `--color-border` | Decorative hairlines between regions | Input edges (too faint to meet 3:1) |
| `--color-border-strong` | Input edges, meaningful dividers, map edges | |
| `--color-text` | All body text and headings | |
| `--color-text-muted` | Metadata, captions, `lastReviewed`, the "may be out of date" marker | Anything you must read to use the page |
| `--color-accent` | Links, primary buttons, selected state, focus ring | Decoration |
| `--color-outcome-*` | Quiz outcome labels, score figures, review-queue chips | Anything outside quizzes and review |

### 2.3 Domain colours

- Use them for **marks only**: badge dots, map nodes, cluster tints, left-border stripes, diagram fills. **Never for text.** Text on or beside a domain mark uses `--color-text`.
- Use `--domain-<id>-tint` for backgrounds. It is always mixed toward `--color-surface`, so text on it still passes.
- A domain colour always sits next to the domain's name, or appears where that name is one tap away (for example the map legend).
- **The order is fixed.** The palette was validated for colour blindness on neighbouring pairs in this ring order. The mind map lays clusters out in this order, and every list of domains uses it. Never sort domains alphabetically for colour purposes, and never recolour them when a filter hides some. A domain keeps its colour everywhere.
- **Type, adoption and trend are not colour-coded.** Type shows as an icon on a neutral badge. Adoption and trend show as neutral text badges.

### 2.4 Quiz outcomes

There are three outcomes, and each has its own colour, icon and word. Skipped is a calm slate blue, deliberately not red and not amber: it's a gap, not an error. Never show `skipped` in the incorrect colour, and never leave skipped out of the display.

## 3. Spacing

### 3.1 Rhythm

The scale is built on 4px (`--space-1` to `--space-9`). Pick by relationship, not by eye:

| Relationship | Token |
|---|---|
| Icon and its label; badge padding | `--space-1` to `--space-2` |
| Items inside one component (label and input, lines in a card) | `--space-2` to `--space-3` |
| Card padding; gap between list items | `--space-4` |
| Sibling blocks on a page | `--stack-gap` |
| Page sections | `--section-gap` |
| Page side padding | `--gutter` |

- Space grows with separation. Things that belong together sit closer than things that don't. If two gaps compete, the outer one must be the larger.
- Put vertical rhythm on the parent (`gap` in flex or grid), not as margins on children. Only one element owns any given gap.
- Prose is capped at `--measure` (68ch). Pages are capped at `--page-max`.
- Every interactive element has a hit area of at least `--tap-target` (44px), even when it looks smaller.

### 3.2 Density by breakpoint

The layout is designed for phones first, from 360px wide. It has two breakpoints: **sm ≥ 40rem (640px)** and **md ≥ 64rem (1024px)**. Custom properties can't be used inside media queries, so use these literal values in `@media`. They are the only raw sizes allowed outside `tokens.css`.

| Semantic token | < 640px | ≥ 640px | ≥ 1024px |
|---|---|---|---|
| `--gutter` | 16px | 24px | 32px |
| `--stack-gap` | 24px | 32px | 32px |
| `--section-gap` | 48px | 64px | 96px |
| `--card-pad` | 16px | 24px | 24px |

- `--card-pad` is the inner padding of every card, panel, notice and callout. Use it instead of a raw `--space-*` step, so they all get roomier together.
- Density changes through these semantic tokens. Components don't restate spacing per breakpoint. If a component needs to get roomier, it uses a semantic token, or a new semantic token gets added.
- The type ramp stays the same at every width, except `--text-2xl`, which scales from 30px to 40px. Long term names have to wrap cleanly at 360px, so test with the longest real term.
- **Below 640px:** side panels become bottom sheets (the map panel slides up, per SPEC §4.3). Comparison tables become stacked cards or get their own horizontal scroll container. The page body never scrolls sideways.

## 4. Interaction states

| State | Treatment |
|---|---|
| **Hover (links)** | `--color-accent` → `--color-accent-hover`, and the underline stays. |
| **Hover (cards and rows)** | Background moves to `--color-surface-muted`. Clickable cards may also lift from `--shadow-1` to `--shadow-2`. Never move layout on hover. |
| **Hover (buttons)** | A primary button fills with `--color-accent-hover`. A secondary button gets a `--color-surface-muted` wash. |
| **Focus** | `:focus-visible` shows a `--focus-ring-width` solid ring in `--color-focus` with `--focus-ring-offset`. It is set globally in `base.css`. Never remove it, and never replace it with a colour change alone. Mouse clicks don't show it; keyboard focus always does. |
| **Active / selected** | Uses the accent plus a second cue, such as weight, an underline bar or a check icon. |
| **Disabled** | `--color-text-muted` with `cursor: not-allowed`. Don't fade with opacity; it breaks contrast. |

- Hover is never the only way to reach something. Quiz clues are "hover **or tap**" (SPEC §4.6), and anything shown on hover must also show on focus.
- All transitions use `--duration-*` and `--ease-standard`. Those durations become 0 under `prefers-reduced-motion` or `data-reduced-motion="true"` (from `prefs.reducedMotion`). JS animation, including the mind map camera, has to check the same preference itself.

## 5. Diagrams and the mind map

Diagrams follow the same tokens as the rest of the site (SPEC §5).

- **Inline SVG only.** SVGs in `content/diagrams/` are inlined at build time. An SVG loaded through `<img>` can't read CSS variables and won't switch themes.
- **No colour literals in SVG source.** Use `fill="var(--color-…)"`, `style="fill: var(--…)"`, `stroke="currentColor"` or classes. Both the attribute and the `style` form resolve and switch with the theme (verified in Chrome). The content build fails on any hex, `rgb()` or `hsl()` in a diagram file.
- **Size:** a diagram scales to the width of its column, up to `--measure`, so its `viewBox` units, text included, scale with it. Draw at roughly the size it will display, which is about 640 units wide.
- **Ink:** `--color-text` for labels, `--color-border-strong` for lines and arrows, `--color-surface` or `--color-surface-muted` for box fills.
- **Emphasis:** a domain colour, only when the diagram is about that domain, used as an outline or tint rather than a solid fill behind text.
- **Type:** `--font-sans`, sized from the ramp. Labels are at least `--text-xs`.
- **Spacing:** padding and gaps inside a diagram come from the same scale. A box's inner padding is at least `--space-3` in SVG units.
- **Strokes:** `--stroke-hairline` for secondary lines and `--stroke-regular` for primary edges.

**Mind-map encoding (SPEC §4.3):**
- Node fill: `--domain-<id>`.
- Node size: adoption tier.
- Node label: `--color-text` on a `--color-surface` halo, never on the domain colour.
- Edge colour: `--color-border-strong`.
- Edge dash pattern: sets the relationship type. The exact patterns are set when the mind map is built, added as tokens, and always shown in a legend next to the map.

## 6. Type

- System stacks only: `--font-sans` for everything and `--font-mono` for code.
- **Headings:** `--weight-semibold` with `--leading-tight`.
- **Body text:** `--leading-normal`.
- **UI labels:** `--weight-medium`.
- **Numbers that line up in columns** (scores, history tables): use `font-variant-numeric: tabular-nums`.
- Use `--text-sm` for badges and captions. Use `--text-xs` only for legends and fine metadata, never for sentences.

## 7. Fixed sizes

The `--size-*` tokens are fixed dimensions, not rhythm. Use them for things that are a size rather than a gap:

| Token | Use for |
|---|---|
| `--size-icon` / `--size-icon-sm` | Icons beside body text / inside badges. Icons are drawn in `currentColor`. |
| `--size-dot` | The domain colour dot |
| `--size-card-min` | Minimum column width in card and related-term grids (`repeat(auto-fill, minmax(min(100%, …), 1fr))`) |
| `--size-thumb-min` | Minimum video thumbnail width |
| `--size-search` / `--size-panel` | Preferred search width / maximum popover width |
| `--size-stat-min` | Minimum width of a quiz score tile |

`--underline-offset` sets the link underline gap. It's in `em`, so it scales with the text.

## 8. Icons and colour channels

- **Type** shows as an icon on a neutral badge (`Icon` names match the six types). **Trend** shows as an arrow icon plus its word.
- **Quiz outcomes** each have their own shape: a check for correct, a cross for incorrect, and a dashed circle for skipped. Each also has a word and its `--color-outcome-*` colour. Outcome colours are used only in quizzes and review, never for general success or error styling elsewhere. The one exception is `.notice--error`, which borrows the incorrect pair for error notices.
- **Selected and current** states (nav, chips, the depth toggle, the current path step) use the accent plus a second cue: weight, an inset bar or an attached action.

## 9. Radii and elevation

- Use `--radius-sm` for badges and inputs, `--radius-md` for buttons and cards, `--radius-lg` for panels and sheets, and `--radius-pill` for chips.
- `--shadow-1` is for cards at rest. `--shadow-2` is for hover and popovers. `--shadow-3` is for sheets and modals. Dark mode shadows are much stronger, so cards in dark mode also need a `--color-border` edge to separate them from the page.
