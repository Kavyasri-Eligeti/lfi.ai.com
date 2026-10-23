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

/** Bottom edge of the fixed header, measured live (it is 77px on desktop,
 *  65px on phones). */
function headerBottom() {
  const header = document.querySelector(".lfi-header");
  return header ? header.getBoundingClientRect().bottom : 0;
}

/* Breathing room between the bottom of the navbar and a section's first
   line of content. */
const CONTENT_GAP = 24;

/**
 * The window scroll position that puts `el`'s CONTENT just below the navbar.
 *
 * Aligning the element's outer edge is not enough, and was the bug: every
 * section carries ~90px of top padding (--lfi-section-y) before its eyebrow,
 * so a section flush with the navbar still showed a tall empty band and
 * looked as if the jump had stopped short. The padding is read from the
 * element itself, so this follows the design's own clamp() at every width,
 * and an element without padding simply lands flush.
 *
 * Clamped to the scrollable range: the last section may be too close to the
 * end of the page to reach the top, and asking for more is pointless.
 */
function targetY(el) {
  // A full-screen section (data-scroll-align="edge") fills the space under
  // the navbar exactly, so its edge - not its content - aligns to the bar.
  // A section that falls back to its natural, padded layout (contact on
  // phones: data-fit="natural") aligns by content like any other.
  const pad =
    el.dataset.scrollAlign === "edge" && el.dataset.fit !== "natural"
      ? 0
      : parseFloat(window.getComputedStyle(el).paddingTop) || 0;
  const inset = Math.max(0, pad - CONTENT_GAP);
  const y =
    window.scrollY + el.getBoundingClientRect().top - headerBottom() + inset;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(Math.round(y), max));
}

/**
 * Scroll to a target, through Lenis when it is running and natively when it
 * is not. Every in-page jump goes through here - nav links, the mobile drawer,
 * CTAs, the scroll cue, and the router's hash handling (direct URL access,
 * refresh, cross-page links) - so they all land in exactly the same place.
 *
 * The destination is an explicit pixel position from targetY(), computed with
 * getBoundingClientRect() against the measured navbar - not left to
 * `scroll-padding-top`, which only knows the element's outer edge.
 *
 * Then it SETTLES. The destination is fixed when the scroll starts, but the
 * page can still move underneath it - a lazy image above the target loading,
 * web fonts swapping, a heading being split for its reveal. So once the
 * scroll ends the target is re-measured and any remaining gap is closed with
 * a short correction; a few attempts at most, so it can never loop.
 */
/* The landing "hold".

   Settling fixes drift that happened DURING the scroll. On a freshly mounted
   page (arriving at /#portfolios from /demos, or a refresh) content above the
   target can still be growing for a moment AFTER it - images decoding, fonts
   swapping. So for a short window after landing, a ResizeObserver on the
   document re-aligns the target instantly whenever the page height changes.

   It lets go the moment the visitor does anything themselves - wheel, touch,
   key or pointer - so it can never fight a scroll they started. */
let releaseHold = null;

function holdPosition(el) {
  if (releaseHold) releaseHold();
  if (typeof ResizeObserver === "undefined") return;

  // Deferred to the next frame, never run inside the observer callback:
  // scrolling there makes reveals and ScrollTrigger re-measure, which resizes
  // the very element being observed within the same frame - the browser's
  // "ResizeObserver loop completed with undelivered notifications".
  let raf = 0;
  const realign = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const y = targetY(el);
      if (Math.abs(window.scrollY - y) <= 1) return;
      if (instance) instance.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    });
  };

  const events = ["wheel", "touchstart", "keydown", "pointerdown"];
  const release = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.clearTimeout(timer);
    events.forEach((type) => window.removeEventListener(type, release));
    if (releaseHold === release) releaseHold = null;
  };
  const ro = new ResizeObserver(realign);
  ro.observe(document.body);
  const timer = window.setTimeout(release, 2000);
  events.forEach((type) =>
    window.addEventListener(type, release, { passive: true })
  );
  releaseHold = release;
}

export function scrollToTarget(target, { immediate = false } = {}) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  // A new jump supersedes any hold still running from the last one.
  if (releaseHold) releaseHold();

  const smooth = !immediate && !prefersReducedMotion();

  const settle = (attempt = 0) => {
    const y = targetY(el);
    if (Math.abs(window.scrollY - y) <= 1 || attempt >= 3) {
      holdPosition(el);
      return;
    }
    if (instance) {
      instance.scrollTo(y, {
        duration: 0.35,
        force: true,
        onComplete: () => settle(attempt + 1),
      });
    } else {
      window.scrollTo({ top: y, behavior: "instant" });
      window.requestAnimationFrame(() => settle(attempt + 1));
    }
  };

  if (instance) {
    // `force`: the mobile drawer stops Lenis while it is open, and a link
    // inside it must still move the page.
    instance.scrollTo(targetY(el), {
      immediate: !smooth,
      force: true,
      duration: smooth ? 1.1 : 0,
      onComplete: () => settle(),
    });
    return;
  }

  // Explicit behaviour either way: html carries `scroll-behavior: smooth`,
  // which would otherwise animate even the "instant" jumps.
  window.scrollTo({ top: targetY(el), behavior: smooth ? "smooth" : "instant" });
  if (!smooth) {
    window.requestAnimationFrame(() => settle());
  } else if ("onscrollend" in window) {
    window.addEventListener("scrollend", () => settle(), { once: true });
  } else {
    window.setTimeout(() => settle(), 900);
  }
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
      // Same-page anchors are NOT left to Lenis. Its built-in handler fixes
      // the destination at click time and never re-checks it, so anything
      // that shifted the layout mid-scroll left the section short of the
      // header. ScrollManager intercepts anchor clicks instead and routes
      // them through scrollToTarget, which settles on the real position. The
      // links themselves stay plain href="#id" anchors - copyable,
      // middle-clickable and keyboard-activatable.
      anchors: false,
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
