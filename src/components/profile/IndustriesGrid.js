import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { industries } from "../../data/profile";
import "./IndustriesGrid.css";

/** Industries we know deeply: six sectors, each with its outcomes. */
export default function IndustriesGrid() {
  return (
    <section className="lfi-section pf-ind" id="industries" data-light="azure">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading
            eyebrow="Who we serve"
            title="Industries we know deeply"
            lede="Consistent enterprise positioning, with outcomes tailored to each industry we serve."
          />
        </div>
        <ul className="pf-ind__grid">
          {industries.map((ind, i) => (
            <Reveal as="li" key={ind.name} className="pf-ind__card lfi-surface" delay={(i % 3) * 90} style={{ "--tone": `var(--pf-${ind.tone})` }}>
              <div className="pf-ind__photo">
                <img src={ind.src} width="360" height="660" alt={ind.alt} loading="lazy" decoding="async" />
              </div>
              <div className="pf-ind__body">
                <h3>{ind.name}</h3>
                <p>{ind.body}</p>
                <ul className="pf-ind__tags">
                  {ind.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
