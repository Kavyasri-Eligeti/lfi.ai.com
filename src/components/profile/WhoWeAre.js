import React, { useRef } from "react";
import useFitScreen from "../ui/useFitScreen";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { about, portfolios } from "../../data/profile";
import { selectPortfolio } from "./portfolioEvents";
import "./WhoWeAre.css";

/**
 * Who we are: the positioning, the five portfolios as a row of pills, mission
 * and vision, and the three facts the profile leads with. The photo collage
 * borrows the deck's framed shapes - one corner rounded, a portfolio colour
 * as the frame.
 */
export default function WhoWeAre() {
  const { photos } = about;
  const sectionRef = useRef(null);
  // One screen on two-column widths - see the data-fit rules in WhoWeAre.css.
  useFitScreen(sectionRef, { columns: ".pf-about__main, .pf-about__collage" });
  return (
    <section
      className="lfi-section pf-about"
      id="who-we-are"
      data-light="azure"
      data-fit="0"
      data-scroll-align="edge"
      ref={sectionRef}
    >
      <div className="lfi-container pf-about__grid">
        <div className="pf-about__main">
          <SectionHeading eyebrow={about.eyebrow} title={about.title} lede={about.intro} wide />

          <Reveal as="ul" className="pf-about__pills" aria-label="Portfolios" delay={120}>
            {portfolios.map((p) => (
              <li key={p.id}>
                <a
                  href="#portfolios"
                  className="pf-about__pill"
                  style={{ "--tone": `var(--pf-${p.tone})` }}
                  onClick={() => selectPortfolio(p.id)}
                >
                  {p.name}
                </a>
              </li>
            ))}
          </Reveal>

          <div className="pf-about__cards">
            <Reveal className="pf-about__card lfi-surface" style={{ "--tone": "var(--lfi-yellow)" }}>
              <h3>
                <span className="pf-about__bullet" aria-hidden="true" />
                Our mission
              </h3>
              <p>{about.mission}</p>
            </Reveal>
            <Reveal className="pf-about__card lfi-surface" delay={120} style={{ "--tone": "var(--pf-blue)" }}>
              <h3>
                <span className="pf-about__bullet" aria-hidden="true" />
                Our vision
              </h3>
              <p>{about.vision}</p>
            </Reveal>
          </div>

          <Reveal as="ul" className="pf-about__facts" delay={160}>
            {about.facts.map((f) => (
              <li key={f.value} style={{ color: `var(--pf-${f.tone})` }}>
                {f.value}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal className="pf-about__collage" from="right" aria-hidden="true">
          <figure className="pf-frame pf-frame--tall" style={{ "--tone": "var(--pf-yellow)" }}>
            <img src={photos.team.src} width={photos.team.w} height={photos.team.h} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="pf-frame" style={{ "--tone": "var(--pf-orange)" }}>
            <img src={photos.celebration.src} width={photos.celebration.w} height={photos.celebration.h} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="pf-frame" style={{ "--tone": "var(--lfi-blue-soft)" }}>
            <img src={photos.city.src} width={photos.city.w} height={photos.city.h} alt="" loading="lazy" decoding="async" />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
