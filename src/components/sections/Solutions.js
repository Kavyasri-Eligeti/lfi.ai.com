import React, { useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import Scrub from "../ui/Scrub";
import SectionHeading from "../ui/SectionHeading";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import CapabilityVisual from "../ui/CapabilityVisual";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import { solutions, analysisSteps } from "../../data/solutions";
import { official, parentLinks } from "../../data/company";
import "./Solutions.css";

/**
 * The six AI & ML capabilities.
 *
 * A selector, not a grid of six equal cards. Six cards means the reader skims
 * six headings and learns nothing; a selector means one capability is being
 * explained at a time, with a diagram that belongs to it.
 *
 * Accessibility follows the ARIA tabs pattern, which is what the content
 * actually is: arrow keys move between capabilities, Home/End jump to the
 * ends, only the selected tab is in the tab order, and each panel is labelled
 * by its tab. It works from a keyboard, from a touch screen and from a mouse
 * identically.
 *
 * The text in `official` is quoted verbatim from the Linkfields AI & ML page
 * and attributed as such. `blurb` is this site's own expansion of it and is
 * visibly separated, so the two are never read as one statement.
 */
export default function Solutions() {
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);
  const tabsRef = useRef([]);
  const sectionRef = useRef(null);

  const current = solutions[active];

  const onKeyDown = (e) => {
    const last = solutions.length - 1;
    let next = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  /* The panel's text enters whenever the capability changes - keyed on
     `active`, so the switch is a movement rather than an instant swap. The
     illustration runs its own timeline (see CapabilityVisual). */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      gsap.from(root.querySelectorAll("[data-panel-item]"), {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: EASE.out,
      });
    },
    [active],
    panelRef
  );

  /* The four analysis steps draw in along their connecting rule as the band
     crosses the viewport. Scrubbed, so it tracks the scrollbar in both
     directions rather than firing once. */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const band = root.querySelector(".lfi-analysis");
      const steps = gsap.utils.toArray(".lfi-analysis__step", root);
      if (!band || !steps.length) return;

      gsap.from(steps, {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.5,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: band,
          start: "top 85%",
          end: "bottom 65%",
          scrub: 0.5,
        },
      });
    },
    [],
    sectionRef
  );

  return (
    <section
      className="lfi-section lfi-solutions"
      id="solutions"
      data-light="azure"
      ref={sectionRef}
    >
      <Scrub
        className="lfi-scrub lfi-hud-grid lfi-parallax-grid"
        aria-hidden="true"
      />
      <div className="lfi-container lfi-solutions__inner">
        <div className="lfi-section-head">
          <SectionHeading
            eyebrow="AI & Machine Learning"
            title="Six capabilities, applied to one business problem at a time."
            lede={official.aiOverview}
          />
          <Reveal delay={80} from="none">
            <Button href={parentLinks.aiml} variant="ghost">
              The full AI &amp; ML service
            </Button>
          </Reveal>
        </div>

        <Reveal className="lfi-caps" from="none">
          <div
            className="lfi-caps__list"
            role="tablist"
            aria-label="AI and machine learning capabilities"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {solutions.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                id={`lfi-cap-tab-${s.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`lfi-cap-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                className={`lfi-caps__tab${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="lfi-caps__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lfi-caps__icon" aria-hidden="true">
                  <Icon name={s.icon} size={19} />
                </span>
                <span className="lfi-caps__name">{s.title}</span>
                <span className="lfi-caps__bar" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div
            id={`lfi-cap-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`lfi-cap-tab-${current.id}`}
            tabIndex={0}
            className="lfi-caps__panel lfi-surface"
            ref={panelRef}
            key={current.id}
          >
            <div className="lfi-caps__panelText">
              <h3 data-panel-item>{current.title}</h3>

              {/* The company's published description, marked as a quotation
                  because that is what it is. */}
              <blockquote className="lfi-caps__official" data-panel-item>
                <p>{current.official}</p>
                <cite>
                  <a
                    href={parentLinks.aiml}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkfields.com/services/technology/ai-ml
                  </a>
                </cite>
              </blockquote>

              <p className="lfi-caps__blurb" data-panel-item>
                {current.blurb}
              </p>

              <ul className="lfi-caps__points" data-panel-item>
                {current.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" size={13} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lfi-caps__visual" data-panel-item>
              <CapabilityVisual id={current.id} />
            </div>
          </div>
        </Reveal>

        {/* The official four-step analysis sequence, as a connected band. */}
        <div className="lfi-analysis">
          <span className="lfi-hud-rule" aria-hidden="true" />
          <div className="lfi-analysis__head">
            <h3 className="lfi-analysis__title">{official.aiProcessHeading}</h3>
            <p className="lfi-analysis__lede">{official.aiProcess}</p>
          </div>
          <ol className="lfi-analysis__steps">
            {analysisSteps.map((s) => (
              <li key={s.n} className="lfi-analysis__step">
                <span className="lfi-analysis__n">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
