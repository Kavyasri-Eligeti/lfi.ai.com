import React, { useEffect, useState } from "react";

/**
 * The page's lighting rig.
 *
 * Renders every key light once, parked at opacity 0, and turns exactly one of
 * them on. Which one is decided by whichever `[data-light]` section currently
 * owns the middle of the viewport.
 *
 * Why an IntersectionObserver with a centre-band root margin rather than a
 * ScrollTrigger per section: this is a single piece of global state, not nine
 * independent animations, and the band means the light changes when a section
 * takes over the screen rather than the instant its top edge appears. Entering
 * on the top edge makes the lighting flicker between two rooms while the
 * visitor is still in the doorway.
 *
 * The observer is the only thing running - the cross-fade itself is a CSS
 * opacity transition, so scrolling costs nothing per frame.
 *
 * Deliberately NOT tied into GSAP/ScrollTrigger: the lighting has to survive
 * the animation layer failing. If this component never runs, the washes stay
 * at opacity 0 and the site is simply the flat dark it was before - which is
 * a complete, shipped design, not a broken one.
 */

/** Order is paint order; only one is ever visible. */
const LIGHTS = ["deep", "violet", "azure", "amber", "ember"];

const DEFAULT_LIGHT = "deep";

export default function Ambient() {
  const [light, setLight] = useState(DEFAULT_LIGHT);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;

    const sections = Array.from(document.querySelectorAll("[data-light]"));
    if (!sections.length) return undefined;

    /* Tracked here rather than read back off the DOM, so the decision is made
       against what is actually on screen in this frame. */
    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target, entry);
          else visible.delete(entry.target);
        });

        if (!visible.size) return;

        /* The section covering most of the centre band wins. Two sections are
           always in the band during a handover, and picking the first one in
           document order would make the light change late on the way down and
           early on the way up - i.e. differently depending on direction. */
        let best = null;
        let bestRatio = -1;
        visible.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = entry.target;
          }
        });

        const next = best?.getAttribute("data-light");
        if (next && LIGHTS.includes(next)) setLight(next);
      },
      {
        /* Only the middle third of the viewport counts as "the room you are
           in". A section has to genuinely take over the screen to re-light
           the page. */
        rootMargin: "-33% 0px -33% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lfi-ambient" aria-hidden="true">
      {LIGHTS.map((key) => (
        <span
          key={key}
          className={`lfi-ambient__wash lfi-ambient__wash--${key}`}
          data-on={key === light}
        />
      ))}
      <span className="lfi-ambient__grain" />
    </div>
  );
}
