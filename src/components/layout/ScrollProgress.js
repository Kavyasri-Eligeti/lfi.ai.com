import React, { useEffect, useRef } from "react";

/**
 * A thin brand rule across the top that tracks reading position.
 *
 * Writes a 0..1 scale factor to a custom property and lets CSS do the
 * transform, so a scroll event costs one style write and no React render.
 * Hidden entirely under reduced motion - it is a decorative progress cue, not
 * information the page depends on.
 */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.setProperty("--lfi-scroll", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="lfi-progress" aria-hidden="true" />;
}
