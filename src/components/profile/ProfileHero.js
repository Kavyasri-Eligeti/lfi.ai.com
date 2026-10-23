import React, { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../../motion/useGsap";
import { gsap, SplitText, EASE, prefersReducedMotion } from "../../motion";
import Button from "../ui/Button";
import CountUp from "../ui/CountUp";
import GlyphGlobe from "../ui/GlyphGlobe";
import { hero, portfolios } from "../../data/profile";
import { selectPortfolio } from "./portfolioEvents";
import "./ProfileHero.css";

/**
 * The opening screen.
 *
 * Copy on the left, the glyph globe filling the right and bleeding off the
 * edge, so the headline stands in front of the planet rather than beside an
 * illustration of it. On narrow screens the globe moves behind the copy and
 * dims, which keeps the headline the first thing read.
 */
export default function ProfileHero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const copyRef = useRef(null);

  /* Entrance: one timeline, in reading order. The resting state is a
     `.lfi-js`-gated rule, and `reveal()` runs on start and on any error, so
     a failure in the animation layer cannot leave the hero blank. */
  useIsomorphicLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;
    const reveal = () => el.setAttribute("data-intro", "done");
    if (prefersReducedMotion()) {
      reveal();
      return undefined;
    }

    let split = null;
    const ctx = gsap.context(() => {
      try {
        split = SplitText.create(titleRef.current, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          linesClass: "pf-hero__line",
        });
        gsap
          .timeline({ defaults: { ease: EASE.out }, onStart: reveal })
          .from("[data-intro-item='eyebrow']", { y: 14, opacity: 0, duration: 0.7, delay: 0.2 })
          .from(split.lines, { yPercent: 110, opacity: 0, duration: 1.05, stagger: 0.09 }, "-=0.42")
          .from("[data-intro-item='portfolios'] > li", { y: 16, opacity: 0, duration: 0.6, stagger: 0.06 }, "-=0.62")
          .from("[data-intro-item='lede']", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
          .from("[data-intro-item='actions'] > *", { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 }, "-=0.55")
          .from("[data-intro-item='facts'] > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.07 }, "-=0.45")
          .from("[data-intro-item='cue']", { opacity: 0, duration: 0.6 }, "-=0.3");
      } catch (err) {
        reveal();
      }
    }, el);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  /* The copy yields as the visitor scrolls on - a small drift, not a pin. */
  useEffect(() => {
    const el = heroRef.current;
    const copy = copyRef.current;
    if (!el || !copy || prefersReducedMotion()) return undefined;
    const tween = gsap.to(copy, {
      y: -60,
      opacity: 0.3,
      ease: EASE.scrub,
      scrollTrigger: { trigger: el, start: "top top", end: "bottom 35%", scrub: true },
    });
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="pf-hero" id="top" data-light="ember" data-intro="" ref={heroRef}>
      {/* Decorative: the offices it marks are listed in "Global reach". */}
      <div className="pf-hero__globe" aria-hidden="true">
        <GlyphGlobe introDelay={0.35} />
        <p className="pf-hero__hint">Drag to spin</p>
      </div>

      <div className="lfi-container pf-hero__inner">
        <div className="pf-hero__copy" ref={copyRef}>
          <p className="pf-hero__eyebrow" data-intro-item="eyebrow">
            <span className="pf-hero__dot" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1 className="pf-hero__title" ref={titleRef}>
            <span className="pf-hero__phrase">{hero.titleLead}</span>{" "}
            <span className="pf-hero__phrase lfi-accent">{hero.titleAccent}</span>
          </h1>

          <ul className="pf-hero__portfolios" data-intro-item="portfolios" aria-label="Our five portfolios">
            {portfolios.map((p) => (
              <li key={p.id} style={{ "--tone": `var(--pf-${p.tone})` }}>
                <a href="#portfolios" onClick={() => selectPortfolio(p.id)}>
                  <span className="pf-hero__chip-dot" aria-hidden="true" />
                  {p.name}
                </a>
              </li>
            ))}
          </ul>

          <p className="pf-hero__lede" data-intro-item="lede">
            A technology partner that modernises, runs, analyses, secures and
            scales the enterprise, combining specialist services with our own
            software and reusable delivery IP. Headquartered in South Africa,
            delivering globally.
          </p>

          <div className="pf-hero__actions" data-intro-item="actions">
            <Button href="#portfolios" variant="primary" size="lg">
              Explore our portfolios
            </Button>
            <Button href="#contact" variant="secondary" size="lg">
              Talk to us
            </Button>
          </div>

          <dl className="pf-hero__facts" data-intro-item="facts">
            {hero.facts.map((f) => (
              <div className="pf-hero__fact" key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <CountUp to={f.to} />
                  {f.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <a className="pf-hero__cue" href="#who-we-are" data-intro-item="cue" aria-label="Scroll to who we are">
        <span className="pf-hero__cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
