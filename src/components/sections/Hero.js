import React, { useEffect, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../../motion/useGsap";
import Button from "../ui/Button";
import NetworkSphere from "../ui/NetworkSphere";
import useScrollScrub from "../ui/useScrollScrub";
import CountUp from "../ui/CountUp";
import { gsap, SplitText, EASE, prefersReducedMotion } from "../../motion";
import { VERIFIED_ON, publicDemos } from "../../data/demos";
import { company } from "../../data/company";
import "./Hero.css";

// Several products appear twice in the catalogue (once as a product, once as
// a demo entry), so count distinct destinations rather than rows.
const liveCount = new Set(publicDemos.map((d) => d.href)).size;

export default function Hero() {
  const heroRef = useRef(null);
  const copyRef = useRef(null);
  const titleRef = useRef(null);
  // Scroll-linked exit for the figure (see styles/scrub.css).
  const figureRef = useScrollScrub();

  /**
   * Pointer parallax.
   *
   * Writes two custom properties on the hero and lets CSS do the transform,
   * so the work per move is one style write rather than a React render. The
   * read of getBoundingClientRect is throttled to one per animation frame.
   */
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;

    const fine =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return undefined;

    let raf = 0;
    let pending = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { clientX, clientY } = pending;
      const r = el.getBoundingClientRect();
      // -1..1 from the centre of the hero.
      const nx = ((clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty("--lfi-px", nx.toFixed(3));
      el.style.setProperty("--lfi-py", ny.toFixed(3));
    };

    const onMove = (e) => {
      pending = e;
      if (!raf) raf = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      el.style.setProperty("--lfi-px", "0");
      el.style.setProperty("--lfi-py", "0");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  /* ======================================================================
     The page entrance.

     One GSAP timeline owns the whole arrival so the pieces are related to
     each other rather than each running on its own CSS delay. The order is
     the reading order - eyebrow, headline, supporting copy, calls to action,
     the figures underneath - and the overlaps (negative positions) are what
     make it read as one movement instead of six.

     The header runs the first beat of this sequence on its own timeline at
     delay 0; the hero starts at 0.2, so the logo and navigation are settled
     before the headline begins.

     Safety: the resting state is a `.lfi-js`-gated stylesheet rule, and the
     timeline clears it in `onComplete` AND immediately if anything throws, so
     a failure in the animation layer can never leave the hero blank.

     A LAYOUT effect, not a passive one: `useEffect` runs after paint, which
     would show the finished headline for one frame before SplitText pulled
     its lines back under their masks.
     ====================================================================== */
  useIsomorphicLayoutEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!hero) return undefined;

    const reveal = () => hero.setAttribute("data-intro", "done");

    if (prefersReducedMotion()) {
      reveal();
      return undefined;
    }

    let split = null;
    const ctx = gsap.context(() => {
      try {
        // Lines, not words: a three-line headline split by word reads as a
        // ripple, by line as typesetting.
        split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          linesClass: "lfi-hero__line",
        });

        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          onStart: reveal,
        });

        tl.from("[data-intro-item='eyebrow']", {
          y: 14,
          opacity: 0,
          duration: 0.7,
          delay: 0.2,
        })
          .from(
            split.lines,
            { yPercent: 110, opacity: 0, duration: 1.05, stagger: 0.09 },
            "-=0.42"
          )
          .from(
            "[data-intro-item='lede']",
            { y: 22, opacity: 0, duration: 0.85 },
            "-=0.68"
          )
          .from(
            "[data-intro-item='actions'] > *",
            { y: 18, opacity: 0, duration: 0.7, stagger: 0.09 },
            "-=0.6"
          )
          .from(
            "[data-intro-item='facts'] > *",
            { y: 16, opacity: 0, duration: 0.6, stagger: 0.07 },
            "-=0.45"
          )
          .from(
            "[data-intro-item='note'], [data-intro-item='cue']",
            { opacity: 0, duration: 0.6, stagger: 0.08 },
            "-=0.3"
          );
      } catch (err) {
        // The content matters more than the entrance.
        reveal();
      }
    }, hero);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  /* ======================================================================
     Hero -> next section handover.

     A scrubbed timeline rather than a pinned one. Pinning the hero was tried
     and rejected: it holds the visitor in a screen they have already read,
     and on a phone it is the fastest way to make a site feel stuck. Scrubbing
     gives the same sense of the hero yielding to what follows, while every
     pixel of scroll still moves the page.

     Only the copy column moves, and only a little. Text that drifts far while
     being read is a readability cost, not a flourish - the depth comes from
     the figure and the field moving at different rates behind it.
     ====================================================================== */
  useEffect(() => {
    const hero = heroRef.current;
    const copy = copyRef.current;
    if (!hero || !copy || prefersReducedMotion()) return undefined;

    const tween = gsap.to(copy, {
      y: -70,
      opacity: 0.35,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom 38%",
        scrub: true,
      },
    });

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="lfi-hero" id="top" data-light="deep" ref={heroRef} data-intro="">
      {/* The network, full-bleed.

          This used to be a column in a two-column grid, boxed inside the
          1240px container and capped at 520px. Three things were wrong with
          that: it left a dead corridor between the copy and the figure, it
          squeezed the headline column until "business forward." broke across
          two lines, and a 520px sphere on a 1440px screen reads as an
          illustration beside the text rather than as the space the text is
          standing in.

          It is now a sibling of the container, anchored to the hero itself
          and bleeding off the right edge - so the composition is one scene
          with the copy lit in front of it.

          Decorative: it carries no information and is named by nothing, so it
          is hidden from assistive technology rather than described.

          The hero's own two ambient glows were removed with it. The fixed
          lighting layer (styles/atmosphere.css) now lights this section, and
          running both meant two glow systems stacked in the same corner. */}
      <div className="lfi-hero__figure" ref={figureRef} aria-hidden="true">
        <NetworkSphere introDelay={0.45} />
      </div>

      <div className="lfi-container lfi-hero__inner">
        <div className="lfi-hero__copy" ref={copyRef}>
          <p className="lfi-hero__eyebrow" data-intro-item="eyebrow">
            <span className="lfi-hero__dot" aria-hidden="true" />
            {company.name} &middot; AI &amp; Machine Learning
          </p>

          {/* Real text in the heading, so it reads normally to assistive
              technology, search engines and text selection. SplitText wraps
              the rendered lines at runtime and restores this markup on
              cleanup. */}
          {/* The two phrases are explicit blocks, so the line break between
              them is a typographic decision rather than whatever the
              browser's line breaker happens to produce at a given width.

              It was the latter before, and `text-wrap: balance` was setting
              the headline as "Intelligence / that moves / business /
              forward." at 1440 - which splits the accent phrase across two
              lines and puts the gradient on a fragment. Each phrase now
              wraps internally if it has to, but the accent always begins its
              own line, at every width. */}
          <h1 className="lfi-hero__title" ref={titleRef}>
            <span className="lfi-hero__phrase">Intelligence that moves</span>
            <span className="lfi-hero__phrase lfi-accent">
              business forward.
            </span>
          </h1>

          <p className="lfi-hero__lede" data-intro-item="lede">
            {company.positioning}
          </p>

          <div className="lfi-hero__actions" data-intro-item="actions">
            <Button href="#solutions" variant="primary" size="lg">
              Explore AI Solutions
            </Button>
            {/* Points at the demo catalogue rather than at prose: the
                capabilities are things you can open and use. */}
            <Button to="/demos" variant="secondary" size="lg">
              Meet Our AI Capabilities
            </Button>
          </div>

          <dl className="lfi-hero__facts" data-intro-item="facts">
            <div className="lfi-hero__fact">
              <dt>Live demonstrations</dt>
              <dd>
                <CountUp to={liveCount} />
              </dd>
            </div>
            <div className="lfi-hero__fact">
              <dt>Building since</dt>
              {/* Counts from 1990 rather than 0 - a year rolling up from zero
                  reads as an invented metric instead of a date. */}
              <dd>
                <CountUp to={2008} from={1990} duration={1700} />
              </dd>
            </div>
            <div className="lfi-hero__fact">
              <dt>Industries served</dt>
              <dd>
                <CountUp to={8} />
              </dd>
            </div>
          </dl>
          <p className="lfi-hero__note" data-intro-item="note">
            Catalogue reachability last verified {VERIFIED_ON}.
          </p>
        </div>
      </div>

      <a
        className="lfi-hero__cue"
        href="#introduction"
        data-intro-item="cue"
        aria-label="Scroll to the Linkfields introduction"
      >
        <span className="lfi-hero__cue-line" aria-hidden="true" />
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M4 9l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
