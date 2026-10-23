#!/usr/bin/env node
/* ==========================================================================
   Browser verification harness.

   Drives a real Chromium against a running site and checks the things that
   only a browser can tell you, at every breakpoint the design targets:

     - no horizontal overflow (and WHICH element is causing it)
     - no console errors and no uncaught exceptions
     - no failed network requests
     - the hero headline breaks where the design says it should, with the
       accent phrase never split across lines
     - the scroll-driven lighting layer mounts and changes between sections
     - under prefers-reduced-motion nothing is left stuck at opacity 0
     - the tablists are operable from the keyboard

   It also writes a screenshot per breakpoint so a visual change can be eyed
   rather than guessed at.

   Usage:
     npm start                      # in one terminal
     npm run verify                 # in another
     npm run verify -- --url=http://localhost:3001 --out=.tmp/shots

   Exits non-zero if any check fails, so it can be dropped into CI in front
   of a deploy.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const BASE = arg("url", "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve(arg("out", ".verify"));

/* The breakpoints the design is specified against. */
const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "tabletp-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "small-360", width: 360, height: 740 },
];

const ROUTES = ["/", "/demos"];

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);
const note = (m) => notes.push(m);

/** Scroll the whole page so every reveal fires and lazy images decode. */
const settle = async (page) => {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight * 0.6) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await page.waitForTimeout(600);
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  /* --- 1. every breakpoint, every route ---------------------------------- */
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await ctx.newPage();

    page.on("console", (m) => {
      if (m.type() === "error") fail(`[${vp.name}] console: ${m.text()}`);
    });
    page.on("pageerror", (e) => fail(`[${vp.name}] uncaught: ${e.message}`));
    page.on("requestfailed", (r) => {
      // A cancelled navigation is not a broken asset.
      const err = r.failure()?.errorText || "";
      if (err.includes("ERR_ABORTED")) return;
      fail(`[${vp.name}] request failed: ${r.url()} (${err})`);
    });

    for (const route of ROUTES) {
      await page.goto(BASE + route, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      await page.waitForTimeout(2200);
      await settle(page);

      const report = await page.evaluate(() => {
        const de = document.documentElement;
        const out = {
          scrollW: de.scrollWidth,
          clientW: de.clientWidth,
          offenders: [],
        };
        if (de.scrollWidth > de.clientWidth + 1) {
          document.querySelectorAll("body *").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (!r.width) return;
            if (r.right > de.clientWidth + 1 || r.left < -1) {
              const cls = (
                el.className?.baseVal ??
                el.className ??
                ""
              )
                .toString()
                .split(" ")
                .slice(0, 2)
                .join(".");
              out.offenders.push(`${el.tagName}.${cls}`);
            }
          });
        }
        return out;
      });

      if (report.scrollW > report.clientW + 1) {
        fail(
          `[${vp.name}${route}] horizontal overflow ${report.scrollW}>${
            report.clientW
          } :: ${[...new Set(report.offenders)].slice(0, 8).join(" | ")}`
        );
      }

      await page.screenshot({
        path: path.join(
          OUT,
          `${route === "/" ? "home" : route.slice(1)}-${vp.name}.png`
        ),
      });
    }

    /* --- 2. the hero's art-directed line breaks -------------------------- */
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2400);

    const hero = await page.evaluate(() => {
      const h1 = document.querySelector(".pf-hero__title");
      if (!h1) return null;
      const accent = h1.querySelector(".lfi-accent");
      const lh = parseFloat(getComputedStyle(h1).lineHeight);
      return {
        lines: Math.round(h1.getBoundingClientRect().height / lh),
        // The accent phrase must occupy exactly one line box at every width.
        accentLines: accent ? accent.getClientRects().length : -1,
        text: h1.innerText.replace(/\n/g, " / "),
      };
    });

    if (!hero) fail(`[${vp.name}] hero headline not found`);
    else if (hero.accentLines !== 1) {
      fail(
        `[${vp.name}] hero accent phrase split across ${hero.accentLines} lines: "${hero.text}"`
      );
    } else {
      note(`[${vp.name}] hero: ${hero.lines} lines - "${hero.text}"`);
    }

    await ctx.close();
  }

  /* --- 2b. the profile is COMPLETE ---------------------------------------
     Reads the portfolio names straight out of src/data/profile.js and
     asserts each reaches the portfolio tablist, then checks that no image on
     the homepage is broken - logos, photos and the recognition art are all
     cut from the corporate deck, so a bad path is the likeliest regression.
     Desktop AND mobile, because content lost to a responsive rule is still
     lost.
     ----------------------------------------------------------------------- */
  {
    const src = fs.readFileSync(
      path.join(__dirname, "..", "src", "data", "profile.js"),
      "utf8"
    );
    const block = src.slice(
      src.indexOf("export const portfolios = ["),
      src.indexOf("export const about")
    );
    const expected = [...block.matchAll(/^\s{4}name:\s*"([^"]+)"/gm)].map(
      (m) => m[1]
    );

    if (expected.length !== 5) {
      fail(`expected 5 portfolios in src/data/profile.js, read ${expected.length}`);
    } else {
      for (const vp of [
        { name: "desktop-1440", width: 1440, height: 900 },
        { name: "mobile-390", width: 390, height: 844 },
      ]) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        const page = await ctx.newPage();
        await page.goto(BASE + "/", { waitUntil: "networkidle" });
        await page.waitForTimeout(2200);
        await settle(page);

        const seen = await page.evaluate(() =>
          [...document.querySelectorAll("#portfolios [role='tab']")].map((t) =>
            t.textContent.trim()
          )
        );
        const missing = expected.filter((n) => !seen.some((s) => s.includes(n)));
        if (missing.length)
          fail(`[${vp.name}] portfolios missing from the tablist: ${missing.join(", ")}`);
        else note(`[${vp.name}] all ${expected.length} portfolios rendered`);

        // Lazy images only load near the viewport, so walk the page first.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
        });
        await page.waitForLoadState("networkidle");
        const brokenImgs = await page.evaluate(() =>
          [...document.querySelectorAll("main img")]
            .filter((i) => i.complete && (!i.getAttribute("src") || i.naturalWidth === 0))
            .map((i) => i.getAttribute("src") || "(no src)")
        );
        if (brokenImgs.length)
          fail(`[${vp.name}] broken image(s): ${brokenImgs.join(", ")}`);
        else note(`[${vp.name}] every homepage image loaded`);

        await ctx.close();
      }
    }
  }

  /* --- 3. the lighting layer -------------------------------------------- */
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);

    const lights = await page.evaluate(async () => {
      const seen = new Set();
      const active = () => {
        const on = document.querySelector('.lfi-ambient__wash[data-on="true"]');
        return on ? on.className.split("--").pop() : null;
      };
      if (!document.querySelector(".lfi-ambient")) return null;
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += window.innerHeight * 0.5) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
        const a = active();
        if (a) seen.add(a);
      }
      return [...seen];
    });

    if (!lights) fail("ambient lighting layer did not mount");
    else if (lights.length < 2)
      fail(`ambient lighting never changed (only saw: ${lights.join(",")})`);
    else note(`ambient lighting cycled through: ${lights.join(", ")}`);

    await ctx.close();
  }

  /* --- 4. reduced motion: content must never stay hidden ----------------- */
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => fail(`[reduced-motion] uncaught: ${e.message}`));
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await settle(page);

    const hidden = await page.evaluate(() => {
      const bad = [];
      document
        .querySelectorAll("main :is(h1,h2,h3,p,li,a)")
        .forEach((el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          if (!r.width && !r.height) return;
          if (cs.visibility === "hidden" || cs.display === "none") return;
          if (parseFloat(cs.opacity) < 0.1) {
            bad.push(
              `${el.tagName} "${(el.textContent || "").trim().slice(0, 32)}"`
            );
          }
        });
      return [...new Set(bad)];
    });

    if (hidden.length)
      fail(
        `[reduced-motion] ${hidden.length} element(s) stuck invisible: ${hidden
          .slice(0, 5)
          .join(" | ")}`
      );
    else note("reduced motion: all content visible");

    await ctx.close();
  }

  /* --- 5. the tablists are operable from a keyboard ---------------------- */
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);

    for (const [label, sel] of [
      ["portfolios", ".pf-pf__tab"],
    ]) {
      const count = await page.locator(sel).count();
      if (!count) {
        fail(`${label} tablist not found`);
        continue;
      }
      await page.locator(sel).first().focus();
      const before = await page.locator(`${sel}[aria-selected="true"]`).first().textContent();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(250);
      const after = await page.locator(`${sel}[aria-selected="true"]`).first().textContent();
      if (before === after)
        fail(`${label} tablist does not respond to ArrowRight`);
      else note(`${label} tablist: ${before.trim()} -> ${after.trim()}`);

      // Roving tabindex: exactly one tab in the tab order.
      const inOrder = await page.$$eval(sel, (els) =>
        els.filter((e) => e.getAttribute("tabindex") === "0").length
      );
      if (inOrder !== 1)
        fail(`${label} tablist has ${inOrder} tabs in the tab order, expected 1`);
    }

    await ctx.close();
  }

  await browser.close();

  /* --- report ------------------------------------------------------------ */
  notes.forEach((n) => console.log("  ok  " + n));
  if (failures.length) {
    console.error(`\n${failures.length} check(s) FAILED:\n`);
    failures.forEach((f) => console.error("  x   " + f));
    console.error(`\nScreenshots: ${OUT}`);
    process.exit(1);
  }
  console.log(`\nAll checks passed. Screenshots: ${OUT}`);
}

main().catch((err) => {
  console.error("verify-ui could not run:", err.message);
  console.error("Is the site running? Try: npm start");
  process.exit(1);
});
