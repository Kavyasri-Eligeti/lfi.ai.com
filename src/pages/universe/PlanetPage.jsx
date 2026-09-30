import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { planetById, planets } from '../../content/universe';
import { technologyById } from '../../content/technologies';
import { getDemos } from '../../content/demos';
import { corporateServices } from '../../content/services';
import { corporateSolutions } from '../../content/solutions';
import { proposedServices } from '../../content/proposals';
import { STATUS_META } from '../../content/status';
import StatusBadge from '../../components/ui/StatusBadge';
import SmartLink from '../../components/ui/SmartLink';
import UniverseIndex from '../../components/ui/UniverseIndex';
import { usePageMeta } from '../../hooks/usePageMeta';
import { DURATION, EASE } from '../../features/motion/tokens';
import './planet.css';

const serviceById = Object.fromEntries(corporateServices.map((s) => [s.id, s]));
const solutionById = Object.fromEntries(corporateSolutions.map((s) => [s.id, s]));
const proposedById = Object.fromEntries(proposedServices.map((s) => [s.id, s]));

export default function PlanetPage() {
  const { planetId } = useParams();
  const planet = planetById[planetId];
  const headingRef = useRef(null);
  usePageMeta(planet?.name, planet?.summary);

  // Move focus to the new heading so keyboard and screen-reader users land on the content.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [planetId]);

  if (!planet) return <Navigate to="/" replace />;

  const index = planets.findIndex((p) => p.id === planet.id);
  const prev = planets[(index + planets.length - 1) % planets.length];
  const next = planets[(index + 1) % planets.length];
  const demos = getDemos(planet.demos);

  return (
    <div className="lf-planet-page lf-dark">
      <AnimatePresence mode="wait" initial={false}>
        <m.article
          key={planet.id}
          className="lf-planet-panel"
          aria-labelledby="planet-title"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: DURATION.card, ease: EASE.out, delay: 0.15 }}
        >
          <nav className="lf-planet-panel__crumbs" aria-label="Breadcrumb">
            <Link to="/">AI Universe</Link> <span aria-hidden="true">/</span> <span aria-current="page">{planet.name}</span>
          </nav>

          <header>
            <p className="lf-eyebrow">Planet {index + 1} of {planets.length}</p>
            <h1 id="planet-title" ref={headingRef} tabIndex={-1}>{planet.name}</h1>
            <p className="lf-planet-panel__tagline">{planet.tagline}</p>
            <StatusBadge status={planet.status} />
          </header>

          <p>{planet.summary}</p>

          {demos.length > 0 ? (
            <section aria-labelledby="planet-demos">
              <h2 id="planet-demos" className="lf-planet-panel__h2">Linkfields demos on this planet</h2>
              <ul className="lf-planet-demos">
                {demos.map((d) => (
                  <li key={d.id}>
                    <SmartLink href={d.href} className="lf-planet-demo">
                      <span className="lf-planet-demo__name">{d.name}</span>
                      {d.status !== 'product' && <span className="lf-planet-demo__tag">{STATUS_META[d.status].label}</span>}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="lf-planet-panel__empty">
              No Linkfields demo exists for this category yet.
              {planet.status === 'proposed' && ' It is shown as a proposed area, awaiting business approval.'}
            </p>
          )}

          {(planet.corporateLinks || planet.services.corporate.length > 0) && (
            <section aria-labelledby="planet-offerings">
              <h2 id="planet-offerings" className="lf-planet-panel__h2">Related Linkfields offerings</h2>
              <ul className="lf-chip-list">
                {planet.services.corporate.map((id) => (
                  <li key={id}><Link className="lf-chip lf-chip--link" to={`/services#${id}`}>{serviceById[id].name}</Link></li>
                ))}
                {(planet.corporateLinks || []).map((id) => (
                  <li key={id}><Link className="lf-chip lf-chip--link" to={`/solutions#${id}`}>{solutionById[id].name}</Link></li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="planet-tech">
            <h2 id="planet-tech" className="lf-planet-panel__h2">Technologies in orbit</h2>
            <p className="lf-meta">General AI technologies. These are not Linkfields products.</p>
            <dl className="lf-planet-tech">
              {planet.moons.map((id) => (
                <div key={id}>
                  <dt>{technologyById[id].name}</dt>
                  <dd>{technologyById[id].text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {planet.services.proposed.length > 0 && (
            <section aria-labelledby="planet-proposed">
              <h2 id="planet-proposed" className="lf-planet-panel__h2">Proposed AI services</h2>
              <p className="lf-meta">Awaiting business approval. Not current offerings.</p>
              <ul className="lf-chip-list">
                {planet.services.proposed.map((id) => (
                  <li key={id}>
                    <Link className="lf-chip lf-chip--link lf-chip--proposed" to={`/services#${id}`}>{proposedById[id].name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="lf-planet-panel__pager" aria-label="Other planets">
            <Link to={`/universe/${prev.id}`} className="lf-btn lf-btn--ghost lf-btn--sm" rel="prev">← {prev.name}</Link>
            <Link to={`/universe/${next.id}`} className="lf-btn lf-btn--ghost lf-btn--sm" rel="next">{next.name} →</Link>
          </nav>
          <Link to="/" className="lf-btn lf-btn--accent lf-planet-panel__back">Back to the universe</Link>
        </m.article>
      </AnimatePresence>

      <nav className="lf-planet-page__index" aria-label="All AI planets">
        <UniverseIndex compact headingLevel={2} />
      </nav>
    </div>
  );
}
