// Motion design tokens, shared by CSS (styles/tokens.css) and Motion for React.
// Durations are in seconds.

export const DURATION = {
  micro: 0.16,
  ui: 0.32,
  section: 1.1,
  hero: 1.6,
  page: 0.8,
};

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  cinematic: [0.22, 1, 0.36, 1],
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
