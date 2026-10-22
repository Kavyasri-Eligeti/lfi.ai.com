import React, { useRef } from "react";
import { gsap, SplitText, EASE, prefersReducedMotion } from "./index";
import useGsap from "./useGsap";

/* ==========================================================================
   Line-by-line heading reveal.

   The signature typographic entrance: a heading is split into its rendered
   LINES (not words, not characters), each line sits in a clipping mask, and
   the lines rise out of their masks in sequence.

   Lines rather than words is a deliberate choice. A word-by-word stagger on a
   three-line heading reads as a ripple; a line stagger reads as typesetting,
   which is the register this site wants.

   Three things that usually go wrong with split text, and how they are
   handled here:

   - RESPONSIVE RE-WRAP. Where a heading breaks depends on the viewport, so a
     split taken at mount is wrong after a resize. `autoSplit` re-splits on
     resize and on font load, and re-runs `onSplit` - which is why the tween
     is CREATED INSIDE onSplit and RETURNED from it, so GSAP reverts the old
     one rather than leaving a stale tween holding a dead element.

   - ACCESSIBILITY. `aria: "auto"` puts the original string on the element as
     an aria-label and hides the generated line divs, so a screen reader reads
     the heading as one sentence instead of spelling out fragments. The real
     text is still in the DOM for search engines and text selection.

   - THE BLANK-HEADING FAILURE. The resting rule that hides the element before
     the split is gated on `.lfi-js`, and the attribute is flipped to "in" in
     a `finally`, so a thrown error or a missing plugin leaves the heading
     VISIBLE rather than invisible. A motion bug must never cost the content.
   ========================================================================== */

export default function LineReveal({
  as: Tag = "h2",
  className = "",
  children,
  delay = 0,
  stagger = 0.085,
  start = "top 88%",
  ...rest
}) {
  const ref = useRef(null);

  useGsap(
    (el) => {
      if (prefersReducedMotion()) {
        el.setAttribute("data-lines", "in");
        return;
      }

      try {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          linesClass: "lfi-line",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              // A touch of opacity under the mask stops the top line reading
              // as a hard shutter.
              opacity: 0,
              duration: 1,
              ease: EASE.emphasis,
              stagger,
              delay,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
              },
            }),
        });
      } catch (err) {
        // Nothing to recover - the finally below guarantees the text shows.
      } finally {
        el.setAttribute("data-lines", "in");
      }
    },
    [children, delay, stagger, start],
    ref
  );

  return (
    <Tag ref={ref} data-lines="" className={`lfi-lines ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
