import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionProvider';

// The WebGL theatre runs from tablet width up, unless data saving is on.
// Phones, reduced motion and browsers without WebGL get the DOM deck.
export function canUseTheatre() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  if (!window.matchMedia('(min-width: 768px)').matches) return false;
  if (navigator.connection?.saveData) return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The fixed, full-screen canvas behind the homepage. Loads the theatre
 * engine when the browser is idle and reports it through `onEngine`.
 */
export default function TheatreStage({ sections, withMark = true, onEngine, onActive, onSelect, onFail }) {
  const { reduced } = useMotion();
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onActive, onSelect, onEngine, onFail });
  handlers.current = { onActive, onSelect, onEngine, onFail };

  useEffect(() => {
    if (reduced || !canUseTheatre()) {
      handlers.current.onFail?.();
      return undefined;
    }
    let engine = null;
    let cancelled = false;
    const load = () =>
      import(/* webpackChunkName: "theatre" */ './theatreEngine')
        .then(({ createTheatre }) =>
          createTheatre(host.current, {
            sections: sections.current,
            withMark,
            onActive: (i) => handlers.current.onActive?.(i),
            onSelect: (card) => handlers.current.onSelect?.(card),
          })
        )
        .then((e) => {
          if (cancelled) {
            e.dispose();
            return;
          }
          engine = e;
          handlers.current.onEngine?.(e);
          setReady(true);
        })
        .catch((err) => {
          if (process.env.NODE_ENV === 'development') console.warn('Theatre unavailable:', err);
          handlers.current.onFail?.();
        });
    const idle = 'requestIdleCallback' in window;
    const handle = idle ? window.requestIdleCallback(load, { timeout: 400 }) : window.setTimeout(load, 50);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      engine?.dispose();
      handlers.current.onEngine?.(null);
      setReady(false);
    };
  }, [reduced, sections, withMark]);

  return <div ref={host} className={`th-stage${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
