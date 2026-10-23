import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { clients, clientQuote } from "../../data/profile";
import "./Clients.css";

/**
 * Trusted by 80+ leading organisations.
 *
 * Three rows of logos drifting in alternate directions. Each row's track holds
 * the set twice so the loop is seamless; the second copy is hidden from
 * assistive technology, so the logos are announced once. Hover pauses a row,
 * and reduced motion turns the marquee into a static wrapped grid.
 */
export default function Clients() {
  const rows = [clients.slice(0, 9), clients.slice(9, 18), clients.slice(18)];
  return (
    <section className="lfi-section pf-clients" id="clients" data-light="deep">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow="Who we serve" title="Trusted by 80+ leading organisations" wide />
        </div>
      </div>

      <div className="pf-clients__rows" aria-label="Selected clients" role="list">
        {rows.map((row, r) => (
          <div className={`pf-clients__row${r % 2 ? " is-reverse" : ""}`} key={r} style={{ "--dur": `${46 + r * 8}s` }}>
            <div className="pf-clients__track">
              {[0, 1].map((copy) =>
                row.map((c, i) => (
                  <div
                    className="pf-logo-tile"
                    key={`${copy}-${i}`}
                    role={copy ? undefined : "listitem"}
                    aria-hidden={copy ? "true" : undefined}
                  >
                    <img src={c.src} width="344" height="220" alt={copy ? "" : c.name} loading="lazy" decoding="async" />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="lfi-container">
        <Reveal as="figure" className="pf-clients__quote">
          <span className="pf-clients__mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote>
            <p>{clientQuote}</p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
