# Linkfields AI website (lfiai.com)

The Linkfields Innovations AI website, in the **"Modular Intelligence"** design. It presents the
company's AI products and 38 live demos alongside its verified solutions, services, industries, company
information, careers and contact details. It also preserves every page and link of the original demo
catalogue.

- **Signature hero:** a field of tiles derived from the three modules of the Linkfields mark. It renders
  in CSS 3D on first paint and upgrades to an on-demand Three.js scene on capable desktops.
- **Light, editorial design system:** Hanken Grotesk and Open Sans, the brand "leaf" radius, and the exact
  logo colours. The official logo is never modified.
- **Honest content:** everything comes from linkfields.com or the original catalogue, and each item
  carries a status (*Linkfields offering*, *Live demo*, *Proposed*, and so on). Tests enforce this.

## Quick start

```bash
npm ci
npm start             # dev server on http://localhost:3000
npm test              # content-integrity and rendering tests (Jest)
npm run build         # production build in ./build
npm run serve:build   # serve ./build on http://localhost:5050
npm run test:e2e      # browser tests and screenshots (Playwright + installed Chrome)
```

## Project structure

```
public/             index.html (SEO content + static hero shell), brand/, fonts/, images/, sitemap, robots
src/app/            router, navigation
src/content/        all copy and data (company, services, solutions, industries, demos, capabilities, insights, careers, proposals)
src/components/     layout (header, footer), ui primitives, sections
src/features/       field (hero, CSS + WebGL tiers), motion, map
src/pages/          one folder per page
src/legacy/         the original production app, unchanged
e2e/                Playwright tests
docs/               audit, content inventory, architecture, design system, routes, quality, deployment
```

Read `docs/08-deployment-and-rollback.md` before deploying. **Every push to `main` in the Azure DevOps
repository deploys to production.**
