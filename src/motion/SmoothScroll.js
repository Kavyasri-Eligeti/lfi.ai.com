import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, refreshWhenSettled } from "./index";

/* ==========================================================================
   Smooth scrolling.

   Lenis replaces the browser's wheel/trackpad easing with a damped one, which
   is what gives a scroll-driven page its weight: scrubbed timelines advance
   on a smoothed value rather than on the raw, slightly stepped wheel delta.

   Three rules this file exists to enforce:

     1. ONE animation loop. Lenis is NOT allowed to run its own rAF
        (`autoRaf: false`); GSAP's ticker drives it. Two loops would mean two
        different clocks updating the same frame, which shows up as jitter in
        anything scrubbed.

     2. ScrollTrigger updates FROM Lenis. Lenis moves real `window.scrollY`
        (it is not a transformed wrapper), so no scrollerProxy is needed - but
        it moves it inside its own loop, so ScrollTrigger has to be told when.

     3. It is OFF under reduced motion. The instance is never constructed, so
        the visitor keeps the browser's native scrolling exactly as configured.

   Native behaviour that must survive and is covered by the options below:
   keyboard paging and arrow keys, anchor jumps, and scrolling inside any
   element marked `data-lenis-prevent` (the mobile nav drawer).
   ========================================================================== */

let instance = null;

/** The live Lenis instance, or null when smooth scrolling is off. */
export function getLenis() {
  return instance;
}

/**
 * Scroll to a target, through Lenis when it is running and natively when it
 * is not. Used by the router's hash handling, so a cross-page link to
 * `/#contact` behaves exactly like clicking `#contact` on the page itself.
 *
 * Neither branch takes a header offset: Lenis reads `scroll-padding-top` when
 * it resolves a target, and `scrollIntoView` honours it too. The stylesheet
 * owns that number.
 */
export function scrollToTarget(target, { immediate = false } = {}) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  if (instance) {
    instance.scrollTo(el, { immediate, duration: immediate ? 0 : 1.1 });
    return;
  }

  el.scrollIntoView({
    behavior: immediate || prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

/** Pause/resume - used while the mobile drawer holds the body. */
export function setScrollLocked(locked) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Still make sure triggers are measured against the settled layout.
      refreshWhenSettled();
      return undefined;
    }

    const lenis = new Lenis({
      // Critically damped enough to feel immediate; high enough to smooth the
      // wheel's steps. Above ~0.12 the page starts to feel like it is sliding.
      lerp: 0.1,
      smoothWheel: true,
      // Touch scrolling stays native. Hijacking it on a phone is the single
      // most common way a smooth-scroll library breaks a site.
      syncTouch: false,
      // Lenis handles same-page anchors itself, so a plain href="#id" in the
      // markup still works with no JS handler attached to it - the nav links,
      // the hero's CTAs and the scroll cue are all plain anchors and stay
      // copyable, middle-clickable and keyboard-activatable.
      //
      // No offset is passed on purpose. Lenis reads `scroll-padding-top` from
      // the document when it resolves a target, and index.css already sets it
      // to clear the sticky header - passing an offset here as well applied
      // the header height TWICE and landed every anchor 88px below its
      // heading.
      anchors: true,
      autoRaf: false,
    });

    instance = lenis;

    // ScrollTrigger must recompute on Lenis' clock, not the browser's.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // The single loop. gsap.ticker time is in seconds; Lenis wants ms.
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    refreshWhenSettled();
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
