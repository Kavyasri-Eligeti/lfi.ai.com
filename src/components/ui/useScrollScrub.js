import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "../../motion";

/**
 * Scroll-linked progress.
 *
 * Registers a scrubbed ScrollTrigger that writes `--lfi-scrub`, 0..1, onto
 * the element as it crosses the viewport. CSS decides what to do with the
 * value - see styles/scrub.css - so there is no per-frame React work and the
 * reduced-motion story stays in the stylesheet.
 *
 * This is the channel that makes the page feel attached to the scrollbar
 * rather than merely animated: the value tracks the hand continuously and
 * runs backwards when the visitor scrolls back up, which a one-shot entrance
 * cannot do.
 *
 * The value is written straight to the element's style rather than through a
 * GSAP setter: it is a custom property, not something GSAP needs to
 * interpolate, and `setProperty` is the cheapest write available. The last
 * value is cached so a frame that did not change the rounded progress costs
 * nothing at all.
 */
export default function useScrollScrub() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReducedMotion()) {
      // Park at the midpoint: every scrubbed rule resolves to its neutral
      // state, so nothing is left offset or faded.
      node.style.setProperty("--lfi-scrub", "0.5");
      return undefined;
    }

    let last = -1;
    const set = (p) => {
      const v = Math.round(p * 1000) / 1000;
      if (v === last) return;
      last = v;
      node.style.setProperty("--lfi-scrub", String(v));
    };
    set(0);

    const st = ScrollTrigger.create({
      trigger: node,
      // 0 when the element's top sits at the bottom of the viewport,
      // 1 once its bottom has passed the top - the full crossing.
      start: "top bottom",
      end: "bottom top",
      // `true` rather than a number: a smoothed scrub lags the scrollbar,
      // and Lenis is already doing the smoothing upstream.
      scrub: true,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    });

    return () => st.kill();
  }, []);

  return ref;
}
