# 08 · Deployment and rollback

> **Nothing has been deployed.** Production deployment requires explicit authorisation.
> The existing pipeline deploys on **every push to `main`**, so merging this branch **is** a deployment.

## Local development

```bash
npm ci
npm start                 # http://localhost:3000
npm test                  # Jest: content integrity + rendering (CI=true for single run)
npm run build             # production build in ./build
```

Useful URL flags: `?profile=high|balanced|light|static` (force a rendering profile), `?debug=1`
(FPS / DPR / draw-call HUD).

## Recommended release path

1. **Reconcile with the real repository.** This branch was built on source recovered from production
   source maps (byte-identical build). Push `feature/ai-universe` to the Azure DevOps repo and open a PR
   against `main`. Review the diff against the real history.
2. **Business sign-off** on the items in `docs/01-audit.md §5` (especially every *Proposed* item).
3. **Staging.** Deploy `build/` to a staging host (for example `staging.lfiai.com`) with the same
   Apache SPA fallback, and run the checks in `docs/07-quality-report.md` there.
4. **Harden the pipeline before the first release** (recommended, needs approval):
   - add an environment approval gate on `main`;
   - switch FTP to **FTPS/SFTP** (`set ftp:ssl-allow yes`, verify certificates);
   - set `GENERATE_SOURCEMAP=false` in the build step so the source is no longer published;
   - use `npm ci` instead of the conditional `npm install`.
5. **Release:** merge the PR to `main`. The pipeline builds (`CI=false npm run build`) and mirrors
   `build/` to the web root.
6. **Post-release smoke test:** `/`, `/universe/data-intelligence`, `/demos`, `/catalogue`,
   `/BankingAnalytics`, `/golf-analyzer` (from the Linkfields network), `/sitemap.xml`, `/robots.txt`.

### Server requirements (unchanged)
- SPA fallback: unknown paths must return `index.html`. The current Apache config already does this.
  This project does **not** ship an `.htaccess`, so the server's own file is never overwritten.
- Recommended caching: `index.html` → `no-cache`; `/static/*` → `max-age=31536000, immutable`
  (hashed); `/fonts/*` → `max-age=31536000`.

## Rollback strategy

| Scenario | Action | Time |
|---|---|---|
| Visual/3D problem only | Tell users to use **Reduce motion**, or ship a hot-fix forcing STATIC: `detectProfile` → `return 'static'` | minutes |
| Any production issue | `git revert <merge-commit>` on `main` and push. The pipeline redeploys the previous app | ~5 min (pipeline) |
| Pipeline unavailable | Rebuild commit `83540d5` (recovered production, byte-identical to `main.9fe686d8`) locally and upload `build/` by FTP/SFTP | ~15 min |
| Keep a hot standby | Before release, archive the live web root (`lftp mirror / ./backup-YYYYMMDD`), then restore with `mirror -R` | ~5 min |

Because `lftp mirror -R` does not delete remote files, an old `static/js/main.9fe686d8.js` stays on the
server after release. A rollback therefore only needs the old `index.html`, which makes restoring the
backup near-instant.

All legacy URLs (`/BankingAnalytics`, `/golf-analyzer`, and the rest) exist in both versions, so a
rollback never breaks inbound links.
