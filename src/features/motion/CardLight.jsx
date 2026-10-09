import { useEffect } from 'react';

// Cards that carry the cursor-following backlight (see styles/card-light.css).
export const LIT_CARDS = '.lf-card, .lf-capindex__card, .lf-insight, .lf-partner, .lf-aisol, .lf-solution, .mh-final__card, .mh-tool';

/**
 * Feeds the pointer position to the card under it (--lx / --ly, in px), so
 * its light can follow the cursor. One listener for the whole page, updated
 * once per frame.
 */
export default function CardLight() {
  useEffect(() => {
    if (window.matchMedia?.('(hover: none)').matches) return undefined;
    let raf = 0;
    let last = null;
    const onMove = (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const t = last.target instanceof Element ? last.target.closest(LIT_CARDS) : null;
        if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--lx', `${(last.clientX - r.left).toFixed(1)}px`);
        t.style.setProperty('--ly', `${(last.clientY - r.top).toFixed(1)}px`);
      });
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
