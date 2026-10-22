import React from "react";
import Reveal from "../ui/Reveal";
import Scrub from "../ui/Scrub";
import SectionHeading from "../ui/SectionHeading";
import Icon from "../ui/Icon";
import { services } from "../../data/services";
import "./Services.css";

/**
 * Services.
 *
 * Deliberately not six identical cards: the AI & ML line is the one this site
 * is about, so it takes a wide row of its own and the supporting lines sit
 * beneath it as a lighter list. Each links to the official service page.
 */

const featured = services.find((s) => s.featured);
const supporting = services.filter((s) => !s.featured);

export default function Services() {
  return (
    <section className="lfi-section lfi-services" id="services" data-light="azure">
      <Scrub className="lfi-scrub lfi-glow lfi-parallax-slow" aria-hidden="true" />
      <div className="lfi-container lfi-services__inner">
        <SectionHeading
          className="lfi-services__head"
          eyebrow="Services"
          title="The practice around the model, not just the model."
          wide
          lede="An AI programme lands because of what surrounds it - the consulting that chose the use case, the engineering that integrated it, the platform that keeps it running. These are the Linkfields service lines an AI engagement draws on."
        />

        {featured ? (
          <Reveal className="lfi-service-lead" from="scale">
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lfi-service-lead__link lfi-surface"
            >
              <div className="lfi-service-lead__main">
                <p className="lfi-service-lead__kicker">Core practice</p>
                <h3>
                  {featured.title}
                  <Icon name="external" size={16} />
                </h3>
                <p>{featured.blurb}</p>
              </div>
              <ul className="lfi-service-lead__tags">
                {featured.tags.map((t) => (
                  <li key={t}>
                    <Icon name="check" size={14} />
                    {t}
                  </li>
                ))}
              </ul>
            </a>
          </Reveal>
        ) : null}

        <ul className="lfi-services__list">
          {supporting.map((s, i) => (
            <Reveal
              as="li"
              key={s.id}
              delay={Math.min(i * 95, 400)}
              className="lfi-service"
            >
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lfi-service__link lfi-surface"
              >
                <h3>
                  <span>{s.title}</span>
                  <Icon name="external" size={15} className="lfi-service__ext" />
                </h3>
                <p>{s.blurb}</p>
                <ul className="lfi-service__tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
