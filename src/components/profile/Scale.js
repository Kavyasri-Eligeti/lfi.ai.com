import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import CountUp from "../ui/CountUp";
import { stats } from "../../data/profile";
import "./Scale.css";

/** Scale that delivers: the profile's twelve figures, each counted into view. */
export default function Scale() {
  return (
    <section className="lfi-section pf-scale" id="scale" data-light="deep">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow="Who we are" title="Scale that delivers" />
        </div>
        <ul className="pf-scale__grid">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} className="pf-scale__card lfi-surface" delay={(i % 4) * 70} style={{ "--tone": `var(--pf-${s.tone})` }}>
              <p className="pf-scale__value">
                <CountUp to={s.to} duration={1500} />
                {s.suffix}
              </p>
              <p className="pf-scale__label">{s.label}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
