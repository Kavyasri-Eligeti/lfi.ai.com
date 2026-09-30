import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { UniverseContext } from './UniverseContext';
import { useRenderProfile } from './useRenderProfile';
import UniverseFallback from './UniverseFallback';
import UniverseLabels from './UniverseLabels';
import DebugHUD from './DebugHUD';
import { planets, worlds } from '../../content/universe';
import './universe.css';

// Runs `fn` after the window `load` event and the next idle period, so the 3D
// engine never competes with the page's first render (LCP) or initial input.
const whenIdle = (fn) => {
  let cancel = () => {};
  const schedule = () => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(fn, { timeout: 1500 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(fn, 300);
      cancel = () => window.clearTimeout(id);
    }
  };
  if (document.readyState === 'complete') schedule();
  else {
    window.addEventListener('load', schedule, { once: true });
    cancel = () => window.removeEventListener('load', schedule);
  }
  return () => cancel();
};

/**
 * Persistent 3D stage shared by "/" and "/universe/:planetId", so the camera
 * can fly continuously between them. The engine is loaded lazily after the
 * page's HTML has rendered (it is never on the critical path for LCP).
 */
export default function UniverseLayout() {
  const detected = useRenderProfile();
  const [failed, setFailed] = useState(false);
  const profile = failed ? 'static' : detected;
  const [ready, setReady] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const engineRef = useRef(null);
  const pending = useRef({ progress: 0, suspended: false });

  const focus = useMatch('/universe/:planetId');
  const planetId = focus?.params.planetId;
  const modeRef = useRef(null);
  const navigate = useNavigate();

  // Create / dispose the engine
  useEffect(() => {
    if (profile === 'static') return undefined;
    let disposed = false;
    let engine = null;
    const cancelIdle = whenIdle(async () => {
      try {
        const { createUniverse } = await import(/* webpackChunkName: "universe" */ './engine/UniverseEngine');
        if (disposed || !canvasRef.current) return;
        engine = await createUniverse({
          canvas: canvasRef.current,
          container: containerRef.current,
          profile,
          content: { planets, worlds },
          onSelect: (anchor) => {
            if (anchor.kind === 'planet') navigate(`/universe/${anchor.planetId}`);
            else if (anchor.href) navigate(anchor.href);
          },
          onContextLost: () => setFailed(true),
        });
        // Compile shaders off the main thread (KHR_parallel_shader_compile)
        // before the first frame, so there are no long compile tasks.
        await engine.warm();
        if (disposed) {
          engine.dispose();
          return;
        }
        engineRef.current = engine;
        engine.bindLabels(labelsRef.current);
        const id = modeRef.current;
        if (id) engine.setMode({ type: 'focus', planetId: id }, { immediate: true });
        else {
          engine.setScrollProgress(pending.current.progress, { immediate: true });
          engine.intro();
          engine.setMode({ type: 'scroll' });
        }
        if (!pending.current.suspended) engine.start();
        setReady(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('3D universe unavailable, using static fallback.', err);
        setFailed(true);
      }
    });
    return () => {
      disposed = true;
      cancelIdle();
      engine?.dispose();
      engineRef.current = null;
      setReady(false);
    };
  }, [profile, navigate]);

  // Mode follows the route (camera follows URL, never the reverse)
  useEffect(() => {
    const prev = modeRef.current;
    modeRef.current = planetId || null;
    const engine = engineRef.current;
    if (!engine || prev === modeRef.current) return;
    engine.setMode(planetId ? { type: 'focus', planetId } : { type: 'scroll' });
  }, [planetId]);

  const setScrollProgress = useCallback((p) => {
    pending.current.progress = p;
    engineRef.current?.setScrollProgress(p);
  }, []);

  const setSuspended = useCallback((suspended) => {
    pending.current.suspended = suspended;
    engineRef.current?.setActive(!suspended);
  }, []);

  const value = useMemo(
    () => ({ engineRef, profile, ready, setScrollProgress, setSuspended }),
    [profile, ready, setScrollProgress, setSuspended]
  );

  return (
    <UniverseContext.Provider value={value}>
      <div className={`lf-stage lf-stage--${profile}${ready ? ' is-ready' : ''}`} ref={containerRef} aria-hidden={profile === 'static' ? 'true' : undefined}>
        <UniverseFallback className="lf-stage__fallback" />
        {profile !== 'static' && (
          <>
            <canvas ref={canvasRef} className="lf-stage__canvas" aria-hidden="true" />
            <UniverseLabels ref={labelsRef} engineRef={engineRef} focusedId={planetId} />
          </>
        )}
      </div>
      {failed && detected !== 'static' && (
        <p className="lf-stage__notice" role="status">
          3D view paused. <button type="button" onClick={() => setFailed(false)}>Retry</button>
        </p>
      )}
      <DebugHUD engineRef={engineRef} />
      <Outlet />
    </UniverseContext.Provider>
  );
}
