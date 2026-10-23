import React, { useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { getLandGrid, isLand } from "../../utils/geo";
import { locations, reach } from "../../data/profile";
import "./GlobalReach.css";

/* Equirectangular frame: longitude -180..180, latitude TOP..BOTTOM. The
   Arctic and Antarctic are cropped as on the deck's map. */
const TOP = 78;
const BOTTOM = -56;
const STEP = 2;
const W = 360;
const H = TOP - BOTTOM;
const px = (lon) => lon + 180;
const py = (lat) => TOP - lat;

/* The whole dotted map is ONE path of zero-length round-capped segments:
   ~3,800 dots for the cost of a single DOM node. */
function useDotPath() {
  return useMemo(() => {
    const g = getLandGrid();
    let d = "";
    for (let lat = TOP - STEP / 2; lat > BOTTOM; lat -= STEP) {
      for (let lon = -180 + STEP / 2; lon < 180; lon += STEP) {
        if (isLand(g, lat, lon)) d += `M${px(lon)} ${py(lat)}h0`;
      }
    }
    return d;
  }, []);
}

const hub = locations.find((l) => l.hub);

function arcPath(to) {
  const x0 = px(hub.lon);
  const y0 = py(hub.lat);
  const x1 = px(to.lon);
  const y1 = py(to.lat);
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dist = Math.hypot(x1 - x0, y1 - y0);
  return `M${x0} ${y0}Q${mx} ${my - dist * 0.32} ${x1} ${y1}`;
}

export default function GlobalReach() {
  const dots = useDotPath();
  const mapRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(null);

  // Arcs draw in once, the first time the map is on screen.
  useEffect(() => {
    const el = mapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="lfi-section pf-reach" id="global" data-light="violet">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow={reach.eyebrow} title={reach.title} />
        </div>

        <div className="pf-reach__grid">
          <Reveal className="pf-reach__map" from="scale">
            <svg
              ref={mapRef}
              viewBox={`0 0 ${W} ${H}`}
              className="pf-reach__svg"
              data-inview={inView ? "true" : "false"}
              role="img"
              aria-label="World map with Linkfields offices in South Africa, India, the UAE, the USA and Australia, and the UK launching, each linked to the South African headquarters."
            >
              <path d={dots} className="pf-reach__dots" />
              {locations
                .filter((l) => !l.hub)
                .map((l, i) => (
                  <path
                    key={l.id}
                    d={arcPath(l)}
                    className={`pf-reach__arc${l.lon < hub.lon ? " is-west" : ""}${active && active !== l.id && active !== hub.id ? " is-dim" : ""}`}
                    style={{ "--i": i, "--tone": `var(--pf-${l.tone === "blue" ? "blue" : "orange"})` }}
                    pathLength="1"
                  />
                ))}
              {locations.map((l) => (
                <g
                  key={l.id}
                  className={`pf-reach__marker${active === l.id ? " is-active" : ""}${l.hub ? " is-hub" : ""}`}
                  transform={`translate(${px(l.lon)} ${py(l.lat)})`}
                  style={{ "--tone": `var(--pf-${l.tone})` }}
                >
                  <circle className="pf-reach__pulse" r={l.hub ? 7 : 5} />
                  <circle className="pf-reach__ring" r={l.hub ? 6 : 4.4} strokeDasharray={l.launching ? "1.6 1.2" : undefined} />
                  <circle className="pf-reach__core" r={l.hub ? 2.4 : 1.8} />
                </g>
              ))}
            </svg>
          </Reveal>

          <ul className="pf-reach__list">
            {locations.map((l, i) => (
              <Reveal
                as="li"
                key={l.id}
                from="right"
                delay={i * 60}
                className={`pf-reach__item${active === l.id ? " is-active" : ""}`}
                style={{ "--tone": `var(--pf-${l.tone})` }}
                tabIndex={0}
                onMouseEnter={() => setActive(l.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(l.id)}
                onBlur={() => setActive(null)}
              >
                <span className="pf-reach__dot" aria-hidden="true" />
                <div>
                  <h3>{l.country}</h3>
                  <p className={l.hub ? "is-hub" : ""}>{l.role}</p>
                  <p className="pf-reach__city">{l.city}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal as="ul" className="pf-reach__summary">
          {reach.summary.map((s) => (
            <li key={s.value} style={{ color: `var(--pf-${s.tone})` }}>
              {s.value}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
