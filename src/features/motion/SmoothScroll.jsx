import { useEffect } from 'react';
import { useMotion } from './MotionProvider';

// Inertial smooth scrolling (Lenis) for the whole site. It drives the native
// scroll position, so sticky elements, scroll-linked motion and anchors keep
// working. Off for reduced motion, and in tests.
let instance = null;
export const getLenis = () => instance;

/** Jumps to a position without smoothing (used between pages). */
export function jumpTo(y = 0) {
  if (instance) instance.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
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
        lerp: 0.11, // soft glide that still follows the wheel closely
        wheelMultiplier: 1,
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
