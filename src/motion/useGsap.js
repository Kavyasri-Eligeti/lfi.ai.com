import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./index";

/* SSR-safe layout effect. CRA renders in the browser, but useLayoutEffect in
   a non-DOM environment logs a warning, and this hook is imported by every
   animated section. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Run GSAP setup inside a scoped context.
 *
 * `gsap.context` records every tween, timeline and ScrollTrigger created
 * inside the callback and reverts all of them on cleanup. That is the whole
 * lifecycle story for this site: a section can be unmounted by the router at
 * any time, and React 19's StrictMode runs effects twice in development, so
 * anything that registers a trigger without reverting it ends up with two.
 *
 * `scopeRef` also scopes selector strings to that element, so a section can
 * use `".lfi-card"` without reaching into another section's markup.
 *
 * The callback receives the scope element, and runs in a layout effect so
 * measurements are taken after the DOM is in place but before paint.
 */
export default function useGsap(setup, deps = [], scopeRef) {
  const localRef = useRef(null);
  const ref = scopeRef || localRef;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => setup(el), el);
    // A section that mounts below the fold can change the document height;
    // tell ScrollTrigger once its own triggers exist.
    ScrollTrigger.refresh();

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export { useIsomorphicLayoutEffect };
