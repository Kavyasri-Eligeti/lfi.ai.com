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
 * Where a section lands is decided in one place, scrollToTarget: it measures
 * the navbar and the section with getBoundingClientRect() and puts the
 * section's first line of content just below the bar.
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

  /* Same-page anchor clicks, site-wide.

     Any plain <a href="#id"> (nav, drawer, CTAs, the hero's portfolio chips,
     the scroll cue, the skip link) is caught here and sent through
     scrollToTarget, so every jump lands flush under the header and settles
     there even if the layout moves during the scroll. Router <Link>s
     preventDefault in React's own handler first and are left to the effect
     below.

     The URL is updated with replaceState: the fragment stays copyable, and
     the router's history index is left alone (a pushState behind
     react-router's back would desynchronise it). */
  useEffect(() => {
    const onClick = (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || (a.target && a.target !== "_self")) return;

      const url = new URL(a.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash ||
        url.hash === "#"
      )
        return;

      let el = null;
      try {
        el = document.querySelector(decodeURIComponent(url.hash));
      } catch (_) {
        return; // not a valid selector - let the browser handle it
      }
      if (!el) return;

      e.preventDefault();
      if (url.hash !== window.location.hash) {
        window.history.replaceState(window.history.state, "", url.hash);
      }
      // Two frames: a link in the mobile drawer closes it on click, and the
      // drawer has to release the page before the page can move.
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => scrollToTarget(el))
      );
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!hash) {
      /* A new page starts at the top - instantly, and twice.

         `behavior: "instant"`, not "auto": html carries `scroll-behavior:
         smooth`, so "auto" became a slow animated scroll that the new route's
         mount interrupted, and /demos opened thousands of pixels down. And
         the reset is repeated a frame later because the route change also
         tears down the old page's Lenis and starts a new one; the instance
         read here can be the outgoing one. */
      const toTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      };
      toTop();
      const raf = window.requestAnimationFrame(() => {
        toTop();
        // The route that just mounted is a different height; anything
        // measured against the previous one is now wrong.
        ScrollTrigger.refresh();
      });
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
