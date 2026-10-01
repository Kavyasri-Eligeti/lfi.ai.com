# 08 · Deployment and rollback

> **Nothing has been deployed.** Production deployment requires explicit authorisation. The Azure
> pipeline deploys on **every push to `main`** of the Azure DevOps repository, so merging this branch
> there **is** a deployment.

## Local development

```bash
npm ci
npm start                 # http://localhost:3000
npm test                  # Jest: content integrity + rendering (CI=true for a single run)
npm run build             # production build in ./build (use GENERATE_SOURCEMAP=false)
npm run serve:build       # serve ./build at http://localhost:5050 with SPA fallback
npm run test:e2e          # Playwright (uses installed Google Chrome): routes, keyboard, menu, WebGL, screenshots
```

## Recommended release path

1. **Review** the branch `feature/ai-redesign` (GitHub: KavyaSriEligeti1/lfi.ai.com) and the open
   content questions in `docs/02-content-inventory.md`.
2. **Business sign-off** on the hero headline and on every *Proposed* item.
3. **Staging.** Deploy `build/` to a staging host with the same Apache SPA fallback and run
   `npm run test:e2e` against it (set `baseURL` in `playwright.config.js`).
4. **Harden the pipeline before release** (recommended, needs approval):
   - add an environment approval gate on `main`;
   - switch FTP to FTPS/SFTP;
   - build with `GENERATE_SOURCEMAP=false` so the source is no longer published;
   - use `npm ci`;
   - **enable compression for JS and CSS on the Apache host.** Today only HTML is gzipped. `main.js` is
     served uncompressed, which is the largest remaining cost on mobile (see 07).
5. **Release:** merge to `main`. The pipeline builds and mirrors `build/` to the web root.
6. **Smoke test after release:** `/`, `/solutions#products`, `/services`, `/company#offices`, `/contact`,
   `/catalogue`, `/BankingAnalytics`, `/golf-analyzer` (from the Linkfields network), `/sitemap.xml`.

### Server requirements
- SPA fallback: unknown paths must return `index.html`. The current Apache configuration already does
  this. No `.htaccess` is shipped.
- Caching: `index.html` → `no-cache`; `/static/*` → `max-age=31536000, immutable`; `/fonts/*` and
  `/images/*` → long cache.

## Rollback

| Scenario | Action | Time |
|---|---|---|
| Visual problem with the 3D hero only | Hot-fix `canUseWebGL()` in `src/features/field/ModularField.jsx` to `return false` (the CSS field stays) | minutes |
| Any production issue | `git revert <merge-commit>` on `main` and push. The pipeline redeploys the previous app | ~5 min |
| Pipeline unavailable | Rebuild commit `83540d5` (production source, byte-identical) and upload `build/` | ~15 min |
| Hot standby | Before release, archive the live web root, then restore it with `mirror -R` | ~5 min |

All original URLs exist in both versions, so a rollback never breaks inbound links.
