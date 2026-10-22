import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "../../motion";

/**
 * Scroll-reveal.
 *
 * A ScrollTrigger per element flips `data-reveal` to "in"; the transition
 * itself lives in animations.css.
 *
 * Why the motion stays in CSS even though GSAP now drives the trigger: the
 * resting state is a stylesheet rule gated on `.lfi-js`, so if the bundle
 * fails to execute the content renders visible rather than stuck at opacity
 * 0. Moving the tween into JS would make "the animation library failed to
 * load" and "the page is blank" the same event. GSAP owns WHEN; CSS owns
 * WHAT, and only CSS can be trusted to have a fallback.
 *
 * `once: true` matches the intent - an entrance, not a state that toggles
 * every time the element crosses the fold.
 */
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Reduced motion: the stylesheet neutralises the transition, but the
    // attribute still has to flip or the resting rule keeps it hidden.
    if (prefersReducedMotion()) {
      node.setAttribute("data-reveal", "in");
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: node,
      // Starts while the element is still arriving, so the movement is
      // visible rather than already finished by the time the eye reaches it.
      start: "top 92%",
      once: true,
      onEnter: () => node.setAttribute("data-reveal", "in"),
    });

    // An element already above the start line at mount (anything in the first
    // viewport) should simply be in, not animate in from a trigger that has
    // already passed.
    if (st.progress > 0) node.setAttribute("data-reveal", "in");

    return () => st.kill();
  }, []);

  return ref;
}
