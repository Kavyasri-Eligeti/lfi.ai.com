# 01 · Repository and content audit

_Audit date: 2026-09-30 · Branch: `feature/ai-universe`_

## 1. What the folder contained

`Website_Catalogue(1)/` was delivered with **configuration only**: `package.json`, `package-lock.json`,
`README.md` (CRA boilerplate), `.gitignore` and `azure-pipelines.yml`. There was no `src/`, no `public/`
and no git history.

## 2. Source recovery

The live site `https://lfiai.com` publishes its production **source maps**
(`/static/js/main.9fe686d8.js.map`, `/static/css/main.526e5807.css.map`,
`/static/js/453.ab21e7ab.chunk.js.map`), and those maps contain the full `sourcesContent`. The
application's own sources were extracted from them (node_modules entries were skipped). The `public/`
assets were downloaded from the same host.

**Verification:** building the recovered source with the locked dependencies produced
`main.9fe686d8.js`, `main.526e5807.css` and `453.ab21e7ab.chunk.js`. These are **byte-identical
hashes to production**, so the recovered code is exactly what is deployed.

Git history created locally:

| Commit | Content |
|---|---|
| `756932c` (main) | Baseline: the five files as received |
| `83540d5` (main) | Production source recovered from source maps (exact) |
| `feature/ai-universe` | All new work (this project) |

> ⚠ **Action for the team:** the real Azure DevOps repository may contain history or files that the
> source maps do not (for example, unreferenced files). Before merging, diff this branch against it.
>
> ⚠ **Security:** public source maps expose the complete source. Set `GENERATE_SOURCEMAP=false` for
> production builds (see `.env.example`).

## 3. Technical inventory (as found)

| Area | Finding |
|---|---|
| Framework | Create React App 5 (`react-scripts 5.0.1`), React 19.1, React Router 7.8 (`BrowserRouter`) |
| UI | Bootstrap 5.3 (npm **and** CDN in `index.html`), react-icons, inline styles |
| Other deps | framer-motion (unused by the old app), recharts + lodash (ReportGenerator), web-vitals 2 |
| Routes | `/`, `/BankingAnalytics`, `/TelecomAnalytics`, `/BankingTelecomAnalytics`, `/golf-analyzer`, `/resume-summarizer`, `/jd-cv-comparison`, `/users`, `/generate-report` |
| Backend calls | `10.2.0.70:5001/analyze/`, `10.2.0.70:5002/match-jd-cv/`, `10.2.0.70:5002/summarize-pdf`, `10.2.0.65:8020/users`, an **ngrok** URL for `/api/recommendations` |
| Env vars | None used |
| Hosting | Apache (SPA fallback: unknown paths return `index.html`); `.htaccess` present on the server (403). Host injects a GoDaddy monitoring script |
| CI/CD | Azure Pipelines on `main` → `npm run build` → **FTP mirror** of `build/` to web root; FTP SSL is disabled (`set ftp:ssl-allow no`) |
| SEO | JSON-LD (Organization, WebSite, ItemList, FAQPage), OG/Twitter tags, `robots.txt` (AI crawlers allowed), `sitemap.xml` |

### Risks found

1. **Any push to `main` deploys to production** (no approval gate).
2. FTP deploy without TLS: credentials and files travel unencrypted. Recommend SFTP/FTPS.
3. `mirror -R build /` overwrites the web root. It does **not** delete stale files, but it would
   overwrite a server `.htaccess` if one were ever added to `public/`. This project deliberately does
   **not** add an `.htaccess`.
4. Internal tools call **private-network IPs** (`10.2.x.x`) over plain HTTP from a public HTTPS page.
   Browsers block these as mixed content outside the Linkfields network. Behaviour is unchanged.
5. The ngrok URL is ephemeral and will break when that tunnel changes.
6. Two catalogue entries share one URL: "Digital Twin" → `https://uks.lfiai.com/` (the Unmanned Kiosk
   URL). It is preserved as-is and flagged in the UI.

## 4. Reference-site review

- **linkfields.com**: source of truth for solutions, services, industries, company, careers, offices,
  partners and socials. Extracted verbatim into `src/content/*` (see 02-content-inventory.md).
- **lfiai.com**: the demo catalogue. All 38 active entries were preserved (see 06-routes-and-demos.md).
- **docs.aws.amazon.com**: reviewed for hierarchy only (see 05-design-system.md). No AWS assets, logos or
  layouts are used, and nothing implies AWS affiliation.

## 5. Items that need business confirmation

| Item | Why |
|---|---|
| Industries "retail, healthcare, public sector" | They appear in lfiai.com structured data but **not** on linkfields.com. Not used on the site |
| Proposed AI solutions (14) and services (17) | Shown only with a *Proposed* badge. They need approval before being presented as offerings |
| "AI Agents" planet | No demo exists. Shown as *Proposed* |
| NASSCOM / DUNS mentions | Seen on linkfields.com but not verified in detail. Omitted |
| "16 years" statistic | Written in 2024. Replaced by "Established 2008" to avoid a stale figure |
| Contact form | No verified backend. The site links to the official form and mailto addresses |
| GoodFirms profile URL | Not found in the page source. Omitted |
