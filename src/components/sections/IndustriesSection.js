import React, { useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Icon from "../ui/Icon";
import { industries } from "../../data/services";
import { demos } from "../../data/demos";
import { official, parentLinks } from "../../data/company";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import "./IndustriesSection.css";

/**
 * Animation state for the industries tab hover effect.
 * Each tab gets its own GSAP animation so the underline/sweep effect
 * runs independently per tab on hover rather than affecting all tabs.
 */

/**
 * Industries.
 *
 * A HORIZONTAL tablist following the ARIA tabs pattern: arrow keys move
 * between tabs, Home/End jump to the ends, and each panel is labelled by its
 * tab.
 *
 * Horizontal is a deliberate change from the vertical list this used to be.
 * Solutions - the section two above this one - is also a tablist, and it was
 * also a vertical rail of labels beside a panel. Two sections with the same
 * interaction AND the same silhouette read as one component used twice, which
 * is exactly the "every section is the same layout" problem. The content here
 * is a set of peers to filter by rather than a sequence to work through, and a
 * row of chips says that; a numbered vertical rail says the opposite.
 *
 * The use-case text is explicitly labelled illustrative. It describes what the
 * capabilities in the catalogue are built to do in that industry - it is not a
 * customer deployment, and the UI never implies one.
 */

const byId = new Map(demos.map((d) => [d.id, d]));

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef([]);
  const tabsWrapRef = useRef(null);
  const panelRef = useRef(null);

  /* The panel's content enters whenever the industry changes - keyed on
     `active`, so switching industries is a movement rather than a swap. */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      /* Targets the marked blocks rather than `root.children`: the panel is
         two columns now, so its direct children are two wrappers and
         staggering them would animate the layout instead of the content. */
      gsap.from(root.querySelectorAll("[data-panel-item]"), {
        y: 18,
        opacity: 0,
        duration: 0.5,
        stagger: 0.055,
        ease: EASE.out,
      });
    },
    [active],
    panelRef
  );

  const onKeyDown = (e) => {
    const last = industries.length - 1;
    let next = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const current = industries[active];
  const linked = (current.demoIds || [])
    .map((id) => byId.get(id))
    .filter(Boolean);

  /* Each tab gets a GSAP hover animation for the border sweep effect.
     This runs independently per tab - the CSS handles the sweep animation,
     but GSAP ensures the tab's `is-active` state can be toggled smoothly.
  */
  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const tabs = gsap.utils.toArray(".lfi-industries__tab", root);
      if (!tabs.length) return;

      tabs.forEach((tab) => {
        gsap.fromTo(
          tab,
          { y: 0 },
          { y: -4, duration: 0.3, ease: EASE.out },
          0
        );
      });
    },
    [],
    tabsWrapRef
  );

  return (
    <section className="lfi-section lfi-section--alt lfi-industries" id="industries" data-light="violet">
      <div className="lfi-container">
        <SectionHeading
          className="lfi-industries__head"
          eyebrow="Industries"
          title="The same models, pointed at a different book of business."
          wide
          lede={official.industriesIntro}
        >
          {/* The company's published statement about its industry experience.
              It carries its own "16 years", written against 2024 - quoted and
              attributed here rather than spoken in this site's voice, so the
              published sentence stays intact without this page asserting a
              number that ages every January. */}
          <Reveal as="blockquote" className="lfi-industries__expertise" delay={240}>
            <p>{official.expertiseBody}</p>
            <cite>
              <a
                href={parentLinks.about}
                target="_blank"
                rel="noopener noreferrer"
              >
                {official.expertiseHeading} &mdash; linkfields.com
              </a>
            </cite>
          </Reveal>
        </SectionHeading>

        <Reveal className="lfi-industries__panel" from="none">
          <div
            className="lfi-industries__tabs"
            role="tablist"
            aria-label="Industries"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            ref={tabsWrapRef}
          >
            {industries.map((ind, i) => (
              <button
                key={ind.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                id={`lfi-ind-tab-${ind.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`lfi-ind-panel-${ind.id}`}
                tabIndex={i === active ? 0 : -1}
                className={`lfi-industries__tab ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {ind.name}
              </button>
            ))}
          </div>

          <div
            id={`lfi-ind-panel-${current.id}`}
            role="tabpanel"
            aria-labelledby={`lfi-ind-tab-${current.id}`}
            tabIndex={0}
            className="lfi-industries__content"
            ref={panelRef}
            key={current.id}
          >
            {/* Left: what the company says, and what the catalogue can do. */}
            <div className="lfi-industries__main">
              <h3 data-panel-item>{current.name}</h3>

              {/* What Linkfields publishes about its work in this industry -
                  company expertise, quoted. */}
              <blockquote className="lfi-industries__published" data-panel-item>
                <p>{current.official}</p>
                <cite>Linkfields Innovations</cite>
              </blockquote>

              {/* And, kept visibly separate from it, what the capabilities in
                  THIS catalogue could do here. The flag is not decoration: the
                  two paragraphs make very different claims and must never be
                  read as one. */}
              <p className="lfi-industries__flag" data-panel-item>
                Illustrative AI use cases &mdash; not customer deployments
              </p>
              <p className="lfi-industries__case" data-panel-item>
                {current.useCase}
              </p>
            </div>

            {/* Right: the things you can actually open. */}
            <div className="lfi-industries__side">
              {linked.length ? (
                <div data-panel-item>
                  <p className="lfi-industries__sub">
                    Working demonstrations in this area
                  </p>
                  <ul className="lfi-industries__demos">
                    {linked.map((d) =>
                      d.internalRoute ? (
                        <li key={d.id}>
                          <a className="lfi-industries__demo" href={d.href}>
                            {d.name}
                            <Icon name="external" size={13} />
                          </a>
                        </li>
                      ) : (
                        <li key={d.id}>
                          <a
                            className="lfi-industries__demo"
                            href={d.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {d.name}
                            <Icon name="external" size={13} />
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : null}

              <a
                className="lfi-industries__official"
                href={current.href}
                target="_blank"
                rel="noopener noreferrer"
                data-panel-item
              >
                Linkfields in {current.name}
                <Icon name="external" size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
