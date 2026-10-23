import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import PortfolioVisual from "./PortfolioVisual";
import { portfolios, partners } from "../../data/profile";
import { PORTFOLIO_EVENT } from "./portfolioEvents";
import "./Portfolios.css";

const partnerById = Object.fromEntries(partners.map((p) => [p.id, p]));
const pad = (n) => String(n).padStart(2, "0");
const COUNT = portfolios.length;

/* ==========================================================================
   Five verticals. One integrated partner. - a full-screen carousel.

   The section is exactly one screen tall: the viewport minus the navbar's
   MEASURED height (--lfi-nav-h, published by the Header). All five slides
   sit side by side on a track that is moved with a transform, so switching
   portfolio never scrolls the page - only the carousel content changes.

   Controls, all driving one `active` index:
     - the five portfolio cards (a WAI-ARIA tablist: arrows, Home, End),
     - previous / next arrows and pagination dots,
     - horizontal swipe on touch screens,
     - the hero chips and "Who we are" pills (via PORTFOLIO_EVENT).

   FITTING. A portfolio's content cannot be allowed to overflow one screen, and
   screens range from a 4K monitor to a phone. Rather than guess with
   breakpoints, a layout pass measures every slide and steps through density
   levels until all five fit:

     0  full     - everything, including the panel artwork
     1  tight    - artwork dropped, spacing and type tightened
     2  split    - the detail column shows one group at a time behind a
                   two-way switch (services / IP & accelerators), so nothing
                   is removed, only paged
     3  compact  - split, with duplicated furniture dropped (the slide's own
                   counter repeats the pagination, the progress bar repeats
                   the dots, the group label repeats the switch), type and
                   spacing tightened, and the switch goes three-way (services
                   / IP / accelerators). This is the phone layout.
     4  fallback - compact, plus the slide may scroll internally. Only
                   reached on unusually short screens (landscape phones).

   The level is written straight to the section as `data-density` inside a
   layout effect, so the browser never paints an overflowing frame.
   ========================================================================== */
