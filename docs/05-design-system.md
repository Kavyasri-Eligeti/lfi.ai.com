# 05 · Design system: typography, colour and tokens

Tokens live in `src/styles/tokens.css`. Components use tokens only.

## Brand colours (exact values from the official logo SVG)

| Token | Value | Use |
|---|---|---|
| `--lf-yellow` | `#FFD600` | Accent, focus ring on dark, primary CTA on dark. Never used as text on white |
| `--lf-orange` | `#FF7800` | Accent. Text-safe variant `--lf-orange-700` `#A84A00` (5.3:1 on white) |
| `--lf-blue` | `#2D58C0` | Links and primary buttons on light (6.4:1 on white) |
| `--lf-mist` | `#E6ECED` | Logo wordmark colour |
| `--lf-charcoal` | `#16191F` | Text and footer |

The official logo files are light-on-dark (white wordmark), so **the header is dark charcoal on every
page** (as on AWS docs). The logo is always shown on a dark surface and is never recoloured.

## Two environments
- **A · Cinematic universe**: `--space-950…700`, glass panels, light text `#EEF2F6` / `#B7C2D4`.
  Used on the home journey, planet pages and dark page heroes.
- **B · Content**: white / `#F4F6F8` surfaces, `#16191F` text, `#414D5C` secondary, `#D5DBE1` borders,
  blue links. Used on all information pages.
  The dark page hero is the bridge between the two.

## Typography

**AWS documentation review:** AWS docs use Amazon's Cloudscape design system. Its characteristics are a
humanist sans-serif, dense but calm hierarchy, 14–16 px UI text with generous line height, strong
semibold headings, and high-contrast dark text on white with blue links. Cloudscape's open-source
default typeface is **Open Sans**.
**Amazon Ember** is an Amazon brand typeface with no licence for this project, so it is **not used**.

**Chosen:** **Open Sans** (variable wght 300–800, SIL OFL 1.1), self-hosted, Latin subset (47 KB),
preloaded, `font-display: optional` (no late re-render of the hero text).

| Token | Size | Weight / line height |
|---|---|---|
| `--fs-hero` | `clamp(2.5rem, 1.2rem + 4.2vw, 5.5rem)`: 40 → 88 px | 700 / 1.04, −0.035em |
| `--fs-h1` | 36 → 56 px | 700 / 1.12 |
| `--fs-h2` | 32 → 56 px | 700 / 1.12 |
| `--fs-h3` (cards) | 22 → 28 px | 650 / 1.2 |
| `--fs-body` | 16 → 18 px | 400 / 1.6, max 70ch |
| `--fs-small` (nav) | 15 px | 600 |
| `--fs-meta` | 13 px | 400–700 |

## Spacing, shape, motion
- 4 px spacing scale (`--sp-1…9`); section padding `clamp(3.5rem, …, 7rem)`; container 1240 px;
  gutter 16–32 px.
- Radii 6/10/16 px, pill buttons, 44 px minimum touch targets.
- Motion: `--dur-fast` 180 ms, `--dur-card` 450 ms, `--dur-section` 700 ms,
  `--ease-out` `cubic-bezier(.22,.8,.24,1)`. All motion durations become 0 under
  `[data-motion='reduced']`.

## Status badges
Blue = Linkfields offering · Green = live demo · Grey = POC / network-only · Orange = proposed ·
Violet = AI technology.
