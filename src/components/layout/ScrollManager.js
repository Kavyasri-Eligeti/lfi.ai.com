import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../../motion";
import { getLenis, scrollToTarget } from "../../motion/SmoothScroll";

/**
 * Scroll behaviour for a client-side router.
 *
 * Without this, navigating from /demos to /#contact changes the URL and
 * nothing moves, and browser back/forward restores the wrong offset. Two
 * rules:
 *
 *   - a hash in the URL scrolls that section under the sticky header;
 *   - no hash means a new page, so start at the top.
 *
 * The header offset is not applied here. `scroll-padding-top` in index.css is
 * the single source of truth for it, and both Lenis and the browser honour
 * it - see scrollToTarget.
 *
 * Two additions now that the page is scroll-driven:
 *
 *   - the jump goes through Lenis when it is running, so an anchor lands with
 *     the same easing as a wheel scroll rather than teleporting past a
 *     half-finished pinned section;
 *   - ScrollTrigger is refreshed after a route change, because the new route
 *     has a different document height and every trigger's start/end was
 *     measured against the old one.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // The route that just mounted is a different height; anything measured
      // against the previous one is now wrong.
      const raf = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => window.cancelAnimationFrame(raf);
    }

    // The target section may mount a frame after the route does.
    const raf = window.requestAnimationFrame(() => {
      const el = document.querySelector(hash);
      if (el) scrollToTarget(el);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [pathname, hash, key]);

  return null;
}
