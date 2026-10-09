# 04 · Architecture: "Modular Intelligence"

_Branch `feature/ai-redesign` (from `feature/ai-universe`). Approved direction: Concept A, Modular
Intelligence, with Concept C's capability index used for browsing demos._

## Stack decisions

| Choice | Why |
|---|---|
| Stay on **CRA 5 + React 19 + React Router 7** | Existing framework and Azure pipeline. No migration risk |
| **Plain Three.js r180** for one visual only (the hero field) | Already a dependency. It loads lazily on capable desktops after idle, in its own chunk |
| **Motion for React** (`framer-motion`, `LazyMotion` + `m`) | Menu, tab panels, filter layout animation, image reveals. Kept out of plain section reveals |
| **One shared `IntersectionObserver`** (`features/motion/Reveal.jsx`) | Section reveals. It replaced about 100 per-element Motion observers and cut mobile Total Blocking Time by about 70% |
| **GSAP removed** | No timeline needs it (`npm uninstall gsap`) |
| **No React Three Fiber, no smooth-scroll library** | Smaller bundle. Native scrolling, no scroll-jacking |
| **JavaScript, not TypeScript** | The codebase is JavaScript, and adding TypeScript mid-redesign adds build risk. Content correctness is enforced by tests instead (see 07). TypeScript can be added later without ejecting |

## Route model

```
RootLayout (skip link · sticky header · <main> with enter-only page transition · footer)
├── /             HomePage
├── /solutions    enterprise solutions · AI catalogue (#products, ?capability= ?industry= ?status= ?q=) · proposals (#proposed)
├── /demos        → redirect to /solutions#products
├── /services     7 services, sub-service disclosures, proposed AI services (#ai-services)
├── /industries   8 editorial industry panels (#manufacturing … #oil-gas)
├── /company      story, vision/mission, values, approach, partners, offices (#offices), CSR, insights
├── /careers      culture, photos, nurture qualities, official jobs link
├── /contact      enquiry form (opens email), channels, socials, offices
└── *             404
LegacyLayout (lazy; Bootstrap and original CSS)
└── /catalogue /BankingAnalytics /TelecomAnalytics /BankingTelecomAnalytics
    /golf-analyzer /resume-summarizer /jd-cv-comparison /users /generate-report   (unchanged)
```

- Page transition: a 320 ms enter-only fade and shift. There is no exit animation, so navigation is never
  delayed. Focus moves to `<main>` after each client-side navigation; `#hash` links scroll to and focus
  their target.
- The removed `/universe/:planetId` URLs were never deployed, so no public link breaks.

## Source layout

| Layer | Location | Contents |
|---|---|---|
| Design tokens | `src/styles/tokens.css` | Colour, type, spacing, radii (including the brand "leaf"), elevation, motion |
| Base and shared components | `src/styles/base.css`, `components.css` | Type, buttons, links, badges, chips, leaf cards, forms, tabs, disclosure, reveal |
| Content | `src/content/*.js` | Every item has a `status`; pages never hard-code copy |
| UI primitives | `src/components/ui` | `SmartLink`, `StatusBadge`, `Icon`, `SocialIcon`, `SectionHeader`, `PageHero`, `DemoCard`, `ProposalCard` |
| Sections | `src/components/sections` | `CapabilityIndex`, `FeaturedBento`, `IndustryTabs`, `PartnerWall`, `OfficeMap`, `InsightsList`, `CareersBand`, `ContactBand` (+ `sections.css`) |
| Layout | `src/components/layout` | `Header` (logo capsule, mobile sheet), `Footer`, `RootLayout` |
| Motion | `src/features/motion` | `MotionProvider` (system + manual reduced motion), `Reveal`, tokens |
| Hero field | `src/features/field` | `ModularField` (CSS tier), `fieldEngine` (WebGL tier, lazy), shared `layout.js` |
| Map | `src/features/map/worldGrid.js` | Natural Earth land as a 2° dot grid, 366 runs, ~3 KB |
| Integrations | `src/config/endpoints.js` | Legacy endpoints, unchanged |
| Legacy app | `src/legacy/**` | Byte-for-byte production code, unchanged |

## The hero field

The field is 29 tiles on a 6 × 5 grid. The brand modules (tall yellow leaf, orange over blue) sit at the
centre in the logo's arrangement. Other tiles borrow the logo's corner radii. The logo file is never
modified.

| Tier | When | How |
|---|---|---|
| Static | First paint (also in `public/index.html`) | Plain HTML tiles in CSS 3D (`rotateX(58°) rotateZ(-42°)`) with stacked-shadow extrusion |
| CSS motion | Always, unless reduced motion | One gentle wave every ~2.7 s (CSS transitions), pointer tilt ±6°. Pauses when off-screen or the tab is hidden |
| WebGL | ≥ 1024 px, fine pointer, WebGL available, no Save-Data, motion allowed | Loaded after `requestIdleCallback`. Extruded rounded tiles, `MeshPhysicalMaterial` with clearcoat, a `RoomEnvironment` reflection map, one soft shadow map, neutral tone mapping (brand colours stay true). Renders **on demand**, drawing no frames once tiles settle. Programs are compiled with `compileAsync`. Cross-fades over the CSS tier |

Any WebGL failure leaves the CSS tier on screen. `dispose()` releases every geometry, material,
texture and listener on unmount.

## Accessibility architecture
- Landmarks: header nav ("Primary"), mobile nav ("Mobile"), `main`, footer navs. The skip link comes first.
- The capability index and industry tabs are ARIA tab sets (arrow keys, Home and End). Offices are an
  accordion with the heading wrapping its button.
- Mobile menu: Escape closes it and focus returns to the button. Page content behind it is `inert`.
- Reduced motion: follows the OS setting, with a manual toggle in the footer. All reveals, the wave and WebGL turn off.
- The contact form uses visible labels, `aria-invalid` with `aria-describedby` errors, focus on the first
  invalid field, and a focusable status message after sending.
