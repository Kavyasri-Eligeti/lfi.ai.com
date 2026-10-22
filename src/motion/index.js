/* ==========================================================================
   The motion core.

   One module owns plugin registration, the shared easing/duration language,
   and the reduced-motion decision. Everything else in src/motion imports
   gsap from here, so ScrollTrigger can never be used before it is registered
   and there is exactly one place where the motion vocabulary is defined.
   ========================================================================== */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/* Registration is idempotent in GSAP, but doing it at module scope means it
   has happened before any component body runs, rather than inside an effect
   that may be ordered after a trigger is created. */
gsap.registerPlugin(ScrollTrigger, SplitText);

/* ScrollTrigger's own defaults. `markers:false` is explicit so a stray debug
   flag can never ship, and the shared `invalidateOnRefresh` means every
   measured value is re-read on resize instead of being baked in at mount. */
ScrollTrigger.defaults({ markers: false, invalidateOnRefresh: true });

/* GSAP pauses the ticker after a long frame, which on a page with scrubbed
   triggers shows up as motion that "sticks" after a tab has been in the
   background. Disabling lag smoothing keeps scroll-linked values honest. */
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger, SplitText };

/**
 * The motion vocabulary. Three curves, and that is the whole list.
 *
 * `out`      - the entrance curve, used everywhere content arrives. A strong
 *              decelerate, so movement settles rather than stops.
 * `scrub`    - mandatory on anything scroll-linked. An eased scrub makes the
 *              page feel like it is lagging behind the scrollbar.
 * `emphasis` - the headline reveal only. Sharper than `out`, which is what
 *              gives a line of type its snap; used on anything else it reads
 *              as impatience.
 *
 * Keeping this short is the point - a palette of eight curves is how a site
 * ends up with nine section entrances that are all slightly different.
 */
export const EASE = {
  out: "power3.out",
  scrub: "none",
  emphasis: "expo.out",
};

/** Live check - a visitor can flip the OS setting without reloading. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True on a device that can actually hover, i.e. where pointer motion means something. */
export function hasFinePointer() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/**
 * Refresh ScrollTrigger once the page has settled.
 *
 * Fonts and lazily-decoded images change section heights after mount, and a
 * trigger measured before that is wrong for the rest of the session. Called
 * by the smooth-scroll provider rather than by individual sections.
 */
export function refreshWhenSettled() {
  if (typeof window === "undefined") return;
  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }
  window.addEventListener("load", refresh, { once: true });
}
