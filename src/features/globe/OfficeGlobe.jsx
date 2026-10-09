import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionProvider';
import './globe.css';

export function canUseGlobe() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const MARK = `${process.env.PUBLIC_URL || ''}/brand/linkfields-mark.svg`;
const coord = (v, pos, neg) => `${Math.abs(v).toFixed(4)}°${v >= 0 ? pos : neg}`;

/**
 * The 3D office globe: a photoreal Earth with a small Linkfields mark on each
 * branch. A branch's name and address appear only while the cursor (or
 * keyboard focus) is on its mark; clicking selects it in the list. When
 * `active` changes from the list, the globe flies to that office. Calls
 * `onFail` where WebGL is unavailable or motion is reduced, so the caller can
 * show the flat map instead.
 */
export default function OfficeGlobe({ offices, active, onSelect, onFail }) {
  const { reduced } = useMotion();
  const host = useRef(null);
  const engine = useRef(null);
  const markers = useRef({});
  const [hover, setHover] = useState(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onFail });
  handlers.current = { onFail };

  // The globe sits low on its pages, so it is built only when it comes within
  // about a screen of view: the page above it loads and scrolls without the
  // cost of the 3D engine, its textures and shader compilation.
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near || !host.current) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    io.observe(host.current);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (reduced || !canUseGlobe()) {
      handlers.current.onFail?.();
      return undefined;
    }
    if (!near) return undefined;
    let cancelled = false;
    import(/* webpackChunkName: "globe" */ './globeEngine')
      .then(({ createGlobe }) => {
        if (cancelled || !host.current) return;
        engine.current = createGlobe(host.current, { offices, markers: markers.current });
        setReady(true);
      })
      .catch(() => handlers.current.onFail?.());
    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [reduced, offices, near]);

  // Fly to an office only when one is chosen; the list's initial selection
  // leaves the opening view (which shows the northern offices) alone.
  const initial = useRef(active);
  useEffect(() => {
    if (!ready || !active) return;
    if (active === initial.current) {
      initial.current = null;
      return;
    }
    initial.current = null;
    engine.current?.focus(active);
  }, [active, ready]);
  useEffect(() => {
    engine.current?.hover(hover);
  }, [hover]);

  const shown = offices.find((o) => o.id === hover);

  return (
    <div className={`lf-globe${ready ? ' is-ready' : ''}`}>
      <div ref={host} className="lf-globe__stage" aria-hidden="true" />
      <ul className="lf-list-plain lf-globe__markers" aria-label="Linkfields offices on the globe">
        {offices.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              ref={(el) => { markers.current[o.id] = el; }}
              className={`lf-globe__marker${o.id === active ? ' is-active' : ''}${o.id === hover ? ' is-hover' : ''}`}
              aria-label={`${o.city}, ${o.country}`}
              onMouseEnter={() => setHover(o.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(o.id)}
              onBlur={() => setHover(null)}
              onClick={() => onSelect?.(o.id)}
            >
              <img src={MARK} alt="" width="22" height="24" draggable="false" />
              <span className="lf-globe__name" aria-hidden="true">{o.city}</span>
            </button>
          </li>
        ))}
      </ul>
      {shown && (
        <div className="lf-globe__card" role="status" aria-live="polite">
          <p className="lf-globe__card-kicker">-&gt; Linkfields {shown.country}</p>
          <p className="lf-globe__card-city">{shown.city}</p>
          <p className="lf-globe__card-address">{shown.address}</p>
          <p className="lf-globe__card-coords">
            {coord(shown.approx.lat, 'N', 'S')} {coord(shown.approx.lon, 'E', 'W')}
            {shown.areaOnly ? ' · area' : ''}
          </p>
        </div>
      )}
      <p className="lf-globe__hint" aria-hidden="true">Drag to turn · hover a Linkfields mark</p>
    </div>
  );
}
