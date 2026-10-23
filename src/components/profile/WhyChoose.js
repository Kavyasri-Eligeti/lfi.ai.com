import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { reasons, reasonsTagline } from "../../data/profile";
import "./WhyChoose.css";

/** Why enterprises choose Linkfields. */
export default function WhyChoose() {
  return (
    <section className="lfi-section pf-why" id="why-linkfields" data-light="ember">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow="Why Linkfields" title="Why enterprises choose Linkfields" wide />
        </div>
        <ol className="pf-why__grid">
          {reasons.map((r, i) => (
            <Reveal as="li" key={r.title} className="pf-why__card lfi-surface" delay={i * 90} style={{ "--tone": `var(--pf-${r.tone})` }}>
              <span className="pf-why__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal as="p" className="pf-why__tagline">
          {reasonsTagline.map((t) => (
            <span key={t.text} style={{ color: t.tone === "white" ? "#fff" : `var(--pf-${t.tone})` }}>
              {t.text}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
