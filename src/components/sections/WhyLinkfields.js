import React, { useRef } from "react";
import Reveal from "../ui/Reveal";
import LineReveal from "../../motion/LineReveal";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import { differentiators } from "../../data/services";
import {
  company,
  official,
  recognition,
  values,
  parentLinks,
} from "../../data/company";
import "./WhyLinkfields.css";

/**
 * Credibility.
 *
 * Every claim here is either traceable to official Linkfields positioning or
 * is a statement about this site itself (the catalogue is open, the demos
 * work). The recognition items are reproduced as published, with a link back
 * to the source - no figures are added, rounded or extrapolated.
 *
 * ---------------------------------------------------------------------------
 * The composition.
 *
 * This is the longest section on the page and it was also the flattest: a
 * section heading, then six text items in a grid, then six values in a grid,
 * then three recognition items in a grid, then a closing statement - four
 * stacked blocks at the same width, the same alignment and the same rhythm,
 * with nothing for the eye to hold on to over ~1800px.
 *
 * It is now anchored. The argument (heading, lede, what the company has
 * actually been recognised for) sits in a column that STAYS while the six
 * reasons move past it, so the section has a fixed point and a moving one
 * instead of four blocks in a row. The values band and the CSR statement keep
 * the full width below, which gives the section an ending rather than letting
 * it trail off.
 *
 * The sticky column is desktop-only. On a narrow screen there is no second
 * column for it to be sticky against, and a pinned block on a phone just eats
 * the viewport.
 * ---------------------------------------------------------------------------
 */
export default function WhyLinkfields() {
  const valuesRef = useRef(null);
  const listRef = useRef(null);

  /**
   * The six reasons arrive in sequence as the column passes.
   *
   * Scrubbed rather than fired once, so the sequence tracks the scrollbar in
   * both directions - the aside beside it is stationary, and a one-shot
   * entrance next to a fixed element is the combination that makes a sticky
   * layout feel broken on the way back up.
   */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray(".lfi-why__item", root);
      if (!items.length) return;

      gsap.from(items, {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.35,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: root,
          start: "top 86%",
          end: "bottom 72%",
          scrub: 0.6,
        },
      });
    },
    [],
    listRef
  );

  /**
   * The values band.
   *
   * Each value gets its own short movement rather than the six arriving as a
   * block: the name slides in from the left while its description fades up
   * behind it, so the band reads as a list being set rather than as a card
   * grid appearing.
   *
   * The stagger is generous (0.18) because there are only six and they are
   * short - a tight stagger here reads as a glitch, not as rhythm.
   */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray("li", root);
      if (!rows.length) return;

      gsap.from(rows, {
        x: -24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: EASE.out,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
        },
      });
    },
    [],
    valuesRef
  );

  return (
    <section className="lfi-section lfi-why" id="why" data-light="ember">
      <div className="lfi-container">
        <div className="lfi-why__layout">
          {/* --- the fixed point -------------------------------------- */}
          <div className="lfi-why__aside">
            <Reveal as="p" className="lfi-eyebrow" from="left">
              Why Linkfields
            </Reveal>

            <LineReveal as="h2" className="lfi-heading lfi-why__title">
              A digital transformation partner that happens to be very good at
              AI.
            </LineReveal>

            <Reveal as="p" className="lfi-lede" delay={140}>
              {company.foundedNote} The AI practice sits inside an engineering,
              consulting and cloud business &mdash; which is usually what
              decides whether a model ever reaches production.
            </Reveal>

            <Reveal className="lfi-why__recognition" from="none" delay={220}>
              <p className="lfi-why__recognition-label">
                As published by Linkfields Innovations
              </p>
              <ul>
                {recognition.map((r) => (
                  <li key={r.label}>
                    <strong>{r.label}</strong>
                    <span>{r.detail}</span>
                  </li>
                ))}
              </ul>
              <a
                className="lfi-why__source"
                href={parentLinks.about}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source: linkfields.com
              </a>
            </Reveal>
          </div>

          {/* --- the moving part -------------------------------------- */}
          <ol className="lfi-why__list" ref={listRef}>
            {differentiators.map((d, i) => (
              <li key={d.title} className="lfi-why__item">
                <span className="lfi-why__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="lfi-why__itemText">
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Official company values. Presented as a typographic band rather
            than six more cards, so it reads as a statement of character and
            not as another feature grid. */}
        <div className="lfi-why__values" ref={valuesRef}>
          <div className="lfi-why__values-head">
            <h3 className="lfi-why__values-label">Our values</h3>
            {/* The official heading that sits above these on the Linkfields
                About Us page. */}
            <p className="lfi-why__values-title">{official.valuesHeading}</p>
          </div>
          <ul>
            {values.map((v, i) => (
              <li key={v.name} style={{ "--lfi-v": i }}>
                <span className="lfi-why__value-name">{v.name}</span>
                <span className="lfi-why__value-body">{v.body}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The company's published position on its social responsibility.
            Short, quoted, and not dressed up as a programme with outcomes
            this site cannot verify. */}
        <Reveal className="lfi-why__csr" from="none">
          <div className="lfi-why__csrText">
            <p className="lfi-why__csr-label">Corporate social responsibility</p>
            <h3>{official.csrHeading}</h3>
          </div>
          <p className="lfi-why__csr-body">{official.csrBody}</p>
        </Reveal>
      </div>
    </section>
  );
}
