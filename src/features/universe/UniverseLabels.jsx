import { forwardRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { planets, worlds } from '../../content/universe';
import { technologyById } from '../../content/technologies';

// HTML labels for 3D objects. The engine positions them each frame by writing
// `transform` and `data-visible` directly (no React re-render). Clickable labels
// are real links, so they are keyboard- and screen-reader-accessible.
// Hidden labels get tabIndex -1 and aria-hidden from the engine.
const UniverseLabels = forwardRef(function UniverseLabels({ engineRef, focusedId }, ref) {
  const hover = (id) => () => engineRef.current?.setHover(id);
  const unhover = () => engineRef.current?.setHover(null);
  const common = (id) => ({
    'data-label-id': id,
    'data-visible': 'false',
    'aria-hidden': 'true',
    tabIndex: -1,
    onMouseEnter: hover(id),
    onMouseLeave: unhover,
    onFocus: hover(id),
    onBlur: unhover,
  });

  return (
    <div className="lf-labels" ref={ref}>
      {planets.map((p) => (
        <Link
          key={p.id}
          to={`/universe/${p.id}`}
          className={`lf-label lf-label--planet${focusedId === p.id ? ' is-focused' : ''}`}
          aria-current={focusedId === p.id ? 'page' : undefined}
          {...common(p.id)}
        >
          <span className="lf-label__name">{p.name}</span>
          {p.status === 'proposed' && <span className="lf-label__tag">Proposed</span>}
        </Link>
      ))}
      {planets.flatMap((p) =>
        p.moons.map((techId) => (
          <span
            key={`${p.id}:${techId}`}
            className="lf-label lf-label--moon"
            data-label-id={`${p.id}:${techId}`}
            data-visible="false"
            aria-hidden="true"
          >
            {technologyById[techId]?.name}
          </span>
        ))
      )}
      {['solutions', 'services'].flatMap((w) =>
        worlds[w].satellites.map((s) => (
          <Link key={`${w}:${s.id}`} to={s.href} className="lf-label lf-label--satellite" {...common(`${w}:${s.id}`)}>
            {s.name}
          </Link>
        ))
      )}
      {worlds.industries.stars.map((s) => (
        <Link key={s.id} to={s.href} className="lf-label lf-label--star" {...common(`industries:${s.id}`)}>
          {s.name}
        </Link>
      ))}
    </div>
  );
});

export default memo(UniverseLabels);
