import React, { useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import LineReveal from "../../motion/LineReveal";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import { enterpriseSolutions } from "../../data/enterprise";
import { official, parentLinks } from "../../data/company";
import "./Enterprise.css";

/**
 * The wider enterprise ecosystem.
 *
 * The one section on the page that moves sideways. It earns that because the
 * content is genuinely a sequence - six platforms, each a place an AI model
 * eventually has to land - and travelling along it communicates "these
 * connect" in a way a six-card grid does not.
 *
 * The rules it has to obey, because horizontal scroll is the easiest effect
 * on this list to get wrong:
 *
 *   - the pinned height is DERIVED from the track's real width, so there is
 *     never dead space after it unpins;
 *   - it is desktop-only. On a phone the same panels are a native
 *     scroll-snap carousel: discoverable, swipeable, and not pinned, so a
 *     visitor can always scroll past;
 *   - under reduced motion it is a plain grid with no horizontal movement
 *     at all;
 *   - the progress indicator is a real list of buttons, so the section is
 *     navigable from a keyboard either way.
 *
 * Every description is quoted verbatim from linkfields.com. The second line
 * on each panel is this site's own, and says only how that platform relates
 * to the AI practice - none of them is presented as an AI product.
 */
export default function Enterprise() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const track = trackRef.current;
        const viewport = root.querySelector(".lfi-ent__viewport");
        if (!track || !viewport) return undefined;

        /* How far the track has to travel for its last panel to come flush
           with the right edge of the viewport.

           Measured off the last panel rather than off `track.scrollWidth`.
           The track is a flex container with `padding: 0 var(--lfi-gutter)`,
           and a flex container's scrollWidth does not include the padding on
           the overflowing side - so the old calculation came up exactly one
           gutter short and the pin released with ~70px of the final panel
           still outside the viewport. Every panel but the last one landed
           correctly, which is why it read as a rendering quirk rather than as
           an arithmetic bug.

           `offsetLeft`/`offsetWidth` are layout values, so they are unaffected
           by the transform GSAP is writing to this element - and both the
           panel and the track resolve against `.lfi-ent__viewport`, which is
           the nearest positioned ancestor. */
        const distance = () => {
          const last = track.lastElementChild;
          if (!last) return 0;
          const padRight =
            parseFloat(window.getComputedStyle(track).paddingRight) || 0;
          return Math.max(
            0,
            last.offsetLeft + last.offsetWidth + padRight - viewport.clientWidth
          );
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // The pin lasts exactly as long as the horizontal travel, so the
            // section releases the moment the last panel lands. A fixed
            // "+=2000" here is what produces the empty gap people associate
            // with this effect.
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.round(self.progress * (enterpriseSolutions.length - 1));
              setActive((prev) => (prev === i ? prev : i));
            },
          },
        });

        return () => {
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });

      /* On narrower screens the panels scroll natively. Keeping the indicator
         in step is then just a scroll listener on the viewport. */
      mm.add("(max-width: 1024px)", () => {
        const viewport = root.querySelector(".lfi-ent__viewport");
        if (!viewport) return undefined;
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = window.requestAnimationFrame(() => {
            raf = 0;
            const max = viewport.scrollWidth - viewport.clientWidth;
            const p = max > 0 ? viewport.scrollLeft / max : 0;
            const i = Math.round(p * (enterpriseSolutions.length - 1));
            setActive((prev) => (prev === i ? prev : i));
          });
        };
        viewport.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          viewport.removeEventListener("scroll", onScroll);
          if (raf) window.cancelAnimationFrame(raf);
        };
      });

      return () => mm.revert();
    },
    [],
    sectionRef
  );

  /** Indicator clicks scroll the native carousel; on the pinned desktop
      layout they are a pure progress readout, so they are not buttons there. */
  const goTo = (i) => {
    const viewport = sectionRef.current?.querySelector(".lfi-ent__viewport");
    const panel = viewport?.children?.[0]?.children?.[i];
    if (!viewport || !panel) return;
    viewport.scrollTo({
      left: panel.offsetLeft - 16,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section
      className="lfi-section lfi-ent"
      id="enterprise"
      data-light="deep"
      ref={sectionRef}
      aria-labelledby="lfi-ent-title"
    >
      <div className="lfi-container lfi-ent__head">
        <div className="lfi-ent__headText">
          <Reveal as="p" className="lfi-eyebrow" from="left">
            The wider Linkfields ecosystem
          </Reveal>
          {/* Kept short deliberately. This section pins, so the heading, the
              track and the indicator all have to fit one screen together - a
              three-line heading here pushed the progress indicator below the
              fold for the entire time the visitor was held in the section. */}
          <LineReveal as="h2" id="lfi-ent-title" className="lfi-heading">
            Where an AI model has to land.
          </LineReveal>
          <Reveal as="p" className="lfi-lede" delay={140}>
            {official.solutionsIntro}
          </Reveal>
        </div>

        <Reveal className="lfi-ent__headAside" from="none" delay={200}>
          <p>
            These are enterprise platforms, not AI products. They matter here
            because they are where an AI engagement has to integrate - and
            because the same company delivers both.
          </p>
          <Button href={parentLinks.home} variant="ghost" size="sm">
            All Linkfields solutions
          </Button>
        </Reveal>
      </div>

      <div className="lfi-ent__viewport">
        <ol className="lfi-ent__track" ref={trackRef}>
          {enterpriseSolutions.map((s, i) => (
            <li
              className={`lfi-ent__panel${i === active ? " is-active" : ""}`}
              key={s.id}
            >
              <a
                className="lfi-ent__link lfi-surface"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lfi-ent__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lfi-ent__icon" aria-hidden="true">
                  <Icon name={s.icon} size={22} />
                </span>
                <p className="lfi-ent__kicker">{s.kicker}</p>
                <h3 className="lfi-ent__name">
                  {s.name}
                  <Icon name="external" size={15} className="lfi-ent__ext" />
                </h3>
                <p className="lfi-ent__official">{s.official}</p>
                <p className="lfi-ent__bridge">
                  <span>Where AI meets it</span>
                  {s.bridge}
                </p>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="lfi-container lfi-ent__foot">
        <ol className="lfi-ent__dots" aria-label="Enterprise solutions">
          {enterpriseSolutions.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`lfi-ent__dot${i === active ? " is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                <span className="lfi-sr">Go to </span>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="lfi-ent__source">
          Descriptions quoted from{" "}
          <a href={parentLinks.home} target="_blank" rel="noopener noreferrer">
            linkfields.com
          </a>
        </p>
      </div>
    </section>
  );
}
