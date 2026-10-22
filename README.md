# Linkfields AI — lfiai.com

The AI and analytics site of **Linkfields Innovations**. A Create React App
single-page app: a marketing site at `/`, a filterable demo catalogue at
`/demos`, and the pre-existing analytics and tooling routes, all preserved.

---

## Running it locally

```bash
npm ci          # install from the lockfile (npm install also works)
npm start       # dev server on http://localhost:3000
npm run build   # production build into ./build
```

`npm start` picks another port if 3000 is taken; to force one:

```bash
PORT=3001 npm start            # macOS / Linux / Git Bash
$env:PORT=3001; npm start      # PowerShell
```

To check a production build the way it will actually be served, use any static
server **with an SPA fallback** — every unknown path must return `index.html`
or client-side routes will 404 on a hard refresh:

```bash
npx serve -s build
```

---

## Configuration

All environment variables are optional. Put them in `.env.local` (git-ignored)
or set them in the build environment. CRA only exposes variables prefixed
`REACT_APP_`, and they are inlined at **build** time — rebuild after changing one.

| Variable | Default | Effect |
| --- | --- | --- |
| `REACT_APP_CONTACT_ENDPOINT` | _unset_ | URL that accepts a JSON `POST` from the contact form. |

### The contact form

There is **no form backend in this repository**, and the UI does not pretend
there is one. Behaviour depends on the variable above:

- **Unset (default).** The form validates, then hands the completed message to
  the visitor's email client via `mailto:` addressed to `sales@linkfields.com`.
  A visible notice says so, and the result message states the mail has *not*
  been sent yet. No success message is ever shown for something that was not
  submitted.
- **Set.** The form `POST`s JSON to that URL and reports the real outcome. A
  non-2xx response is shown as a failure, with the email fallback offered.

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

The payload is:

```json
{
  "name": "...", "email": "...", "company": "...", "phone": "...",
  "interest": "...", "message": "...", "source": "lfiai.com"
}
```

No secrets are read by the frontend, and none should be — anything in a
`REACT_APP_` variable ships in the JavaScript bundle and is public.

#### What the endpoint has to do

The browser half of this form is a convenience, not a control. Everything
that actually protects the inbox belongs on the server behind
`REACT_APP_CONTACT_ENDPOINT`, which must:

- re-validate every field, and reject on its own rules rather than trusting
  the shape of the request;
- sanitise values before they reach a mail body, a template or a database;
- rate-limit per IP and per sender address;
- hold the mail credentials — SMTP passwords and provider API keys never go in
  a `REACT_APP_` variable;
- return 2xx **only** once the message has genuinely been accepted, since the
  UI reports exactly what the endpoint reports.

The client contributes two cheap filters that cost a real visitor nothing: a
honeypot field (hidden from sight, from the tab order and from the
accessibility tree) and a three-second minimum fill time. Both are trivially
bypassed by anyone who looks, which is precisely why they are not a substitute
for the list above. A tripped check is reported as a failure with the email
route offered — never as a silent success.

**This integration is not configured.** Until an endpoint exists, the form
behaves as described above and says so on the page in the visitor's terms.
Treat the deployment as incomplete until it is wired up and tested end to end.

---

## Verifying the UI in a real browser

```bash
npm start            # terminal 1
npm run verify       # terminal 2
```

`npm run verify` drives headless Chromium (Playwright, a devDependency) over
the running site and checks the things only a browser can answer. It exits
non-zero on any failure, so it can sit in front of a deploy:

| Check | Why it is here |
| --- | --- |
| Horizontal overflow at 1440 / 1280 / 1024 / 768 / 390 / 360 | Names the offending element instead of just reporting a wide page. |
| Console errors, uncaught exceptions, failed requests | On both `/` and `/demos`. |
| Hero headline line breaks | The accent phrase ("business forward.") must occupy exactly one line box at every width — see `Hero.js`. |
| Ambient lighting | The fixed key-light layer must mount **and** change between sections. |
| `prefers-reduced-motion` | Nothing may be left stuck at `opacity: 0`. |
| Tablist keyboard operation | Arrow keys move selection, and exactly one tab is in the tab order. |

