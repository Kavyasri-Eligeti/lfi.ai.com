import React from "react";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import { culture } from "../../data/profile";
import "./Culture.css";

/* The deck's geometric border, redrawn as SVG so it is crisp at any size and
   costs a few hundred bytes rather than a photograph of a pattern. Four
   motifs - triangle, arrow, diamond, square-in-square - in the brand
   colours, laid on a repeating 4x4 tile. */
function PatternPanel() {
  const motifs = [
    { bg: "#ffd600", fg: "#2d58c0", shape: "tri" },
    { bg: "#ff7800", fg: "#ffffff", shape: "house" },
    { bg: "#2d58c0", fg: "#ffd600", shape: "tri" },
    { bg: "#ffffff", fg: "#ff7800", shape: "diamond" },
  ];
  const draw = (m, x, y, k) => {
    const s = 24;
    const inner =
      m.shape === "tri" ? (
        <path d={`M${x + 3} ${y + s - 3}L${x + s / 2} ${y + 3}L${x + s - 3} ${y + s - 3}Z`} fill={m.fg} />
      ) : m.shape === "house" ? (
        <>
          <path d={`M${x + 3} ${y + s / 2}L${x + s / 2} ${y + 3}L${x + s - 3} ${y + s / 2}V${y + s - 3}H${x + 3}Z`} fill={m.fg} />
          <rect x={x + s / 2 - 3} y={y + s / 2} width="6" height="6" fill="#0b0f1d" />
        </>
      ) : (
        <>
          <path d={`M${x + s / 2} ${y + 3}L${x + s - 3} ${y + s / 2}L${x + s / 2} ${y + s - 3}L${x + 3} ${y + s / 2}Z`} fill={m.fg} />
          <rect x={x + s / 2 - 3} y={y + s / 2 - 3} width="6" height="6" fill="#0b0f1d" />
        </>
      );
    return (
      <g key={k}>
        <rect x={x} y={y} width={s} height={s} fill={m.bg} />
        {inner}
      </g>
    );
  };
  const tiles = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) tiles.push(draw(motifs[(r + c) % 4], c * 24, r * 24, `${r}-${c}`));
  return (
    <svg className="pf-culture__pattern" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="pf-kente" width="96" height="96" patternUnits="userSpaceOnUse">
          {tiles}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pf-kente)" />
    </svg>
  );
}

export default function Culture() {
  const [people, markets, city, craft] = culture.tiles;
  const tile = (t, cls, delay) => (
    <Reveal as="figure" className={`pf-culture__tile ${cls}`} from="scale" delay={delay} key={t.label}>
      <img src={t.src} width={t.w} height={t.h} alt={t.alt} loading="lazy" decoding="async" />
      <figcaption style={{ "--tone": `var(--pf-${t.tone})` }}>{t.label}</figcaption>
    </Reveal>
  );

  return (
    <section className="lfi-section pf-culture" id="culture" data-light="amber">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading eyebrow={culture.eyebrow} title={culture.title} wide />
        </div>
        <div className="pf-culture__grid">
          {tile(people, "pf-culture__tile--hero", 0)}
          {tile(markets, "", 90)}
          {tile(city, "", 180)}
          {tile(craft, "", 120)}
          <Reveal className="pf-culture__hq" from="scale" delay={210}>
            <PatternPanel />
            <div className="pf-culture__hq-card">
              <h3>{culture.hq.title}</h3>
              <p>{culture.hq.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
