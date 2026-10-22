import React, { useRef } from "react";
import Reveal from "../ui/Reveal";
import Scrub from "../ui/Scrub";
import Button from "../ui/Button";
import LineReveal from "../../motion/LineReveal";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import { company, official, parentLinks } from "../../data/company";
import "./Introduction.css";

/**
 * Who Linkfields is, in the company's own words.
 *
 * This section exists because the site is an AI practice inside a twenty-year
 * engineering business, and that context is the strongest thing it has to
 * say. Every statement here is quoted from linkfields.com - the story, the
 * vision and the mission are reproduced exactly as published, and the UI
 * attributes them rather than presenting them as this site's own prose.
 *
 * The motion is a pinned sequence: the heading and the connecting rail hold
 * while the three statements advance past them. It is short on purpose -
 * about one and a half screens of scroll - because a pinned section is a
 * promise that what the visitor is being held for is worth the hold.
 */

const STATEMENTS = [
  {
    id: "story",
    label: "Our story",
    heading: official.storyHeading,
    body: official.story,
  },
  {
    id: "vision",
    label: "Our vision",
    heading: "Where it is going",
    body: official.vision,
  },
  {
    id: "mission",
    label: "Our mission",
    heading: "How it gets there",
    body: official.mission,
  },
];

export default function Introduction() {
  const sectionRef = useRef(null);

  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      // Below the pin breakpoint the statements are a plain stacked list and
      // each one reveals on its own - a pinned column on a phone is how a
      // visitor gets trapped in a section they cannot scroll past.
      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px)", () => {
        const cards = gsap.utils.toArray(".lfi-intro__card", root);
        const rail = root.querySelector(".lfi-intro__rail-fill");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top+=80",
            // One extra viewport per statement after the first. The height is
            // DERIVED from the content rather than set to a round number, so
            // adding a fourth statement cannot silently leave dead space.
            end: () => `+=${window.innerHeight * (cards.length - 1) * 0.9}`,
            pin: ".lfi-intro__pin",
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        // The rail fills continuously across the whole sequence, which is
        // what ties the three statements together into one movement rather
        // than three separate reveals.
        if (rail) {
          tl.fromTo(
            rail,
            { scaleY: 0 },
            { scaleY: 1, ease: EASE.scrub, duration: cards.length },
            0
          );
        }

        // Each statement leaves COMPLETELY before the next arrives. An
        // earlier version faded the outgoing card to 0.18, which on a dark
        // background is still perfectly legible - three statements stacked in
        // the same box, two of them ghosted, reading as one garbled block.
        // Cross-fading overlapping text only works when the outgoing text
        // actually goes.
        cards.forEach((card, i) => {
          if (i > 0) {
            tl.fromTo(
              card,
              { opacity: 0, y: 64 },
              { opacity: 1, y: 0, ease: EASE.scrub, duration: 0.55 },
              i - 0.3
            );
          }
          if (i < cards.length - 1) {
            tl.to(
              card,
              { opacity: 0, y: -48, ease: EASE.scrub, duration: 0.55 },
              i + 0.25
            );
          }
        });

        // The step counter reads off the same clock as the cards, so the
        // indicator can never disagree with what is on screen.
        const steps = gsap.utils.toArray(".lfi-intro__step", root);
        tl.eventCallback("onUpdate", () => {
          // Off the timeline's TIME, not its progress. Each statement owns one
          // whole second of this timeline (card i is centred at t = i), so
          // rounding the time is the index directly. Scaling `progress` would
          // assume the timeline is exactly `cards.length` long, which it is
          // not - the trailing fade adds a fraction and the indicator then
          // lags the card it is supposed to be reporting.
          const i = gsap.utils.clamp(0, cards.length - 1, Math.round(tl.time()));
          steps.forEach((s, n) => s.classList.toggle("is-active", n === i));
        });

        // Resting state for every statement after the first, so they are
        // hidden before the timeline first renders rather than flashing.
        gsap.set(cards.slice(1), { opacity: 0, y: 64 });

        return () => {
          gsap.set(cards, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    [],
    sectionRef
  );

  return (
    <section className="lfi-section lfi-intro" id="introduction" data-light="violet" ref={sectionRef}>
      <Scrub
        className="lfi-scrub lfi-intro__wash lfi-parallax-slow"
        aria-hidden="true"
      />

      <div className="lfi-container lfi-intro__pin">
        <div className="lfi-intro__grid">
          <div className="lfi-intro__aside">
            <Reveal as="p" className="lfi-eyebrow" from="left">
              The company behind the practice
            </Reveal>

            <LineReveal as="h2" className="lfi-heading lfi-intro__title">
              {official.headline}
            </LineReveal>

            <Reveal as="p" className="lfi-lede" delay={140}>
              {official.positioning}
            </Reveal>

            <Reveal className="lfi-intro__meta" from="none" delay={220}>
              <dl>
                <div>
                  <dt>Established</dt>
                  <dd>{company.foundedYear}, South Africa</dd>
                </div>
                <div>
                  <dt>Registered as</dt>
                  <dd>{company.legalName}</dd>
                </div>
              </dl>
              <Button href={parentLinks.about} variant="ghost" size="sm">
                Read the official About Us
              </Button>
            </Reveal>
          </div>

          <div className="lfi-intro__track">
            {/* Decorative connector and position readout. The statements are
                an ordered list with or without either of them, and both are
                hidden from assistive technology rather than described. */}
            <span className="lfi-intro__rail" aria-hidden="true">
              <span className="lfi-intro__rail-fill" />
            </span>

            <ol className="lfi-intro__steps" aria-hidden="true">
              {STATEMENTS.map((s, i) => (
                <li
                  key={s.id}
                  className={`lfi-intro__step${i === 0 ? " is-active" : ""}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>

            <ol className="lfi-intro__cards">
              {STATEMENTS.map((s) => (
                <li className="lfi-intro__card" key={s.id}>
                  <p className="lfi-intro__label">{s.label}</p>
                  <h3 className="lfi-intro__heading">{s.heading}</h3>
                  {/* A blockquote, because it is one: this is the company's
                      published wording, not a paraphrase of it. */}
                  <blockquote className="lfi-intro__quote">
                    <p>{s.body}</p>
                  </blockquote>
                </li>
              ))}
            </ol>

            <p className="lfi-intro__source">
              Quoted from{" "}
              <a href={parentLinks.about} target="_blank" rel="noopener noreferrer">
                linkfields.com/company/about-us
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
