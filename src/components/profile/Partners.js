import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import CountUp from "../ui/CountUp";
import { partners, recognitionMedia } from "../../data/profile";
import "./Partners.css";

/** Partnerships and recognition. */
export default function Partners() {
  const { bbbee, awards } = recognitionMedia;
  return (
    <section className="lfi-section pf-partners" id="partners" data-light="violet">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading
            eyebrow="Partnerships"
            title="An ecosystem of leading technology partners"
            lede="We have teamed up with industry-leading OEMs and premium solution providers, adding significant value to every engagement."
            wide
          />
        </div>

        <ul className="pf-partners__grid">
          {partners.map((p, i) => (
            <Reveal as="li" key={p.id} className="pf-logo-tile pf-partners__tile" from="scale" delay={(i % 6) * 50}>
              <img src={p.src} width="538" height="272" alt={p.name} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </ul>

        <Reveal as="p" className="lfi-eyebrow pf-partners__eyebrow" from="left">
          Recognition
        </Reveal>
        <div className="pf-partners__recognition">
          <Reveal className="pf-logo-tile pf-partners__bbbee" from="scale">
            <img src={bbbee.src} width={bbbee.w} height={bbbee.h} alt={bbbee.alt} loading="lazy" decoding="async" />
          </Reveal>
          <Reveal className="pf-logo-tile pf-partners__awards" from="scale" delay={90}>
            <img src={awards.src} width={awards.w} height={awards.h} alt={awards.alt} loading="lazy" decoding="async" />
          </Reveal>
          <Reveal className="pf-partners__stat" from="scale" delay={180}>
            <p className="pf-partners__num">
              <CountUp to={20} />+
            </p>
            <p>technology partners across cloud, ERP, CRM, automation and integration</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
