import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../features/motion/MotionProvider';
import './industry-scene.css';

/**
 * An industry panel's art drawn live in 3D instead of a video clip. `load`
 * resolves to the scene's factory, `(host, { onReady }) => engine`; it is
 * code-split and only called once the panel nears the viewport. The engine
 * animates while on screen and stops when it leaves. Without WebGL, or under
 * reduced motion, the poster frame stays still.
 */
export function canRender3d() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function LiveScene({ industry, load }) {
  const { reduced } = useMotion();
  const [enabled] = useState(() => !reduced && canRender3d());
  const wrap = useRef(null);
  const host = useRef(null);
  const engine = useRef(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!enabled || !el) return undefined;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '60% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !near) return undefined;
    let cancelled = false;
    load()
      .then((create) => {
        if (cancelled || !host.current) return;
        engine.current = create(host.current, {
          onReady: () => {
            if (cancelled) return;
            setReady(true);
            engine.current?.play();
          },
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [enabled, near, load]);

  return (
    <div ref={wrap} className={`lf-footage${ready ? ' is-playing' : ''}`} aria-hidden="true">
      <img className="lf-footage__poster" src={industry.poster} alt="" width="576" height="720" loading="lazy" decoding="async" />
      {enabled && <div ref={host} className="lf-footage__stage" />}
      <span className="lf-footage__grade" />
    </div>
  );
}
