# 05 · Design system

Tokens live in `src/styles/tokens.css`. Components use tokens only.

## Brand colours (exact values from the official logo SVG)

| Token | Value | Use |
|---|---|---|
| `--lf-yellow` | `#FFD600` | Accent tiles, primary CTA on charcoal, focus ring on charcoal. Never used as text on white |
| `--lf-orange` | `#FF7800` | Accent tiles, eyebrow rule. Text-safe variant `--lf-orange-700` `#A84A00` (5.3:1) |
| `--lf-blue` | `#2D58C0` | Links, primary buttons, active states (6.4:1 on white) |
| `--lf-mist` | `#E6ECED` | Logo wordmark colour (reference only) |
| `--lf-charcoal` | `#16191F` | Text, logo capsule, footer, dark tiles |

The brief's approximate palette (`#FFD21C`, `#FF7917`, `#2853A5`) was replaced by the logo's exact values.
The legacy PNG mark uses a different blue, `#204ECF`. It is left as it is, on legacy pages only.

**Logo on a light theme.** The only official logo files have a light wordmark, so the unmodified logo
sits on a **charcoal capsule** in the header and is shown directly on the charcoal footer. A dark-wordmark
version from the brand owner would allow a capsule-free header.

## Neutrals
Surface `#FFFFFF`, surface-2 `#F5F7FA`, surface-3 `#EAEEF3`, border `#DDE2E9`, text `#16191F`, text-2
`#4A5463` (7.6:1), text-3 `#5F6A79` (5.6:1). The neutrals are cool, biased toward the brand blue.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display (h1–h4, numbers) | **Hanken Grotesk** 500–800, SIL OFL | Self-hosted Latin subset, 34 KB, preloaded, `font-display: block` |
| Body and UI | **Open Sans** variable, SIL OFL | Same open-source default as AWS Cloudscape. Self-hosted, `font-display: optional` |

Amazon Ember is not used (no licence). AWS docs were used for hierarchy only: calm 16–17 px body text,
strong semibold headings, high-contrast dark text with blue links, and a readable measure (68ch here).

| Token | Size |
|---|---|
| `--fs-hero` | 40 → 88 px (`clamp`) |
| `--fs-h1` | 36 → 64 px |
| `--fs-h2` | 32 → 56 px |
| `--fs-h3` (cards) | 22 → 28 px |
| `--fs-lead` | 17 → 20 px |
| `--fs-body` | 16 → 17 px, line-height 1.65 |
| `--fs-small` (nav) | 15 px |
| `--fs-label` | 12 px, +0.12em, uppercase |

## Shape, space and elevation
- **Leaf radius** `--radius-leaf: 4px 4px 28px 4px` (and `-lg`, 48 px) is taken from the logo modules.
  It is used on cards, panels, images and tiles, and gives the system its signature.
- Spacing on a 4 px base (`--sp-1…10`). Section padding `clamp(3.5rem, …, 8rem)`. Container 1280 px.
  Gutter 16 → 40 px.
- Elevation: three cool-tinted shadows (`--shadow-1/2/3`).
- Breakpoints: 480, 768 (760), 1024, 1280, 1536.

## Motion
Durations: micro 150 ms, UI 300 ms, section 600 ms, hero 900 ms. Easing `cubic-bezier(.22,.8,.24,1)`
(out) and `(.65,0,.35,1)` (in-out). All motion is transform or opacity, and reveals are transform-only, so
text is painted from the first frame. Everything becomes zero under `[data-motion='reduced']`.

## Component states
Every interactive component has hover, active, `:focus-visible` (3 px blue ring with a 3 px offset, or a
yellow ring on charcoal), and disabled or pressed states where relevant. Touch targets are at least 44 px
(buttons 48 px).

## Status badges
Blue = Linkfields offering · Green = live demo · Grey = POC / network-only · Orange = proposed
(dashed card outline).
