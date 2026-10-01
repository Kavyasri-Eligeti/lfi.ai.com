import { useId, useMemo, useState } from 'react';
import { m } from 'framer-motion';
import Icon from '../ui/Icon';
import SmartLink from '../ui/SmartLink';
import { offices, telHref } from '../../content/company';
import { LAND_RUNS, MAP_GRID } from '../../features/map/worldGrid';

const { step, lat0, cols, rows } = MAP_GRID;
const project = ({ lat, lon }) => ({ x: (lon + 180) / step, y: (lat0 - lat) / step });

/**
 * Global presence: a dot-grid world map (land cells drawn as module dots) with
 * a marker per office, plus the full accessible office list. Marker positions
 * are city-level approximations; the list carries the published addresses.
 */
export default function OfficeMap({ headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const uid = useId();
  const [active, setActive] = useState(offices[0].id);
  const landPath = useMemo(
    () => LAND_RUNS.map((runs, r) => runs.map(([c, len]) => `M${c} ${r + 0.5}h${len}`).join('')).join(''),
    []
  );

  return (
    <div className="lf-officemap">
      <div className="lf-officemap__map">
        <svg viewBox={`0 0 ${cols} ${rows}`} role="img" aria-labelledby={`${uid}-map-title`} preserveAspectRatio="xMidYMid meet">
          <title id={`${uid}-map-title`}>World map with Linkfields offices in {offices.map((o) => o.city).join(', ')}</title>
          <path d={landPath} className="lf-officemap__land" />
          {offices.map((o, i) => {
            const { x, y } = project(o.approx);
            const on = o.id === active;
            return (
              <m.g
                key={o.id}
                className={`lf-officemap__pin${on ? ' is-active' : ''}`}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
                onClick={() => setActive(o.id)}
              >
                <circle cx={x} cy={y} r={on ? 3.6 : 2.6} className="lf-officemap__halo" />
                <rect x={x - 1.1} y={y - 1.1} width="2.2" height="2.2" rx="0.4" className="lf-officemap__dot" />
              </m.g>
            );
          })}
        </svg>
        <p className="lf-meta lf-officemap__note">Markers show city locations. Full addresses are in the list.</p>
      </div>

      <ul className="lf-list-plain lf-officemap__list">
        {offices.map((o) => {
          const on = o.id === active;
          return (
            <li key={o.id} className={`lf-office${on ? ' is-active' : ''}`}>
              <Heading className="lf-office__heading">
                <button
                  type="button"
                  className="lf-office__toggle"
                  aria-expanded={on}
                  aria-controls={`${uid}-${o.id}`}
                  onClick={() => setActive(o.id)}
                >
                  <span className="lf-office__city">
                    <span className="lf-office__name">{o.city}</span>
                    <span>{o.country}</span>
                  </span>
                  <Icon name="pin" size={18} />
                </button>
              </Heading>
              <div id={`${uid}-${o.id}`} className="lf-office__body" hidden={!on}>
                <address>{o.address}</address>
                <ul className="lf-list-plain lf-office__links">
                  {o.phones.map((p) => (
                    <li key={p}>
                      <a href={telHref(p)}><Icon name="phone" size={16} />{p}</a>
                    </li>
                  ))}
                  {o.directions && (
                    <li>
                      <SmartLink href={o.directions}><Icon name="pin" size={16} />Get directions<span className="lf-visually-hidden"> to the {o.city} office</span></SmartLink>
                    </li>
                  )}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