It writes a screenshot per breakpoint to `.verify/` (git-ignored). Options:

```bash
npm run verify -- --url=http://localhost:3001 --out=.tmp/shots
```

There is **no unit test suite** in this repository. `npm test` is wired to
react-scripts and currently finds no tests; this harness is the automated
check that exists.

---

## Project structure

```
public/
  assets/brand/           official logo assets (see "Brand" below)
  images/                 product artwork
  index.html              metadata, structured data, no-JS text fallback
src/
  data/                   all site content, separated from presentation
    company.js            verified company facts, offices, contact details
    demos.js              the demo catalogue + its taxonomy
    services.js           service lines, industries, differentiators
    solutions.js          AI capabilities, analysis steps, delivery stages
    nav.js                primary navigation
  components/
    layout/               Header (+ mobile drawer), Footer, Layout, ScrollManager
                          Ambient.js  the page's key-light rig (see below)
    sections/             one component per homepage section
    ui/                   Button, Logo, Icon, Reveal, NetworkSphere,
                          CapabilityVisual (capability schematics),
                          ProductMockup (product interface windows)
    *.js                  legacy demo components, unchanged in behaviour
  Pages/
    Home.js  Demos.js  NotFound.js
    Industries.js         the original catalogue explorer, kept at /explore
    *_Analytics.js        the original analytics pages
  styles/
    tokens.css            brand palette, type scale, spacing, motion
    global.css            layout primitives, all namespaced `lfi-`
    atmosphere.css        the fixed lighting layer (see below)
    animations.css        reveal system + reduced-motion fallback
    legacy-bootstrap.css  Bootstrap, layered, for the legacy pages only
  utils/meta.js           per-route title/description/canonical
```

Every class the redesign adds is prefixed `lfi-`, so it cannot collide with
Bootstrap or with the legacy pages' own styling.

### The lighting layer

`styles/atmosphere.css` + `components/layout/Ambient.js` are what make a long
dark page read as one lit space rather than as a stack of black blocks. One
fixed element behind the whole site carries five named key lights; each
section declares the one it wants with `data-light="deep|violet|azure|amber|ember"`,
and an IntersectionObserver watching the middle third of the viewport
cross-fades to it as that section takes over the screen.

Two consequences worth knowing before editing a section background:

- **Section backgrounds must stay translucent.** `--alt` and `--invert` are
  low-alpha white tints, not opaque fills. An opaque background paints over
  the lighting and flattens that section back out.
- **It degrades to nothing.** If the observer never runs, every wash stays at
  `opacity: 0` and the site is the flat dark it was before — a complete
  design, not a broken one. Nothing about the layout depends on it.

---

## Routes

| Route | What it is |
| --- | --- |
| `/` | Homepage — hero, solutions, products, services, industries, process, why, contact |
| `/demos` | Filterable catalogue of every demonstration |
| `/explore` | The original interactive catalogue explorer, preserved |
| `/BankingAnalytics`, `/TelecomAnalytics`, `/BankingTelecomAnalytics` | Original analytics pages |
| `/golf-analyzer`, `/resume-summarizer`, `/jd-cv-comparison` | Original demos — **corporate network only** |
| `/users`, `/generate-report` | Original internal tooling — **corporate network only** |
| anything else | 404 page |

### Routes that need the corporate network

These call services on `10.2.0.x` / `10.2.0.65`, so they cannot load for a
visitor outside the Linkfields network — they hang on a request that never
completes. They are kept working and are labelled as internal in the catalogue
rather than presented as links anyone can open:

| Route | Backend |
| --- | --- |
| `/golf-analyzer` | `http://10.2.0.70:5001/analyze/` |
| `/resume-summarizer` | `http://10.2.0.70:5002/summarize-pdf` |
| `/jd-cv-comparison` | `http://10.2.0.70:5002/match-jd-cv/` |
| `/users` | `http://10.2.0.65:8020/users` |
| `/generate-report` | an ngrok tunnel (see below) |

