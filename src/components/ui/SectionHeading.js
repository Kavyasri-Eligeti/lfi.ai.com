import React from "react";
import LineReveal from "../../motion/LineReveal";
import Reveal from "./Reveal";

/**
 * The standard section opener: eyebrow, line-revealed heading, lede.
 *
 * Every section used to hand-roll this trio, which meant the heading
 * entrance had to be re-specified each time. Centralising it is what makes
 * the reveal consistent down the page - one typographic gesture, repeated,
 * rather than nine slightly different ones.
 *
 * The heading splits into its rendered LINES and they rise out of their
 * masks in sequence. Lines rather than words was a deliberate change: at
 * section-heading size a word stagger reads as a ripple, and on a two-line
 * heading it put nine separate delays on something the eye takes in at once.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  wide = false,
  className = "",
  headingLevel: H = "h2",
  children,
}) {
  return (
    <div className={`lfi-section-head__text ${className}`}>
      {eyebrow ? (
        <Reveal as="p" className="lfi-eyebrow" from="left">
          {eyebrow}
        </Reveal>
      ) : null}

      <LineReveal
        as={H}
        className={`lfi-heading${wide ? " lfi-heading--wide" : ""}`}
      >
        {title}
      </LineReveal>

      {lede ? (
        <Reveal as="p" className="lfi-lede" delay={180}>
          {lede}
        </Reveal>
      ) : null}

      {children}
    </div>
  );
}
