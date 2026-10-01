// Motion design tokens, shared by CSS (styles/tokens.css) and Motion for React.
// Durations are in seconds.

export const DURATION = {
  micro: 0.15,
  ui: 0.3,
  section: 0.6,
  hero: 0.9,
};

export const EASE = {
  out: [0.22, 0.8, 0.24, 1],
  inOut: [0.65, 0, 0.35, 1],
};

// Standard reveal used for section content. Transform-only on purpose: text is
// always fully painted (no late LCP from fading content, no contrast failures,
// nothing invisible if an observer fails). It glides 12px into place, once.
export const reveal = {
  initial: { y: 16 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: DURATION.section, ease: EASE.out },
};

export const stagger = (i, step = 0.05) => ({
  ...reveal,
  transition: { ...reveal.transition, delay: Math.min(i * step, 0.3) },
});

// Layout transitions for filtered grids (interruptible).
export const layoutTransition = { duration: DURATION.ui, ease: EASE.out };
