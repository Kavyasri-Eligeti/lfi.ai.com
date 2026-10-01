# 07 · Quality report: build, tests, performance, accessibility

_Measured 1 October 2026 on the production build (`GENERATE_SOURCEMAP=false npm run build`), served by
`scripts/serve-build.js` (SPA fallback, **no compression**, matching how production serves JS today), in
headless Chrome with Lighthouse 12.8.2 on an Intel integrated GPU._

## Build
- `npm run build`: **compiled successfully, no ESLint warnings.**
- Main bundle **151 KB gzip** (475 KB raw): React, Router, Motion (LazyMotion), all pages and content.
- Lazy chunks: `field-webgl` (2.3 KB gz) plus three.js (134 KB gz), loaded only on capable desktops
  after idle. The legacy app (Bootstrap, recharts) loads only on legacy routes.
- Fonts: Hanken Grotesk (34 KB, preloaded) and Open Sans (47 KB), both self-hosted Latin subsets.

## Tests (all executed)

| Suite | Result | Covers |
|---|---|---|
| Jest `content.integrity.test.js` | **14 / 14 pass** | Every live link from the original production catalogue is present. Legacy routes are routed. Services, solutions (now including Testorium Z) and industries match linkfields.com. Proposals are never marked as offerings. Capability groups reference real demos. Every bundled image exists. Offices have published details and direction links. Insights carry only published dates. Mission and values use the published wording |
| Jest `app.render.test.jsx` | **16 / 16 pass** | Every route renders without WebGL. The capability tabs preview demos. `/demos` redirects. Catalogue counts and URL filters work. Proposals are labelled. The enquiry form validates. The office accordion works. Skip link and navigation are present |
| Playwright `e2e/site.spec.js`, desktop 1440 × 900 and Pixel 7 | **25 pass, 3 skipped** (device-specific tests skip on the other device) | All 7 pages render with **no console errors** and **no horizontal overflow**. Legacy routes load. Skip link moves focus to main. Catalogue search filters. The mobile menu opens, makes the page behind inert, and closes with Escape returning focus. The desktop hero upgrades to WebGL with no errors. Reduced motion keeps the CSS field. Full-page screenshots are written to `e2e/screenshots/` |

## Lighthouse

Three configurations are reported, because they disagree for client-rendered apps:
- **M-sim**: mobile, Lighthouse's default simulated throttling.
- **M-dev**: mobile, applied (devtools) throttling: 4× CPU, 1.6 Mbps, 150 ms RTT. This is a real browser run.
- **D-sim**: desktop preset.

Scores are Performance / Accessibility / Best practices / SEO.

| Page | M-sim | M-dev (LCP · TBT) | D-sim (LCP) | CLS |
|---|---|---|---|---|
| **lfiai.com today (before)** | 66/95/100/100 | 70 · 4.0 s · 170 ms | 75 · 2.7 s | 0.049 |
| `/` | 83/100/100/100 | 78 · 2.7 s · 510 ms | 92 · 1.0 s | **0** |
| `/solutions` | 79/100/100/100 | 79 · 2.4 s · 620 ms | 99 · 0.9 s | **0** |
| `/services` | 83/100/100/100 | 84 · 2.4 s · 440 ms | 99 · 0.9 s | **0** |
| `/industries` | 81/100/100/100 | 83 · 2.4 s · 440 ms | 99 · 1.0 s | **0** |
| `/company` | 82/100/100/100 | 80 · 2.4 s · 550 ms | 99 · 0.9 s | **0** |
| `/careers` | 81/100/100/100 | 65 · 6.1 s · 300 ms | 99 · 1.0 s | **0** |
| `/contact` | 83/100/100/100 | 87 · 2.4 s · 340 ms | 99 · 0.9 s | **0** |

Run-to-run variance is about ±5 points.

### Against the targets

| Target | Result |
|---|---|
| CLS ≤ 0.1 | ✅ **0 on every page and profile** (production today: 0.049) |
| LCP ≤ 2.5 s | ✅ Desktop on every page (0.9–1.0 s). ⚠ Mobile with applied throttling: home 2.7 s, careers 6.1 s. ⚠ Read the note below on deep-link LCP |
| Lighthouse ≥ 90 | ✅ Desktop: 6 pages at 99, home at 92. ⚠ Mobile: 79–87, careers 65 |
| INP ≤ 200 ms | Not measurable in lab runs (needs field data). TBT is the proxy: 0 ms on desktop content pages, 210 ms on the desktop home (WebGL start-up), 340–620 ms on mobile with 4× CPU |
| Accessibility | ✅ **100 on every page** (production today: 95) |

### What limits mobile, honestly
1. **JavaScript is served uncompressed by the production host** (verified on lfiai.com: HTML is gzipped,
   `main.js` is not). Uncompressed, the 475 KB bundle finishes downloading at about 4.7 s on the
   throttled profile. With gzip it is 151 KB, about three times less. This is a server setting, so it needs approval (see 08).
2. **Deep links are client-rendered.** On deep links the page content renders only after the bundle
   arrives. Lighthouse reports about 2.4 s LCP for those pages because the static SEO text in
   `index.html` paints first and counts as the LCP. On `/careers` the large office photo is the LCP and
   has to wait for the bundle (6.1 s). **Build-time pre-rendering of each route** is the structural fix.
   It is not done here because the Apache directory-index behaviour for `/route/index.html` cannot be
   verified from outside.

### Changes made during this phase, and their measured effect
- Replaced about 100 per-element Motion `whileInView` observers with one shared observer
  (`Reveal.jsx`). Mobile home TBT went from **1,640 ms to 460–510 ms**, and the score from 58 to 78.
- `content-visibility: auto` on below-the-fold home sections: style and layout time on mobile went from 1,412 ms to 472 ms.
- Preload only the display font, so the CSS is not queued behind fonts: FCP improved by about 0.2 s.
- `font-display: block` on the display font, which is preloaded and small, so the headline never re-flows.

## Accessibility (WCAG 2.2 AA target)
- Lighthouse/axe: **100 on every page**.
- Verified by tests: keyboard order starts at the skip link. The mobile menu works by keyboard
  (Escape, focus return, inert background). The ARIA tab sets in the capability index and industries
  support arrow keys, Home and End. Office accordion headings wrap their buttons. Form errors are announced
  and linked with `aria-describedby`.
- Contrast: yellow and orange never carry text on white. Secondary text is 7.6:1 and tertiary 5.6:1.
- Reduced motion: follows the OS setting, with a manual footer toggle. WebGL, the wave and all reveals stop.
- **Not yet done:** manual screen-reader passes (NVDA, VoiceOver) and a manual 200%/400% zoom review.
  Both are recommended before release.

## Known limitations
- `font-display: optional` on Open Sans means a first visit on a slow connection may show body text in
  the system font. This is intentional, to keep CLS at 0.
- FMCG and Manufacturing use a brand-module graphic instead of a photo until approved images are supplied.
- Legacy tools on `10.2.x.x` backends work only inside the Linkfields network (unchanged).
