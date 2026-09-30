import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { detectProfile } from '../universe/engine/profiles';

/**
 * Interactive office globe. It loads lazily when scrolled into view and is
 * skipped entirely on the LIGHT and STATIC profiles (lightweight fallback).
 * Office details are always rendered as accessible HTML next to it.
 */
export function useGlobeEnabled() {
  const { reduced } = useMotion();
  const [capable] = useState(() => {
    const p = detectProfile({ reducedMotion: false });
    return p === 'high' || p === 'balanced';
  });
  return capable && !reduced;
}

export default function OfficeGlobe({ offices, activeId }) {
  const enabled = useGlobeEnabled();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    const el = containerRef.current;
    let disposed = false;
    let loading = false;
    const io = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        if (engineRef.current) engineRef.current.start();
        else if (!loading) {
          loading = true;
          try {
            const { createGlobe } = await import(/* webpackChunkName: "globe" */ './globeEngine');
            if (disposed) return;
            engineRef.current = createGlobe({ canvas: canvasRef.current, container: el, offices, onReady: () => setReady(true) });
          } catch {
            /* keep fallback */
          }
        }
      } else {
        engineRef.current?.stop();
      }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [enabled, offices]);

  useEffect(() => {
    if (activeId) engineRef.current?.focus(activeId);
  }, [activeId, ready]);

  return (
    <div className="lf-globe" ref={containerRef} aria-hidden="true">
      {!ready && (
        <div className="lf-globe__fallback">
          <svg viewBox="-100 -100 200 200" width="70%" height="70%">
            <circle r="92" fill="#0b1430" stroke="#4f7dff" strokeOpacity="0.6" />
            {[30, 60].map((ry) => (
              <ellipse key={ry} rx="92" ry={ry} fill="none" stroke="#4f7dff" strokeOpacity="0.3" />
            ))}
            {[30, 60].map((rx) => (
              <ellipse key={rx} rx={rx} ry="92" fill="none" stroke="#4f7dff" strokeOpacity="0.3" />
            ))}
            <line x1="-92" x2="92" stroke="#4f7dff" strokeOpacity="0.45" />
          </svg>
        </div>
      )}
      {enabled && <canvas ref={canvasRef} />}
    </div>
  );
}
