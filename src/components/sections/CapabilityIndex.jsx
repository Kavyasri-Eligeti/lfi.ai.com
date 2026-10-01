import { useId, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Link } from 'react-router-dom';
import SmartLink from '../ui/SmartLink';
import Icon, { Arrow } from '../ui/Icon';
import { capabilities } from '../../content/capabilities';
import { getDemos } from '../../content/demos';
import { EASE } from '../../features/motion/tokens';

/**
 * The living index: every AI capability backed by live demos. Choosing a row
 * (hover, focus or click) previews its demos in the panel. Works as a set of
 * tabs for keyboard and screen-reader users.
 */
export default function CapabilityIndex() {
  const [active, setActive] = useState(capabilities[0].id);
  const uid = useId();
  const cap = capabilities.find((c) => c.id === active);
  const demos = getDemos(cap.demos);

  const onKey = (e, i) => {
    const n = capabilities.length;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(capabilities[next].id);
    document.getElementById(`${uid}-tab-${capabilities[next].id}`)?.focus();
  };

  return (
    <div className="lf-capindex">
      <div className="lf-capindex__rows" role="tablist" aria-label="AI capabilities" aria-orientation="vertical">
        {capabilities.map((c, i) => (
          <button
            key={c.id}
            id={`${uid}-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={c.id === active}
            aria-controls={`${uid}-panel`}
            tabIndex={c.id === active ? 0 : -1}
            className="lf-capindex__row"
            onMouseEnter={() => setActive(c.id)}
            onFocus={() => setActive(c.id)}
            onClick={() => setActive(c.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="lf-capindex__k" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="lf-capindex__name">
              {c.name}
              <span className="lf-capindex__short">{c.short}</span>
            </span>
            <span className="lf-capindex__count lf-num">
              {c.demos.length}
              <span className="lf-visually-hidden"> demos</span>
            </span>
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="lf-capindex__panel">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            className="lf-capindex__card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE.out }}
          >
            <p className="lf-eyebrow">{cap.demos.length} {cap.demos.length === 1 ? 'demo' : 'demos'}</p>
            <h3>{cap.name}</h3>
            <p>{cap.summary}</p>
            <ul className="lf-list-plain lf-capindex__demos">
              {demos.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <SmartLink href={d.href}>
                    <span>{d.name}</span>
                    <Icon name={d.href.startsWith('/') ? 'arrow' : 'external'} size={15} />
                  </SmartLink>
                </li>
              ))}
            </ul>
            <Link className="lf-link" to={`/solutions?capability=${cap.id}#products`}>
              {demos.length > 6 ? `All ${demos.length} ${cap.name} demos` : `Browse ${cap.name} in the catalogue`}
              <Arrow />
            </Link>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
