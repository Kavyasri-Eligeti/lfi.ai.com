# Linkfields AI: AI Universe & Demo Catalogue

The website behind **lfiai.com**. It is a cinematic 3D "AI universe" that presents Linkfields Innovations'
AI and analytics demos alongside the company's solutions, services, industries, company, careers and
contact information. It also preserves every page and link of the original demo catalogue.

- **3D universe:** 8 AI-category planets orbit an original AI emblem. Solutions and Services worlds and
  an Industries constellation are visited by a scroll-driven camera. Built in plain Three.js, loaded
  lazily after the page is interactive.
- **Readable first:** every piece of content is real HTML with conventional navigation. The 3D layer is
  an enhancement, with a static fallback (no WebGL2, reduced motion, "Reduce motion" toggle, context loss).
- **Honest content:** every item carries a status badge: *Linkfields offering*, *Live demo*, *Proposed*,
  *AI technology*, and so on. Proposed items are never presented as offerings, and tests enforce it.

## Quick start

```bash
npm ci
npm start          # dev server on http://localhost:3000
npm test           # content-integrity and rendering tests
npm run build      # production build in ./build
```

URL flags: `?profile=high|balanced|light|static`, `?debug=1` (performance HUD).

## Project structure

```
public/            index.html (SEO content + static hero shell), brand/, fonts/, images/, sitemap, robots
src/
  app/             App, router (new + legacy routes), navigation
  components/      brand/ (official logo, AI emblem SVG) · layout/ · ui/
  config/          endpoints.js: legacy backend URLs (env-overridable)
  content/         ★ all site content and its verification status
  features/        universe/ (3D engine + host) · globe/ · motion/
  hooks/ pages/ styles/ utils/
  legacy/          the original production catalogue, preserved unchanged
  __tests__/
docs/              audit, inventories, architecture, design system, QA report, deployment
```

To update content, edit `src/content/*`. Pages render from those files.

## Documentation

| Doc | Contents |
|---|---|
| [01-audit](docs/01-audit.md) | Repository audit, source recovery, risks, items needing confirmation |
| [02-content-inventory](docs/02-content-inventory.md) | Corporate content and status taxonomy |
| [03-ai-proposals](docs/03-ai-proposals.md) | Proposed AI solutions and services (awaiting approval) |
| [04-architecture](docs/04-architecture.md) | 3D scene, emblem, animation, rendering profiles, folder structure |
| [05-design-system](docs/05-design-system.md) | Typography, colour and tokens |
| [06-routes-and-demos](docs/06-routes-and-demos.md) | Preserved routes and the 38-entry demo inventory |
| [07-quality-report](docs/07-quality-report.md) | Performance, accessibility, build and test results |
| [08-deployment-and-rollback](docs/08-deployment-and-rollback.md) | Release path and rollback |

## Deployment

`azure-pipelines.yml` builds and FTP-mirrors `build/` on **every push to `main`**. Read
[docs/08](docs/08-deployment-and-rollback.md) before merging.

## Credits and licences
Open Sans © The Open Sans Project Authors (SIL OFL 1.1, `public/fonts/OFL-LICENSE.txt`). Simplex
noise GLSL © Ashima Arts / Stefan Gustavson (MIT). Three.js (MIT). GSAP (Standard "no charge" licence).
The Linkfields logo is © Linkfields Innovations and is used unmodified.
