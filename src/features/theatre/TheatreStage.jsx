import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { whenPageSettled } from '../motion/pageSettled';

// The WebGL theatre runs from tablet width up, unless data saving is on.
// Phones, reduced motion and browsers without WebGL get the DOM logo.
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

const loadEngine = () => import(/* webpackChunkName: "theatre" */ './theatreEngine');

/**
 * Downloads the theatre engine in the background, once the current page is
 * idle, so a later visit to the homepage draws the 3D ring at once. Only on
 * devices that will run it: phones, reduced motion and data saving skip it.
 */
export function warmTheatre() {
  if (!canUseTheatre()) return;
  if (document.documentElement.dataset.motion === 'reduced') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const go = () => loadEngine().catch(() => {});
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 4000 });
  else window.setTimeout(go, 2500);
}

/**
 * The fixed, full-screen canvas behind the homepage intro and statement.
 * Loads the theatre engine straight away (warmTheatre has usually fetched it
 * while the visitor was on other pages); calls `onReady` once the first frame
 * is on screen, or `onFail` where it cannot run.
 */
export default function TheatreStage({ sections, onReady, onFail }) {
  const { reduced } = useMotion();
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  const handlers = useRef({ onReady, onFail });
  handlers.current = { onReady, onFail };

  useEffect(() => {
    if (reduced || !canUseTheatre()) {
      handlers.current.onFail?.();
      return undefined;
    }
    let engine = null;
    let cancelled = false;
    const load = () =>
      loadEngine()
        .then(({ createTheatre }) =>
          createTheatre(host.current, {
            sections: sections.current,
            onFirstFrame: () => {
              if (cancelled) return;
              setReady(true);
              handlers.current.onReady?.();
            },
          })
        )
        .then((e) => {
          if (cancelled) {
            e.dispose();
            return;
          }
          engine = e;
        })
        .catch((err) => {
          if (process.env.NODE_ENV === 'development') console.warn('Theatre unavailable:', err);
          handlers.current.onFail?.();
        });
    // A short idle wait keeps the first paint of the page smooth; the DOM logo
    // covers the intro meanwhile.
    // It also waits for a page change to finish, so the curtain never stutters.
    const idle = 'requestIdleCallback' in window;
    let handle = 0;
    const cancelWait = whenPageSettled(() => {
      handle = idle ? window.requestIdleCallback(load, { timeout: 120 }) : window.setTimeout(load, 16);
    });
    return () => {
      cancelled = true;
      cancelWait();
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      engine?.dispose();
      setReady(false);
    };
  }, [reduced, sections]);

  return <div ref={host} className={`th-stage${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
