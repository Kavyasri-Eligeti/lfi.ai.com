import { NavLink } from 'react-router-dom';
import { m } from 'framer-motion';
import { planets } from '../../content/universe';
import StatusBadge from './StatusBadge';
import { stagger } from '../../features/motion/tokens';

// Conventional, list-based access to every planet: the 3D universe is an
// enhancement, never the only route to content.
export default function UniverseIndex({ headingLevel = 3, compact = false }) {
  const Heading = `h${headingLevel}`;
  return (
    <ul className={`lf-universe-index${compact ? ' is-compact' : ''}`}>
      {planets.map((p, i) => (
        <m.li key={p.id} {...stagger(i)}>
          <NavLink to={`/universe/${p.id}`} className="lf-planet-card">
            <span
              className="lf-planet-card__orb"
              aria-hidden="true"
              style={{
                background: `radial-gradient(circle at 32% 30%, ${p.visual.colors[2]}, ${p.visual.colors[1]} 45%, ${p.visual.colors[0]} 80%)`,
                boxShadow: `0 0 24px ${p.visual.atmosphere}55`,
              }}
            />
            <span className="lf-planet-card__body">
              <Heading className="lf-planet-card__title">{p.name}</Heading>
              {!compact && <span className="lf-planet-card__tagline">{p.tagline}</span>}
              <span className="lf-planet-card__meta">
                <StatusBadge status={p.status} />
                {p.demos.length > 0 && <span className="lf-meta">{p.demos.length} demos</span>}
              </span>
            </span>
          </NavLink>
        </m.li>
      ))}
    </ul>
  );
}
