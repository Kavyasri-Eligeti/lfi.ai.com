import React, { useRef } from "react";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import useGsap from "../../motion/useGsap";
import { ScrollTrigger, prefersReducedMotion } from "../../motion";
import { processStages, approachPrinciples } from "../../data/solutions";
import { official, parentLinks } from "../../data/company";
import "./Process.css";

/**
 * How we work.
 *
 * The rhythm break on the page - it marks where the content turns from what
 * we sell to how we deliver.
 *
 * The four stages are the ones published on the official "Our Approach"
 * page, which describes them without naming them; the labels here are short
 * names, and the body of each card is the published paragraph verbatim. The
 * connecting rail is decorative - the stages read as an ordered list with or
 * without it.
 */
export default function Process() {
  const sectionRef = useRef(null);

  /**
   * Scroll-driven progress along the timeline.
   *
   * A scrubbed ScrollTrigger writes 0..1 into `--lfi-progress` on the list;
   * CSS turns that into the filled rail and lights each stage as the fill
   * reaches it.
   *
   * This was a hand-rolled scroll listener before GSAP arrived. Moving it
   * onto ScrollTrigger is not ceremony: it was the last place on the page
   * reading `getBoundingClientRect` on its own scroll handler, which meant it
   * sampled the browser's raw scroll position while everything else sampled
   * Lenis' smoothed one. The rail visibly lagged the content moving beside
   * it. One engine, one clock.
   */
  useGsap(
    (root) => {
      const stages = root.querySelector(".lfi-process__stages");
      if (!stages) return;

      if (prefersReducedMotion()) {
        // The rail simply renders complete.
        stages.style.setProperty("--lfi-progress", "1");
        return;
      }

      const set = (p) =>
        stages.style.setProperty("--lfi-progress", p.toFixed(3));

      ScrollTrigger.create({
        trigger: stages,
        // Tracks the READ rather than the scrollbar: the fill starts as the
        // block enters the lower third and completes as it leaves the upper
        // half, which is the window in which someone is actually looking at
        // it.
        start: "top 85%",
        end: "bottom 55%",
        scrub: 0.4,
        onUpdate: (self) => set(self.progress),
        onRefresh: (self) => set(self.progress),
      });
    },
    [],
    sectionRef
  );

  return (
    <section
      className="lfi-section lfi-section--invert lfi-process"
      id="process"
      data-light="azure"
      ref={sectionRef}
    >
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading
            eyebrow="How we work"
            title={official.approachHeading}
            lede={official.approachIntro}
          />
          <Reveal delay={80} from="none" className="lfi-process__principles">
            <p className="lfi-process__principles-label">Our principles</p>
            <ul>
              {approachPrinciples.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lfi-process__exploration">
          <h3 className="lfi-process__exploration-title">
            {official.explorationHeading}
          </h3>
        </div>

        <ol className="lfi-process__stages">
          {processStages.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              delay={Math.min(i * 90, 320)}
              className="lfi-process__stage"
              style={{ "--lfi-step": i, "--lfi-steps": processStages.length }}
            >
              <div className="lfi-process__marker" aria-hidden="true">
                <span className="lfi-process__dot" />
              </div>
              <p className="lfi-process__n">
                {s.n} &middot; {s.label}
              </p>
              <h4>{s.title}</h4>
              {/* The published paragraph, verbatim. */}
              <p className="lfi-process__body">{s.official}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="lfi-process__foot" from="none">
          <p>
            Stage descriptions quoted from the official Linkfields approach.
            This is the delivery approach applied across every engagement, not
            one written for AI alone.
          </p>
          <Button href={parentLinks.approach} variant="secondary" size="sm">
            Read the full approach
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
