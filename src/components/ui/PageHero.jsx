import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import GlitchText from '../fx/GlitchText';
import './page-hero.css';

/**
 * The page hero shared by every page, in the homepage statement's layout:
 * a huge decoding headline on the left, the copy and actions on the right.
 * As the page scrolls on, the hero lifts and fades. `aside` adds
 * page-specific content (such as a jump list) beneath the copy.
 */
export default function PageHero({ eyebrow, title, children, actions, aside }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <section ref={ref} className="lf-page-hero" aria-labelledby="page-title">
      <m.div className="lf-container lf-page-hero__inner" style={{ opacity, y }}>
        <div className="lf-page-hero__head lf-cine">
          {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
          <h1 id="page-title">{typeof title === 'string' ? <GlitchText text={title} trigger="mount" delay={150} /> : title}</h1>
        </div>
        <div className="lf-page-hero__side lf-cine">
          {children && (typeof children === 'string' ? <p className="lf-lead">{children}</p> : <div className="lf-page-hero__lead">{children}</div>)}
          {actions && <div className="lf-actions">{actions}</div>}
          {aside && <div className="lf-page-hero__aside">{aside}</div>}
        </div>
      </m.div>
    </section>
  );
}