These URLs are hard-coded in the components. Moving them to `REACT_APP_*`
variables would be the natural next cleanup; it was left alone here because it
changes the behaviour of working pages.

---

## Brand

`public/assets/brand/` holds the official logo, extracted directly from the
supplied `linkfields-innovation-ai-logo.svg` sheet — same paths, same
gradients, same proportions. The mark is never redrawn in markup or
substituted with text.

| File | Use |
| --- | --- |
| `lfi-logo-dark.svg` | Full lockup, light text — for dark backgrounds |
| `lfi-logo-light.svg` | Full lockup, dark text — for light backgrounds |
| `lfi-mark.svg` | Icon mark only |
| `lfi-mark-flat.svg` | Flat mark, for sizes below ~48px |
| `lfi-icon.svg` | App icon (mark on the brand black square) |

`favicon.ico`, `logo192.png`, `logo512.png` and `apple-touch-icon.png` are
generated from `lfi-icon.svg`.

Palette, per the logo sheet: `#FFD600` yellow, `#FF7800` orange, `#2D58C0`
blue, `#000000` black, `#E6ECED` light text. These live in
`src/styles/tokens.css`. One deliberate deviation is documented there: the
sheet's grey `#737677` fails WCAG AA at the small sizes this site uses it for,
so `--lfi-text-subtle` is a lighter step of the same hue.

The lockup is ~4.8:1. Size it by **height** — capping width stretches it.

---

## Content accuracy

Everything factual on this site is traceable to an official source, and the
files in `src/data/` cite theirs at the top:

- <https://linkfields.com/> — services, industries, recognition
- <https://www.linkfields.com/services/technology/ai-ml> — the six AI/ML capabilities
- <https://www.linkfields.com/company/about-us> — founding, vision, values
- <https://www.linkfields.com/company/our-approach> — the delivery stages
- <https://linkfields.com/contact-us> — offices, phone numbers, emails
- the existing lfiai.com catalogue — product names, descriptions, demo URLs

There are no invented customers, testimonials, case studies, certifications or
metrics. Industry use cases are labelled **illustrative** in the UI because
that is what they are.

The same rule governs the product interface mockups in
`src/components/ui/ProductMockup.js`: they draw the *shape* of each product's
interaction — a page resolving into fields, touchpoints collapsing into one
profile — and contain **no numerals at all**. No figures, counts, percentages
or axis labels, so nothing in them can be screenshotted and presented as a
measured result. The lead one carries a visible caption saying it is an
illustration; the live product is one click away in every case. The only social link is LinkedIn, which is the only one
that could be confirmed — the icons on linkfields.com carry no `href`.

Demo links were verified reachable on **2026-10-20** (`VERIFIED_ON` in
`src/data/demos.js`). Two demos were down at that point and are therefore not
listed: `consulate-sa.lfidemo.com` and `consulate-la.lfidemo.com` (both HTTP
502). `internal.lfidemo.com` is reachable but is an internal portal, so it is
not advertised on a public page. All three remain in `/explore`.

---

## Deployment

`azure-pipelines.yml` builds on push to `main` and deploys `build/` over FTP to
the site root. Two things worth knowing:

1. The pipeline runs `CI=false npm run build`, which downgrades warnings. The
   build also passes with `CI=true` (warnings as errors) — keep it that way.
2. The app uses `BrowserRouter`, so the **host must serve `index.html` for
   unknown paths**. Without that rewrite, `/demos` and the other routes 404 on
   a direct hit or a refresh, even though in-app navigation works.

---

## Known limitations

- No contact backend — see **Configuration** above.
- `/generate-report` calls a free ngrok tunnel
  (`ungenuine-neville-oasitic.ngrok-free.dev`), whose hostname changes every
  time the tunnel restarts. It will need a stable URL to keep working.
- Demo reachability is a point-in-time check, not a health check. If a demo
  goes down the catalogue will still link to it; re-verify and update
  `VERIFIED_ON` periodically.
- `caniuse-lite` is ~14 months old and warns on every build. `npx
  update-browserslist-db@latest` clears it; left alone here because it touches
  the lockfile.
