import { useEffect } from 'react';
import { useMotion } from './MotionProvider';

// Inertial smooth scrolling (Lenis) for the whole site. It drives the native
// scroll position, so sticky elements, scroll-linked motion and anchors keep
// working. Off for reduced motion, and in tests.
let instance = null;
export const getLenis = () => instance;

/** Jumps to a position without smoothing (used between pages). */
export function jumpTo(y = 0) {
  // Native first (works even while the smooth scroller is paused), then
  // bring the smooth scroller's own position in line so it cannot drift back.
  window.scrollTo(0, y);
  if (instance) {
    instance.resize?.();
    instance.scrollTo(y, { immediate: true, force: true });
  }
}

export default function SmoothScroll() {
  const { reduced } = useMotion();
  useEffect(() => {
    if (reduced || process.env.NODE_ENV === 'test') return undefined;
    let cancelled = false;
    let lenis = null;
    import(/* webpackChunkName: "lenis" */ 'lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.14, // follows the wheel closely; lower values feel like dragging
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
        anchors: { offset: -80 },
        autoRaf: true,
      });
      instance = lenis;
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      if (instance === lenis) instance = null;
    };
  }, [reduced]);
  return null;
}
