import { useState } from 'react';
import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import StatusBadge from '../../components/ui/StatusBadge';
import { industries } from '../../content/industries';
import { worlds } from '../../content/universe';
import { getDemos } from '../../content/demos';
import { usePageMeta } from '../../hooks/usePageMeta';
import { stagger } from '../../features/motion/tokens';
import '../content.css';
import './industries.css';

const LINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 6], [1, 7], [3, 5]];
// Same layout as the 3D constellation (content/universe.js), mapped to a 160×100
// SVG space that matches the container's 16:10 aspect ratio.
const points = worlds.industries.layout.map(([x, y]) => [80 + x * 6.5, 50 - y * 5.2]);

function Constellation({ active, onActivate }) {
  return (
    <div className="lf-constellation">
      <svg viewBox="0 0 160 100" className="lf-constellation__svg" aria-hidden="true">
        {LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={points[a][0]} y1={points[a][1]} x2={points[b][0]} y2={points[b][1]}
            className={active === a || active === b ? 'is-active' : undefined}
          />
        ))}
        {points.map(([x, y], i) => (
          <g key={i} className={active === i ? 'is-active' : undefined} transform={`translate(${x} ${y})`}>
            <circle r="4.5" className="lf-constellation__halo" />
            <circle r="1.4" className="lf-constellation__star" />
          </g>
        ))}
      </svg>
      <ul className="lf-constellation__labels">
        {industries.map((ind, i) => (
          <li key={ind.id} style={{ left: `${(points[i][0] / 160) * 100}%`, top: `${points[i][1]}%` }}>
            <a
              href={`#${ind.id}`}
              className={active === i ? 'is-active' : undefined}
              onMouseEnter={() => onActivate(i)}
              onFocus={() => onActivate(i)}
            >
              {ind.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function IndustriesPage() {
  usePageMeta('Industries', 'Industries served by Linkfields: Manufacturing, Telecom, Banking, Insurance, Fintech, FMCG, Mining, Oil and Gas.');
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <>
      <PageHero eyebrow="Industries" title="A constellation of industries">
        <p>Eight industries served by Linkfields. Select a star to preview it, or read the full list below.</p>
      </PageHero>

      <section className="lf-section lf-section--dark lf-dark lf-constellation-section" aria-label="Industry constellation">
        <div className="lf-container lf-constellation-layout">
          <Constellation active={active} onActivate={setActive} />
          <div className="lf-constellation-preview" aria-live="polite">
            <p className="lf-eyebrow">Industry</p>
            <h2>{current.name}</h2>
            <p>{current.text}</p>
            <a className="lf-link-arrow" href={`#${current.id}`}>Read more</a>
          </div>
        </div>
      </section>

      <section className="lf-section" aria-labelledby="industry-list">
        <div className="lf-container">
          <SectionHeader id="industry-list" eyebrow="All industries" title="Industries we serve">
            Descriptions as published on linkfields.com.
          </SectionHeader>
          <div className="lf-grid lf-grid--wide">
            {industries.map((ind, i) => {
              const related = getDemos(ind.relatedDemos);
              return (
                <m.article key={ind.id} id={ind.id} className="lf-card" {...stagger(i, 0.04)}>
                  <div className="lf-card__head">
                    <h3>{ind.name}</h3>
                    <StatusBadge status={ind.status} />
                  </div>
                  <p>{ind.text}</p>
                  {related.length > 0 && (
                    <div>
                      <h4 className="lf-card__subhead">Related demos in the LFI AI catalogue</h4>
                      <ul className="lf-chip-list">
                        {related.map((d) => (
                          <li key={d.id}><SmartLink className="lf-chip lf-chip--link" href={d.href}>{d.name}</SmartLink></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="lf-card__foot">
                    <SmartLink href={ind.href} className="lf-link-arrow">{ind.name} on linkfields.com</SmartLink>
                  </div>
                </m.article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
