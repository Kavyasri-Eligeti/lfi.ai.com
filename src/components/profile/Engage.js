import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { engagement } from "../../data/profile";
import "./Engage.css";

/** Flexible commercial models, the software-only option and industry context. */
export default function Engage() {
  return (
    <section className="lfi-section pf-engage" id="engage" data-light="amber">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow={engagement.eyebrow} title={engagement.title} lede={engagement.lede} wide />
        </div>

        <ul className="pf-engage__models">
          {engagement.models.map((m, i) => (
            <Reveal as="li" key={m.name} className="pf-engage__model lfi-surface" delay={i * 70} style={{ "--tone": `var(--pf-${m.tone})` }}>
              <h3>{m.name}</h3>
              <p>{m.body}</p>
              <p className="pf-engage__best">
                <span>Best for</span>
                {m.bestFor}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal as="p" className="lfi-eyebrow pf-engage__eyebrow" from="left">
          Proprietary software is sold separately
        </Reveal>
        <Reveal as="p" className="pf-engage__software">
          <strong>{engagement.software.lead}</strong>
          {engagement.software.rest}
        </Reveal>

        <Reveal as="p" className="lfi-eyebrow pf-engage__eyebrow" from="left">
          Industry context
        </Reveal>
        <Reveal as="ul" className="pf-engage__context">
          {engagement.context.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
