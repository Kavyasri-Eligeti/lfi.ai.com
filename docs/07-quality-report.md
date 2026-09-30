# 07 · Quality report: build, tests, performance, accessibility

_Measured 2026-09-30 on the production build (`npm run build`), served locally with an SPA-fallback
static server, using Chrome (headless) on an Intel integrated GPU (ANGLE/D3D11) and Lighthouse 12._

## Build
- `CI=false npm run build`: **compiled successfully, 0 ESLint warnings**.
- Main bundle **141 KB gzip**: React, Router, framer-motion (LazyMotion), all new pages and content.
- Lazy chunks: 3D engine `universe` (~12 KB gz) plus three.js/GSAP shared chunk (~150 KB gz), loaded only
  after `load` + idle; globe (~6 KB gz); legacy app (Bootstrap and recharts, only on legacy routes).
- Font: Open Sans variable, Latin subset, 47 KB, preloaded.

## Tests: `CI=true npm test`: 23 / 23 passing
- `content.integrity.test.js` (11):
  - **every live link in the original production catalogue is present** (parsed from the recovered source);
  - all legacy routes are still routed;
  - services, solutions and industries match linkfields.com exactly;
  - no proposal is marked as an existing offering;
  - every planet, moon, satellite and star references real content or anchors.
- `app.render.test.jsx` (12):
  - every route renders in a no-WebGL environment (static fallback, no canvas);
  - planet deep links show verified links;
  - the proposed planet is labelled as proposed;
  - skip link and primary navigation are present.

## Lighthouse

Two throttling methods are reported, because they disagree strongly for this kind of app:
- **devtools**: applied throttling, a real browser run (mobile: 4× CPU, 1.6 Mbps, 150 ms RTT).
- **simulate**: Lighthouse's default Lantern model. It extrapolates from an unthrottled trace and
  attributes post-load 3D work to LCP.

| Page | Mobile devtools (P/A/BP/SEO · LCP · TBT) | Desktop devtools | Mobile simulate | Desktop simulate |
|---|---|---|---|---|
| `/` (3D) | 65/100/100/100 · 2.6 s · 980 ms | 77/100/100/100 · 0.4 s | 57 · 8.4 s | 74 · 1.6 s |
| `/universe/data-intelligence` (3D) | 68/100/100/100 · 2.1 s · 990 ms | 75/100/100/100 · 0.5 s | 55 · 8.6 s | 65 · 1.8 s |
| `/solutions` | 79/100/100/100 · 2.2 s | **100/100/100/100** | 85 · 4.3 s | 99 |
| `/services` | 75/100/100/100 · 2.3 s | **100/100/100/100** | 84 · 4.3 s | 99 |
| `/industries` | 81/100/100/100 · 2.3 s | **100/100/100/100** | 85 · 4.3 s | 99 |
| `/company` | 64/100/100/100 · 5.1 s | **100/100/100/100** | 82 · 4.3 s | 100 |
| `/careers` | 85/100/100/100 · 2.3 s | **100/100/100/100** | 86 · 4.2 s | 99 |
| `/contact` | 74/100/100/100 · 2.4 s | **100/100/100/100** | 85 · 4.2 s | 99 |
| `/demos` | 75/100/100/100 · 2.3 s | **100/100/100/100** | 83 · 4.4 s | 99 |

**CLS = 0 on every page and profile.**

### Against the targets

| Target | Result |
|---|---|
| **CLS ≤ 0.1** | ✅ 0 everywhere |
| **LCP ≤ 2.5 s** | ✅ desktop everywhere (0.3–0.5 s). ✅ mobile (applied throttling) on 8 of 9 pages (2.1–2.6 s). ⚠ `/company` deep link 5.1 s: its large first-screen paragraph waits for the 141 KB bundle on 1.6 Mbps |
| **Lighthouse ≥ 90** | ✅ **all 7 content pages score 99–100 on desktop**. ⚠ 3D pages 65–77. ⚠ mobile 64–86 |
| **INP ≤ 200 ms** | Not measurable in lab runs (needs field data). TBT is the proxy: content pages are 0–30 ms on desktop. On 3D pages, one ~0.5 s task remains at engine start (after load) |
| Accessibility | ✅ **100 on all pages** (desktop and mobile) |

