# 04 · 3D scene, emblem, animation and rendering architecture

## Stack decision

| Choice | Why |
|---|---|
| Stay on **CRA 5 + React 19 + React Router 7** | Existing framework and pipeline; no migration risk |
| **Three.js r180, plain (no React Three Fiber)** | One imperative engine gives full control of the loop, disposal, context loss and progressive construction. It avoids R3F/drei's dependency tree on CRA's older webpack. The whole engine is a lazy chunk |
| **GSAP** | Interruptible camera and globe tweens (`overwrite: true`) |
| **framer-motion** (already installed) | UI reveals only, via `LazyMotion` + `m` (smaller bundle) |
| No Lenis, no ScrollTrigger | Native scrolling. Scroll position is read passively and the camera smooths itself, so there is no scroll-jacking |

## Route model

```
RootLayout (header · <main> · footer · ScrollRestoration · hash scrolling)
├── UniverseLayout  ← persistent 3D stage shared by:
│   ├── /                        HomePage (scroll-driven camera)
│   └── /universe/:planetId      PlanetPage (camera fly-to, verified panel)
├── /demos /solutions /services /industries /company /careers /contact
└── * NotFound
LegacyLayout (Bootstrap + original CSS, lazy)
└── /catalogue /BankingAnalytics /TelecomAnalytics /BankingTelecomAnalytics
    /golf-analyzer /resume-summarizer /jd-cv-comparison /users /generate-report
```

- The **camera follows the URL, never the reverse**. Back/forward, deep links and bookmarks all work.
  Deep links to a planet frame it immediately, with no intro.
- Links into legacy routes use full page loads (`SmartLink`), so Bootstrap never leaks into the new UI.

## Scene graph (`src/features/universe/engine/`)

| Object | File | Notes |
|---|---|---|
| Nebula backdrop | `starfield.js` | Inverted sphere, 3-octave fbm, HIGH/BALANCED only |
| Stars | `starfield.js` | One `Points` draw call, custom twinkle shader, 1.4k–7k by profile |
| AI emblem | `emblem.js` | See below |
| 8 AI planets | `planets.js › createAIPlanet` | Procedural fbm surface + bands + night-side "data filaments", fresnel rim, additive atmosphere shell, optional ring, technology moons, orbit line. The emblem is their light source |
| Solutions world | `planets.js › createWorld` | 6 satellites → `/solutions#id` |
| Services world | `planets.js › createWorld` | Ringed giant, 7 satellites → `/services#id` |
| Industries constellation | `planets.js › createConstellation` | 8 crystal stars + pulsing links → `/industries#id` |

All surfaces are procedural GLSL (`shaders.js`), so there are **no texture downloads and no third-party
imagery**. Simplex noise is by Ashima Arts / Stefan Gustavson (MIT), credited in source.

### Labels and picking
Every object has an **HTML label** (`UniverseLabels.jsx`): a real `<a>` element positioned by the engine
each frame through `transform` (no React re-render). Hidden labels get `tabIndex=-1` and `aria-hidden`.
Canvas clicks are ray-picked against the same anchors. Hovering a satellite label pauses its orbit, so
moving targets never have to be chased.

## Cinematic AI emblem: "Linkfields Core"

An original construction that does not reuse the company logo:
- **Luminous core**: fbm-animated hot centre (yellow → orange) with a heartbeat pulse (HDR values feed bloom).
- **Faceted glass shell**: icosahedron with derivative-based flat facet normals, fresnel rim, moving
  glints and gold edges.
- **Inner lattice**: counter-rotating wireframe (not on LIGHT).
- **Three orbital rings** in the three logo colours (yellow, orange, blue), tilted and rotating. They
  echo the tri-colour mark without copying its shape.
- **Intelligence nodes** riding the rings, joined by **light trails** with travelling energy pulses.
- **Energy pulse** ring and an additive halo that glows even without bloom.

Variants:
- **Desktop:** 3 rings, 10–14 nodes, bloom.
- **Mobile (LIGHT):** 2 rings, 6 nodes, no lattice, no bloom.
- **Small decorative and static fallback:** SVG (`components/brand/AIEmblemMark.jsx`).

