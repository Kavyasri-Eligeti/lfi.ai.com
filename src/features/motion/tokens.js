// Motion design tokens, shared by CSS (styles/tokens.css), framer-motion and GSAP.
// Durations are in seconds.

export const DURATION = {
  button: 0.2,
  card: 0.45,
  section: 0.7,
  camera: 2.0,       // cinematic camera fly-to
  cameraShort: 1.3,  // camera retarget within the same view
};

export const EASE = {
  out: [0.22, 0.8, 0.24, 1],
  inOut: [0.65, 0, 0.35, 1],
  gsapOut: 'power3.out',
  gsapInOut: 'power2.inOut',
};

// Standard reveal used for section content. Transform-only on purpose: text is
// always fully painted (no late LCP from fading content, no contrast failures,
// nothing invisible if an observer fails). It simply glides into place.
export const reveal = {
  initial: { y: 28 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: DURATION.section, ease: EASE.out },
};

export const stagger = (i, step = 0.06) => ({
  ...reveal,
  transition: { ...reveal.transition, delay: Math.min(i * step, 0.4) },
});