### Why the 3D pages score lower, and what was done
Real-browser traces (Slow 4G + 4× CPU) show **home LCP at 2.0–2.5 s**. A static hero shell in
`index.html` uses the same classes as the React hero, so the LCP element paints before any JS runs.

The remaining cost is **TBT from starting WebGL** (three.js module evaluation plus driver shader
compilation), which runs *after* LCP. Mitigations in place:
- the engine loads after `window.load` + idle;
- scene construction yields to the main thread between stages;
- `compileAsync` (parallel shader compile) is used where the driver supports it;
- `checkShaderErrors` is disabled in production (removes synchronous GPU round-trips);
- LIGHT profile: 30 fps cap, no bloom/nebula/moons;
- rendering pauses when the tab is hidden or the stage is covered.

This reduced the largest start-up task from 1.06 s to about 0.5 s (4× CPU).

### Recommended next steps
1. **Pre-render each route at build time** (e.g. a post-build script with Puppeteer, or moving to a
   static-generation setup). This brings deep-link LCP on mobile to ≈1.5 s and lifts mobile scores into
   the 90s for content pages.
2. Precompile the bloom/post-processing programs, or load the engine only on the first user scroll or
   pointer move on mobile (removes TBT from lab runs entirely).
3. Collect field Core Web Vitals (INP especially): `reportWebVitals` is wired in `src/index.js`. Also
   upgrade `web-vitals` to v4 for INP.

## Performance validation of the 3D scene (Phase 3)

| Profile | Device in test | FPS | DPR | Draw calls | Notes |
|---|---|---|---|---|---|
| BALANCED | 1440×900, Intel iGPU | 50–59 (headless) | 1.0 | ~15 scene + post | bloom on |
| LIGHT | 390×844 mobile emulation | 60 → capped 30 | 1.25 | 15–16 | no bloom |
| STATIC | jsdom / reduced motion | n/a | n/a | 0 | SVG fallback |

- Memory: the geometry/texture count stays constant across fly-tos (48 geometries, 14 textures in
  BALANCED). `dispose()` releases everything on route exit.
- Verified visually: hero, all three chapters (Solutions satellites, Services giant, Industries
  constellation), a planet fly-to via label click (URL updates), mobile bottom-sheet layout, the office
  globe with "Show on globe", and the legacy `/catalogue`. No console errors on any page, and no
  horizontal overflow at 390 px or 1440 px.

## Accessibility (WCAG 2.2 AA target)
- Lighthouse/axe: 100 on every page.
- Keyboard: skip link; every 3D object has a focusable HTML link, and hidden labels are removed from the
  tab order; a list-based planet index sits on the home and planet pages; the Escape key closes the menu;
  focus moves to the heading on planet change.
- Motion: `prefers-reduced-motion` and a persistent **Reduce motion** toggle switch to the static profile
  and zero-duration transitions.
- Contrast: brand yellow and orange are never used for text on white (text-safe `#A84A00` orange instead).
  Glass panels are near-opaque, so contrast never depends on the scene behind them.
- Touch targets ≥ 44 px for buttons and ≥ 24 px for 3D labels.
- Manual screen-reader passes (NVDA / VoiceOver) are **not yet done**. They are recommended before release.

## Known limitations
- On small portrait screens, a few hero-area planet labels pass behind the (scrimmed) headline.
- The 3D pages' lab scores are bounded by WebGL start-up cost (see above).
- Legacy tools on `10.2.x.x` backends work only inside the Linkfields network (unchanged).
