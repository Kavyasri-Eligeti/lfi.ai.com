import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { FIELD_TILES, restHeight, waveHeight } from './layout';
import './field.css';

const WAVE_MS = 8000;
const TILT = 6; // degrees

// WebGL is an enhancement for large screens with a fine pointer. Everything
// else (phones, tablets, reduced motion, no WebGL) keeps the CSS 3D field.
function canUseWebGL() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return false;
  if (navigator.connection?.saveData) return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const whenIdle = (fn) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 2500 }) : window.setTimeout(fn, 1200);

/**
 * The hero's modular intelligence field. Renders the CSS 3D tier immediately
 * (it is part of the first paint, with no JavaScript dependency) and upgrades to
 * the WebGL tier after the page is idle on capable desktops.
 */
export default function ModularField({ interactRef, className = '' }) {
  const { reduced } = useMotion();
  const fieldRef = useRef(null);
  const stageRef = useRef(null);
  const canvasHost = useRef(null);
  const [webgl, setWebgl] = useState(false);

  // CSS tier: wave and pointer tilt.
  useEffect(() => {
    const field = fieldRef.current;
    if (!field || webgl) return undefined;
    const tiles = Array.from(field.children);
    const apply = (phase) =>
      tiles.forEach((t, i) => {
        const kind = FIELD_TILES[i];
        t.style.setProperty('--h', `${(restHeight(kind) + (reduced ? 0 : waveHeight(kind, i, phase))).toFixed(1)}px`);
      });
    apply(0);
    if (reduced) return undefined;

    let phase = 0;
    let visible = true;
    let timer = 0;
    const tick = () => {
      if (visible && !document.hidden) {
        phase += 1.1;
        apply(phase);
      }
      timer = window.setTimeout(tick, WAVE_MS / 3);
    };
    timer = window.setTimeout(tick, 1400);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(field);

    const host = interactRef?.current;
    let raf = 0;
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        field.style.setProperty('--rx', `${(58 - y * TILT * 2).toFixed(2)}deg`);
        field.style.setProperty('--rz', `${(-42 + x * TILT * 2).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      field.style.setProperty('--rx', '58deg');
      field.style.setProperty('--rz', '-42deg');
    };
    host?.addEventListener('pointermove', onMove);
    host?.addEventListener('pointerleave', onLeave);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      io.disconnect();
      host?.removeEventListener('pointermove', onMove);
      host?.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced, webgl, interactRef]);

  // WebGL tier: loaded after idle, only where it helps.
  useEffect(() => {
    if (reduced || !canUseWebGL()) return undefined;
    let engine = null;
    let cancelled = false;
    const handle = whenIdle(async () => {
      try {
        const { createFieldEngine } = await import(/* webpackChunkName: "field-webgl" */ './fieldEngine');
        if (cancelled || !canvasHost.current) return;
        engine = await createFieldEngine(canvasHost.current, { interactEl: interactRef?.current || stageRef.current });
        if (cancelled) {
          engine.dispose();
          return;
        }
        setWebgl(true);
      } catch (err) {
        // Any failure keeps the CSS tier, which is already on screen.
        if (process.env.NODE_ENV === 'development') console.warn('WebGL field unavailable:', err);
      }
    });
    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      engine?.dispose();
      setWebgl(false);
    };
  }, [reduced, interactRef]);

  return (
    <div ref={stageRef} className={`lf-field-stage${webgl ? ' is-webgl' : ''} ${className}`} aria-hidden="true">
      <div ref={canvasHost} className="lf-field-canvas" />
      <div className="lf-field-css">
        <div ref={fieldRef} className="lf-mfield">
          {FIELD_TILES.map((kind, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <i key={i} className={`lf-mfield__t lf-mfield__t--${kind}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
