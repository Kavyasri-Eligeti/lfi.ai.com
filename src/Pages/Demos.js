import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Reveal from "../components/ui/Reveal";
import LineReveal from "../motion/LineReveal";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import {
  demos,
  INDUSTRIES,
  TECH,
  VERIFIED_ON,
} from "../data/demos";
import { setMeta } from "../utils/meta";
import "./Demos.css";

/**
 * The demo catalogue.
 *
 * Replaces the filtering the original catalogue offered (industry, technology)
 * with the same taxonomy driven from one data file, plus a text filter. The
 * legacy explorer is still routed at /explore - this page does not delete it.
 *
 * Access is shown honestly: demos served from the corporate network are
 * labelled as such instead of being presented as links a visitor can open.
 */

const ALL = "all";

export default function Demos() {
  const [industry, setIndustry] = useState(ALL);
  const [tech, setTech] = useState(ALL);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMeta({
      title: "AI Demo Catalogue | Linkfields AI",
      description:
        "Open and use the working AI and analytics demonstrations built by Linkfields Innovations - conversational AI, document intelligence, fraud detection, churn, forecasting and risk analytics.",
      path: "/demos",
    });
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demos.filter((d) => {
      if (industry !== ALL && !d.industries.includes(industry)) return false;
      if (tech !== ALL && !d.tech.includes(tech)) return false;
      if (q && !`${d.name} ${d.blurb}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [industry, tech, query]);

  const reset = () => {
    setIndustry(ALL);
    setTech(ALL);
    setQuery("");
  };

  const filtering = industry !== ALL || tech !== ALL || query.trim() !== "";

  return (
    <Layout>
      <section className="lfi-demos">
        <div className="lfi-glow" aria-hidden="true" />
        <div className="lfi-container lfi-demos__head">
          <p className="lfi-eyebrow">Demo catalogue</p>
          <LineReveal as="h1" className="lfi-demos__title">
            Every capability, with something you can actually open.
          </LineReveal>
          <p className="lfi-lede">
            {demos.length} demonstrations built by Linkfields Innovations across
            conversational AI, document intelligence, fraud detection, churn,
            forecasting and risk. Reachability last verified {VERIFIED_ON}.
          </p>
        </div>
      </section>

      <section className="lfi-section lfi-demos__body">
        <div className="lfi-container">
          {/* --- filters --------------------------------------------------- */}
          <div className="lfi-filters">
            <div className="lfi-filters__search">
              <Icon name="search" size={17} />
              <label className="lfi-sr" htmlFor="lfi-demo-search">
                Search demonstrations
              </label>
              <input
                id="lfi-demo-search"
                type="search"
                placeholder="Search demonstrations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="lfi-filters__group">
              <label htmlFor="lfi-filter-industry">Industry</label>
              <select
                id="lfi-filter-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value={ALL}>All industries</option>
                {Object.entries(INDUSTRIES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="lfi-filters__group">
              <label htmlFor="lfi-filter-tech">Technology</label>
              <select
                id="lfi-filter-tech"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
              >
                <option value={ALL}>All technologies</option>
                {Object.entries(TECH).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {filtering ? (
              <button type="button" className="lfi-filters__reset" onClick={reset}>
                Clear
              </button>
            ) : null}
          </div>

          <p className="lfi-demos__count" role="status" aria-live="polite">
            {results.length} of {demos.length} demonstrations
          </p>

          {/* --- results ---------------------------------------------------- */}
          {results.length ? (
            <ul className="lfi-demos__grid">
              {results.map((d, i) => {
                const internal = d.access === "internal";
                const body = (
                  <>
                    <div className="lfi-demo__head">
                      <h2>{d.name}</h2>
                      <Icon
                        name={internal ? "lock" : "external"}
                        size={15}
                        className="lfi-demo__icon"
                      />
                    </div>
                    <p className="lfi-demo__blurb">{d.blurb}</p>
                    <ul className="lfi-demo__tags">
                      {d.tech.map((t) => (
                        <li key={t}>{TECH[t]}</li>
                      ))}
                    </ul>
                    {internal ? (
                      <p className="lfi-demo__restricted">
                        Runs on the Linkfields corporate network
                      </p>
                    ) : null}
                  </>
                );

                return (
                  <Reveal
                    as="li"
                    key={d.id}
                    delay={Math.min(i * 28, 260)}
                    className="lfi-demo"
                  >
                    {internal ? (
                      // Not a link: it cannot be opened from outside, so the
                      // card does not pretend to be actionable.
                      <div className="lfi-demo__card is-restricted">{body}</div>
                    ) : d.internalRoute ? (
                      <a className="lfi-demo__card lfi-surface" href={d.href}>
                        {body}
                      </a>
                    ) : (
                      <a
                        className="lfi-demo__card lfi-surface"
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {body}
                        <span className="lfi-sr">(opens in a new tab)</span>
                      </a>
                    )}
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            <div className="lfi-demos__empty">
              <p>Nothing matches that combination.</p>
              <Button variant="secondary" size="sm" onClick={reset} iconRight={false}>
                Clear filters
              </Button>
            </div>
          )}

          {/* --- footnote --------------------------------------------------- */}
          <div className="lfi-demos__note">
            <p>
              Looking for something that is not here? The catalogue grows from
              client work &mdash; tell us the problem and we will say whether
              we have built something close to it.
            </p>
            <Button to="/#contact" variant="primary" size="sm">
              Talk to the team
            </Button>
          </div>

          {/* The original catalogue explorer is still routed at /explore. It
              groups the same demos by region as well as industry, so it stays
              reachable rather than existing as an orphaned route. */}
          <p className="lfi-demos__legacy">
            Prefer the original explorer? The{" "}
            <Link to="/explore">classic catalogue view</Link> groups the same
            demonstrations by industry, technology and region.
          </p>
        </div>
      </section>
    </Layout>
  );
}