export default function Portfolios() {
  const [active, setActive] = useState(0);
  const [group, setGroup] = useState("deliver");
  // The slide currently playing its entrance. Kept separate from `active`
  // and cleared once the entrance is over: the fit pass toggles groups'
  // display while it measures, and an animation that is still applied would
  // replay - blanking the content - every time it did.
  const [entering, setEntering] = useState(-1);
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);
  const activeRef = useRef(0);
  const groupRef = useRef("deliver");
  activeRef.current = active;
  groupRef.current = group;

  const go = useCallback((i) => {
    setActive(((i % COUNT) + COUNT) % COUNT);
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }
    setEntering(active);
    const t = window.setTimeout(() => setEntering(-1), 1300);
    return () => window.clearTimeout(t);
  }, [active]);

  /* Other sections can open a slide. */
  useEffect(() => {
    const onSelect = (e) => {
      const i = portfolios.findIndex((x) => x.id === e.detail);
      if (i >= 0) setActive(i);
    };
    window.addEventListener(PORTFOLIO_EVENT, onSelect);
    return () => window.removeEventListener(PORTFOLIO_EVENT, onSelect);
  }, []);

  /* Tablist keyboard model. Focus moves without scrolling the page. */
  const onKeyDown = useCallback(
    (e) => {
      const last = COUNT - 1;
      const cur = activeRef.current;
      let n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = cur === last ? 0 : cur + 1;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = cur === 0 ? last : cur - 1;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = last;
      if (n === null) return;
      e.preventDefault();
      go(n);
      tabRefs.current[n]?.focus({ preventScroll: true });
    },
    [go]
  );

  /* Swipe. Horizontal only - a vertical drag stays a page scroll. */
  const touch = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(activeRef.current + (dx < 0 ? 1 : -1));
    }
  };

  /* Fit pass: pick the roomiest density at which every slide fits. */
  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return undefined;

    const overflows = (el) => el.scrollHeight > el.clientHeight + 1;
    const slideFits = (s, level) => {
      if (overflows(s)) return false;
      for (const part of s.querySelectorAll(".pf-car__lead, .pf-car__detail")) {
        if (overflows(part)) return false;
      }
      // At full density the artwork must still have room to read.
      if (level === 0) {
        for (const v of s.querySelectorAll(".pf-vis")) {
          if (v.getBoundingClientRect().height < 84) return false;
        }
      }
      return true;
    };
    const allFit = (level) => {
      const slides = [...sec.querySelectorAll(".pf-car__slide")];
      if (level < 2) return slides.every((s) => slideFits(s, level));
      // Split: EVERY group has to fit, whichever is showing.
      return ["deliver", "ip", "accel"].every((g) => {
        sec.dataset.group = g;
        return slides.every((s) => slideFits(s, level));
      });
    };

    const apply = (level) => {
      sec.dataset.density = String(level);
      sec.dataset.split = level >= 2 ? "true" : "false";
      sec.dataset.compact = level >= 3 ? "true" : "false";
    };
    const fit = () => {
      let level = 0;
      for (; level < 4; level++) {
        apply(level);
        if (allFit(level)) break;
      }
      apply(level);
      sec.dataset.group = groupRef.current;
    };

    fit();
    let raf = 0;
    const refit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refit) : null;
    if (ro) {
      ro.observe(sec);
      // The heading and card strip share the section's fixed height with the
      // slides, and they change size on their own: the heading's line reveal
      // re-wraps it when it scrolls into view. Re-fitting on THEIR size too
      // is what keeps the slides' budget honest. (No feedback loop: a refit
      // that picks the same level changes nothing.)
      sec.querySelectorAll(".pf-car__top, .pf-car__nav").forEach((el) => ro.observe(el));
    }
    // And re-fit whenever the carousel comes into view. Measurements taken
    // while the page is still loading far above it can be transiently
    // pessimistic (a phone was left on the scroll fallback although the
    // compact layout fit); the moment it is actually seen is the one that
    // has to be right.
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) refit();
          })
        : null;
    if (io) io.observe(sec);
    // Text metrics change when the web fonts arrive. `fonts.ready` alone is
    // not enough: it can resolve before Manrope has even started loading, so
    // the fallback face got measured and phones were left on the scroll
    // fallback. `loadingdone` fires when the face actually lands.
    const fonts = document.fonts;
    if (fonts && fonts.ready) fonts.ready.then(refit).catch(() => {});
    if (fonts && fonts.addEventListener) fonts.addEventListener("loadingdone", refit);
    window.addEventListener("load", refit);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (fonts && fonts.removeEventListener) fonts.removeEventListener("loadingdone", refit);
      window.removeEventListener("load", refit);
    };
  }, []);

  /* On narrow screens the card row scrolls sideways; keep the active card in
     view. Horizontal only - the page itself must not move. */
  useEffect(() => {
    const tab = tabRefs.current[active];
    const strip = tab && tab.parentElement;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const tr = tab.getBoundingClientRect();
    const sr = strip.getBoundingClientRect();
    strip.scrollTo({
      left: strip.scrollLeft + (tr.left - sr.left) - (sr.width - tr.width) / 2,
      behavior: "smooth",
    });
  }, [active]);

  // Keep the shown group in step with the switch.
  useEffect(() => {
    if (sectionRef.current) sectionRef.current.dataset.group = group;
  }, [group]);

  const current = portfolios[active];

  return (
    <section
      className="pf-car"
      id="portfolios"
      data-light="ember"
      data-scroll-align="edge"
      data-density="0"
      data-compact="false"
      data-split="false"
      data-group="deliver"
      ref={sectionRef}
      style={{ "--pf-active": `var(--pf-${current.tone})`, "--i": active }}
    >
      <div className="lfi-container pf-car__inner">
        {/* --- heading + controls --------------------------------------- */}
        <div className="pf-car__top">
          <SectionHeading eyebrow="Service portfolios" title="Five verticals. One integrated partner." wide />
          <div className="pf-car__controls">
            <button type="button" className="pf-car__arrow" onClick={() => go(active - 1)} aria-label="Previous portfolio">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="pf-car__dots">
              {portfolios.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className="pf-car__dot"
                  aria-label={`Show ${p.name}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <p className="pf-car__counter" aria-hidden="true">
              <strong>{pad(active + 1)}</strong> / {pad(COUNT)}
            </p>
            <button type="button" className="pf-car__arrow" onClick={() => go(active + 1)} aria-label="Next portfolio">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- the five navigation cards --------------------------------- */}
        <div className="pf-car__nav">
          <div className="pf-car__tabs" role="tablist" aria-label="Service portfolios" onKeyDown={onKeyDown}>
            {portfolios.map((item, i) => (
              <button
                key={item.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`pf-tab-${item.id}`}
                aria-selected={i === active}
                aria-controls={`pf-panel-${item.id}`}
                tabIndex={i === active ? 0 : -1}
                className="pf-pf__tab"
                style={{ "--tone": `var(--pf-${item.tone})` }}
                onClick={() => go(i)}
              >
                <span className="pf-pf__tab-num">{pad(i + 1)}</span>
                <span className="pf-pf__tab-name">{item.name}</span>
                <span className="pf-pf__tab-motto">{item.motto.join(" · ")}</span>
              </button>
            ))}
          </div>
          <div className="pf-car__progress" aria-hidden="true">
            <span style={{ width: `${((active + 1) / COUNT) * 100}%` }} />
          </div>
        </div>

        {/* --- the slides ---------------------------------------------- */}
        <div className="pf-car__viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="pf-car__track">
            {portfolios.map((p, i) => (
              <Slide
                key={p.id}
                p={p}
                index={i}
                isActive={i === active}
                isEntering={i === entering}
                group={group}
                onGroup={setGroup}
              />
            ))}
          </div>
        </div>

        <p className="lfi-sr" aria-live="polite">
          Portfolio {active + 1} of {COUNT}: {current.name}
        </p>
      </div>
    </section>
  );
}

/** One portfolio. Inactive slides stay rendered (the track needs them) but are
 *  inert and hidden from assistive technology. */
function Slide({ p, index, isActive, isEntering, group, onGroup }) {
  const ipLabel = p.models ? "Engagement models" : "Linkfields IP";
  const accelLabel = p.scale ? "Scale" : "Accelerators";
  return (
    <div
      role="tabpanel"
      id={`pf-panel-${p.id}`}
      aria-labelledby={`pf-tab-${p.id}`}
      aria-hidden={!isActive}
      inert={!isActive}
      className={`pf-car__slide${isActive ? " is-active" : ""}${isEntering ? " is-entering" : ""}`}
      style={{ "--tone": `var(--pf-${p.tone})` }}
    >
      {/* --- the coloured card ----------------------------------------- */}
      <div className="pf-car__lead" style={{ "--d": 0 }}>
        <p className="pf-pf__count">
          {pad(index + 1)} / {pad(COUNT)}
        </p>
        <h3 className="pf-pf__name">{p.name}</h3>
        <p className="pf-pf__motto">{p.motto.join(" · ")}</p>
        <p className="pf-pf__summary">{p.summary}</p>
        <PortfolioVisual kind={p.visual} photo={p.photo} />
      </div>

      {/* --- the detail ------------------------------------------------ */}
      <div className="pf-car__detail">
        {/* Only shown at split density. Two-way at "split" (the second
            button shows IP and accelerators together), three-way at
            "compact", where the accelerators get a page of their own. */}
        <div className="pf-car__switch" role="group" aria-label="Show">
          <button type="button" aria-pressed={group === "deliver"} onClick={() => onGroup("deliver")}>
            What we deliver
          </button>
          <button
            type="button"
            className="pf-car__switch-ip"
            aria-pressed={group !== "deliver"}
            onClick={() => onGroup("ip")}
          >
            {ipLabel}
          </button>
          <button
            type="button"
            className="pf-car__switch-accel"
            aria-pressed={group === "accel"}
            onClick={() => onGroup("accel")}
          >
            {accelLabel}
          </button>
        </div>

        <div className="pf-car__group pf-car__group--deliver" style={{ "--d": 1 }}>
          <h4 className="pf-pf__label">What we deliver</h4>
          <ul className="pf-pf__deliver">
            {p.deliver.map((d) => (
              <li key={d.title}>
                <span className="pf-pf__dot" aria-hidden="true" />
                <div>
                  <h5>{d.title}</h5>
                  <p>{d.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="pf-car__group pf-car__group--more" style={{ "--d": 2 }}>
          <div className="pf-car__group-ip">
          {p.ip ? (
            <div className={`pf-pf__iprow${p.platforms ? " has-platforms" : ""}`}>
              <div>
                <h4 className="pf-pf__label">Linkfields IP</h4>
                <ul className={`pf-pf__ip pf-pf__ip--${Math.min(p.ip.length, 4)}`}>
                  {p.ip.map((ip) => (
                    <li key={ip.name} className={ip.logo ? "pf-pf__ipcard" : "pf-pf__ipcard is-dark"}>
                      {ip.logo ? (
                        <img src={ip.logo} width={ip.w} height={ip.h} alt={ip.name} decoding="async" />
                      ) : (
                        <h5>{ip.name}</h5>
                      )}
                      <p>{ip.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {p.platforms ? (
                <div>
                  <h4 className="pf-pf__label">Platforms we deliver</h4>
                  <ul className="pf-pf__platforms">
                    {p.platforms.map((id) => (
                      <li key={id} className="pf-logo-tile">
                        <img src={partnerById[id].src} width="538" height="272" alt={partnerById[id].name} decoding="async" />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {p.models ? (
            <div>
              <h4 className="pf-pf__label">Engagement models</h4>
              <ol className="pf-pf__models">
                {p.models.map((m, i) => (
                  <li key={m.title} style={{ "--k": i }}>
                    <span className="pf-pf__model-num">{pad(i + 1)}</span>
                    <strong>{m.title}</strong>
                    <span>{m.body}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          </div>

          <div className="pf-pf__chips-row pf-car__group-accel">
            <h4 className="pf-pf__label">{accelLabel}</h4>
            <ul className="pf-pf__chips">
              {(p.scale || p.accelerators).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