The static fallback is procedural SVG; no image-generation tool was used.

## Camera and animation system

- `cameraRig.js`: every transition captures the current pose and GSAP-tweens a 0→1 blend toward a
  **live goal** (moving planets stay tracked), with an optional arc. A new navigation retargets from
  wherever the camera is: interruption-safe, no queues, no conflicts.
- Home scroll: `HomePage` maps the scroll position to chapter progress 0–4 (piecewise between chapter
  centres). The engine damps it and follows a centripetal Catmull-Rom path through the chapter poses,
  with smoother-step "dwell" at each chapter.
- Motion tokens (`features/motion/tokens.js`, mirrored in CSS): buttons 180–200 ms, cards 450 ms,
  sections 700 ms, camera 2.0 s (retarget 1.3–1.6 s).
- "Reduce motion" header toggle (persisted per browser) plus `prefers-reduced-motion` switch to the
  STATIC profile and disable framer-motion transforms and CSS animations. "Skip the journey" jumps to
  the content.

## Rendering profiles (`engine/profiles.js`)

| Profile | Chosen when | DPR cap | Stars | Bloom | Nebula | Moons | Frame cap |
|---|---|---|---|---|---|---|---|
| HIGH | ≥8 cores, ≥1200 px, discrete-class GPU | 1.75 | 7000 | yes (MSAA 4) | yes | yes | vsync |
| BALANCED | laptops, tablets, integrated GPUs | 1.5 | 3800 | yes (reduced res) | yes | yes | vsync |
| LIGHT | phones, ≤2 cores/≤2 GB, Save-Data | 1.25 | 1400 | no | no | no | 30 fps |
| STATIC | reduced motion, no WebGL2, software GL, context lost | none | none | none | none | none | none |

Override for testing: `?profile=high|balanced|light|static`; performance HUD: `?debug=1`.

**Runtime governor**: if the average over a 2 s window drops below ~42 fps, the governor lowers DPR in
0.25 steps and then disables bloom. It never steps back up, to avoid oscillation.

**Lifecycle**:
- The engine chunk loads only after `window.load` plus idle, and never blocks LCP.
- Scene construction yields to the main thread between stages.
- Shaders compile with `compileAsync` (parallel compile).
- Rendering pauses when the tab is hidden, and on the home page once the light content covers the stage.
- WebGL context loss switches to the static fallback, with a *Retry* button.
- `dispose()` releases all geometries, materials and textures, cancels tweens, removes listeners and
  calls `forceContextLoss()`.

## Office globe (`features/globe/`)
Graticule globe (no coastline dataset), approximate city markers, pulsing arcs from the Midrand HQ,
drag-to-rotate and "Show on globe" buttons. It loads lazily when scrolled into view and is skipped on
LIGHT/STATIC, where the accessible office cards remain.

## Folder structure

```
src/
  app/            App, router (all routes incl. legacy), navigation config
  components/
    brand/        LinkfieldsLogo (official, unmodified), AIEmblemMark (SVG emblem)
    layout/       Header, Footer, RootLayout, layout.css
    ui/           SmartLink, StatusBadge, SectionHeader, PageHero, DemoCard, ProposalCard,
                  UniverseIndex, OfficeList
  config/         endpoints.js (legacy backend URLs, env-overridable)
  content/        single source of truth: company, careers, solutions, services, industries,
                  demos, technologies, proposals, universe, status
  features/
    universe/     UniverseLayout (host), labels, fallback, DebugHUD, engine/ (Three.js)
    globe/        OfficeGlobe + globeEngine
    motion/       MotionProvider (preference + LazyMotion), tokens
  hooks/          usePageMeta
  legacy/         preserved production app (pages, components, styles, LegacyLayout)
  pages/          home, universe, demos, solutions, services, industries, company,
                  careers, contact, NotFound (+ shared content.css)
  styles/         tokens.css, base.css, components.css
  utils/          safeStorage
  __tests__/      content integrity + rendering tests
public/
  brand/          official logo SVG (byte-identical copy)
  fonts/          Open Sans variable, Latin subset (OFL)
  images/         original product images + generated lightweight thumbs/
docs/             this documentation
```
